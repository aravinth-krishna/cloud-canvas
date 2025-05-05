// app/(protected)/settings/page.tsx
"use client";

import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import StatusBar from "@/components/StatusBar/StatusBar";
import styles from "./page.module.css";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";

const client = generateClient<Schema>();

const FREE_TIER_SECONDS = 3600 * 24; // 1 hour per day for 30 days
const PRICE_PER_SECOND = 0.02; // $0.02 per second

export default function SettingsPage() {
  const [usage, setUsage] = useState<{
    totalDuration: number;
    runs: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      try {
        const response = await client.models.Usage.get({ id: month });
        if (response.data) {
          setUsage({
            totalDuration: response.data.totalDuration ?? 0,
            runs: response.data.runs ?? 0,
          });
        } else {
          setUsage({ totalDuration: 0, runs: 0 });
        }
      } catch (err) {
        console.error("Failed to fetch usage", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsage();
  }, []);

  if (loading) {
    return <div className={styles.container}>Loading settings...</div>;
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
        <h1 className={styles.title}>Settings</h1>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Usage This Month</h2>
            <span className={styles.stat}>{usage.runs} runs</span>
          </div>
          <p className={styles.infoText}>
            Total compute time:{" "}
            <strong>{usage.totalDuration.toFixed(2)}s</strong>
          </p>

          <div className={styles.progressBar}>
            <div
              className={`${styles.progressFill} ${fillClass}`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>

          <p className={styles.infoText}>
            {usage.totalDuration > FREE_TIER_SECONDS
              ? `Exceeded free tier by ${billableSeconds.toFixed(2)}s.`
              : `${(FREE_TIER_SECONDS - usage.totalDuration).toFixed(2)}s free remaining.`}
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Billing</h2>
            <span className={styles.stat}>${estimatedBill.toFixed(2)}</span>
          </div>
          <p className={styles.infoText}>
            Free tier: {FREE_TIER_SECONDS.toLocaleString()}s/month at $0.00
            <br />
            Overage: ${PRICE_PER_SECOND.toFixed(2)}/s
          </p>
          <button
            className={styles.button}
            onClick={() => alert("Email with usage details sent! (demo)")}
          >
            Email Invoice
          </button>
        </div>
      </div>
      <StatusBar />
    </div>
  );
}
