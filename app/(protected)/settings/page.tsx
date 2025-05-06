"use client";

import { useEffect, useState, useMemo } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import Navbar from "@/components/Navbar/Navbar";
import StatusBar from "@/components/StatusBar/StatusBar";
import styles from "./page.module.css";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";
import { jsPDF } from "jspdf";

const FREE_TIER_SECONDS = 3600 * 24; // 24 h
const PRICE_PER_SECOND = 0.02; // $0.02 / s

export default function SettingsPage() {
  const [usage, setUsage] = useState<{
    totalDuration: number;
    runs: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoize the Amplify Data client once
  const dataClient = useMemo(() => generateClient<Schema>(), []);

  useEffect(() => {
    async function fetchUsage() {
      setLoading(true);
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      try {
        // .list() takes predicate on fields directly
        const resp = await dataClient.models.Usage.list({
          filter: { month: { eq: month } },
        });

        if (resp.errors?.length) {
          throw resp.errors[0];
        }

        const record = resp.data[0];
        setUsage(
          record
            ? {
                totalDuration: record.totalDuration ?? 0,
                runs: record.runs ?? 0,
              }
            : { totalDuration: 0, runs: 0 }
        );
      } catch (err) {
        console.error("Failed to fetch usage", err);
        setUsage({ totalDuration: 0, runs: 0 });
      } finally {
        setLoading(false);
      }
    }

    fetchUsage();
  }, [dataClient]);

  // Invoice PDF generator
  const downloadInvoice = () => {
    if (!usage) return;
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const billable = Math.max(usage.totalDuration - FREE_TIER_SECONDS, 0);
    const amount = billable * PRICE_PER_SECOND;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${now.toLocaleDateString()}`, 14, 30);
    doc.text(`Billing Period: ${month}`, 14, 38);
    doc.line(14, 42, 196, 42);

    let y = 50;
    const rows = [
      ["Metric", "Value", "Unit Price", "Subtotal"],
      ["Total Runs", String(usage.runs), "-", "-"],
      [
        "Total Seconds",
        usage.totalDuration.toFixed(2),
        "$0.00 (free tier)",
        "-",
      ],
      [
        "Billable Secs",
        billable.toFixed(2),
        `$${PRICE_PER_SECOND.toFixed(2)}`,
        `$${amount.toFixed(2)}`,
      ],
      ["", "", "Total:", `$${amount.toFixed(2)}`],
    ];
    rows.forEach((row) => {
      row.forEach((cell, i) => doc.text(cell, 14 + i * 45, y));
      y += 8;
    });

    doc.save(`invoice-${month}.pdf`);
  };

  if (loading) {
    return <div className={styles.container}>Loading settings…</div>;
  }
  if (!usage) {
    return <div className={styles.container}>Unable to load usage data.</div>;
  }

  const billableSeconds = Math.max(usage.totalDuration - FREE_TIER_SECONDS, 0);
  const estimatedBill = billableSeconds * PRICE_PER_SECOND;
  const usagePercent = Math.min(
    (usage.totalDuration / FREE_TIER_SECONDS) * 100,
    100
  );
  const fillClass =
    usage.totalDuration > FREE_TIER_SECONDS
      ? styles.overFree
      : styles.underFree;

  return (
    <div>
      <Navbar />
      <Link href="/code" className={styles.backButton}>
        <IoMdArrowBack /> Back
      </Link>

      <div className={styles.container}>
        <h1 className={styles.title}>Settings &amp; Billing</h1>

        {/* Usage Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Usage This Month</h2>
            <span className={styles.stat}>{usage.runs} runs</span>
          </div>
          <p className={styles.infoText}>
            Total compute time:&nbsp;
            <strong>{usage.totalDuration.toFixed(2)} s</strong>
          </p>
          <div className={styles.progressBar}>
            <div
              className={`${styles.progressFill} ${fillClass}`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <p className={styles.infoText}>
            {usage.totalDuration > FREE_TIER_SECONDS
              ? `Exceeded free tier by ${billableSeconds.toFixed(2)} s.`
              : `${(FREE_TIER_SECONDS - usage.totalDuration).toFixed(2)} s remaining.`}
          </p>
        </div>

        {/* Billing Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Estimated Charges</h2>
            <span className={styles.stat}>${estimatedBill.toFixed(2)}</span>
          </div>
          <p className={styles.infoText}>
            Free tier: {FREE_TIER_SECONDS.toLocaleString()} s @ $0.00
            <br />
            Overages: ${PRICE_PER_SECOND.toFixed(2)}/s
          </p>
          <button className={styles.button} onClick={downloadInvoice}>
            Download Invoice (PDF)
          </button>
        </div>
      </div>

      <StatusBar />
    </div>
  );
}
