// components/RunCodeButton/RunCodeButton.tsx
import styles from "./RunCodeButton.module.css";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource"; // adjust path if needed

const client = generateClient<Schema>();

interface CodeExecutorProps {
  code: string;
  onOutput: (output: string, metrics: Record<string, unknown> | null) => void;
}

const RunCodeButton = ({ code, onOutput }: CodeExecutorProps) => {
  const handleClick = async () => {
    try {
      const response = await fetch(
        "https://m6g4qphfrx74s4g2l45uddowxm0ucrlf.lambda-url.us-east-1.on.aws/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        let errorMsg = "Error executing code.";
        if (responseData.error) {
          errorMsg = responseData.error;
        } else if (responseData.body) {
          try {
            const errorObj = JSON.parse(responseData.body);
            errorMsg = errorObj.error || errorMsg;
          } catch {
            errorMsg = responseData.body;
          }
        }
        onOutput(errorMsg, responseData.metrics || null);
      } else {
        if (responseData.result !== undefined) {
          onOutput(responseData.result, responseData.metrics);
        } else if (responseData.body) {
          try {
            const resultObj = JSON.parse(responseData.body);
            onOutput(resultObj.result || "", resultObj.metrics);
          } catch {
            onOutput(responseData.body, null);
          }
        } else {
          onOutput("No result returned.", null);
        }
      }

      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const seconds = responseData.metrics?.duration ?? 0;

      const usageRecord = await client.models.Usage.get({ id: `${month}` });
      await client.models.Usage.update({
        id: `${month}`, // use month as ID, or you can use custom logic
        month: month,
        totalDuration: (usageRecord?.data?.totalDuration ?? 0) + seconds,
        runs: (usageRecord?.data?.runs ?? 0) + 1,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      onOutput(errorMessage || "An unexpected error occurred.", null);
    }
  };

  return (
    <button className={styles.runCodeButton} onClick={handleClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M1.5 1.49C1.5 1.2055 1.7385 1.001 2 1C2.0815 1 2.165 1.0195 2.2445 1.0625L14.2375 7.5725C14.4095 7.6655 14.5 7.8325 14.5 8C14.5 8.1675 14.4095 8.335 14.2375 8.428L2.245 14.938C2.16999 14.9793 2.08563 15.0007 2 15C1.7385 14.999 1.5 14.7945 1.5 14.51V1.49Z"
          fill="#00884F"
        />
      </svg>
      <span>Run</span>
    </button>
  );
};

export default RunCodeButton;
