// components/RunCodeButton/RunCodeButton.tsx
import React from "react";
import styles from "./RunCodeButton.module.css";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

interface CodeExecutorProps {
  code: string;
  onOutput: (output: string, metrics: { duration?: number } | null) => void;
}

const RunCodeButton = React.forwardRef<HTMLButtonElement, CodeExecutorProps>(
  ({ code, onOutput }, ref) => {
    const handleClick = async () => {
      try {
        const resp = await fetch(
          "https://spqs4bte4p6km4gwfh4ot7traq0jeztc.lambda-url.us-west-2.on.aws/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          }
        );
        const data = await resp.json();
        const duration = data.metrics?.duration ?? 0;
        const result = data.result ?? data.body ?? "No result";

        onOutput(result, data.metrics || null);

        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        // Correct .list predicate usage:
        const listResp = await client.models.Usage.list({
          filter: { month: { eq: month } },
        });
        const existing = listResp.data[0];

        if (existing) {
          await client.models.Usage.update({
            id: existing.id,
            month,
            totalDuration: (existing.totalDuration ?? 0) + duration,
            runs: (existing.runs ?? 0) + 1,
          });
        } else {
          await client.models.Usage.create({
            month,
            totalDuration: duration,
            runs: 1,
          });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        onOutput("Error: " + msg, null);
      }
    };

    return (
      <button ref={ref} className={styles.runCodeButton} onClick={handleClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M1.5 1.49C1.5 1.2055 1.7385 1.001 2 1C2.0815 1 2.165 1.0195 2.2445 1.0625L14.2375 7.5725C14.4095 7.6655 14.5 7.8325 14.5 8C14.5 8.1675 14.4095 8.335 14.2375 8.428L2.245 14.938C2.16999 14.9793 2.08563 15.0007 2 15C1.7385 14.999 1.5 14.7945 1.5 14.51V1.49Z"
            fill="#fff"
          />
        </svg>
        <span>Run</span>
      </button>
    );
  }
);

RunCodeButton.displayName = "RunCodeButton";
export default RunCodeButton;
