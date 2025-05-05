"use client";

import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";

const client = generateClient<Schema>();

const FREE_TIER_SECONDS = 500;
const PRICE_PER_SECOND = 0.01;

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
    return <div>Loading settings...</div>;
  }

  if (!usage) {
    return <div>Unable to load usage data.</div>;
  }

  const billableSeconds = Math.max(usage.totalDuration - FREE_TIER_SECONDS, 0);
  const estimatedBill = billableSeconds * PRICE_PER_SECOND;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Settings</h1>

      <section style={{ marginTop: "2rem" }}>
        <h2>Usage This Month</h2>
        <p>
          <strong>Runs:</strong> {usage.runs}
        </p>
        <p>
          <strong>Total compute time:</strong> {usage.totalDuration.toFixed(2)}{" "}
          seconds
        </p>

        <div
          style={{
            marginTop: "1rem",
            height: "30px",
            background: "#eee",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min((usage.totalDuration / FREE_TIER_SECONDS) * 100, 100)}%`,
              background:
                usage.totalDuration > FREE_TIER_SECONDS ? "#f44336" : "#4caf50",
              height: "100%",
            }}
          ></div>
        </div>

        <p style={{ marginTop: "0.5rem" }}>
          {usage.totalDuration > FREE_TIER_SECONDS
            ? `Exceeded free tier by ${billableSeconds.toFixed(2)} seconds.`
            : `${(FREE_TIER_SECONDS - usage.totalDuration).toFixed(2)} free seconds remaining.`}
        </p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Billing</h2>
        <p>
          <strong>Estimated bill:</strong> ${estimatedBill.toFixed(2)}
        </p>
        <button
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => alert("Email with usage details sent! (demo)")}
        >
          Send Usage Email
        </button>
      </section>
    </div>
  );
}
