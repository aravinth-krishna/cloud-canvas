// components/ActivityBar/ActivityBar.tsx
"use client";
import { useEffect, useState } from "react";
import styles from "./ActivityBar.module.css";

const ActivityBar = () => {
  const [cpuUsage, setCpuUsage] = useState<number>(0);
  const [showCpu, setShowCpu] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showCpu) {
      // Simulate real‑time CPU usage; replace with a real API call as needed.
      interval = setInterval(() => {
        const randomCpu = Math.floor(Math.random() * 100);
        setCpuUsage(randomCpu);
      }, 1000);
    }
    return () => interval && clearInterval(interval);
  }, [showCpu]);

  return (
    <div className={styles.activityBar}>
      <button onClick={() => setShowCpu(!showCpu)}>CPU Utilization</button>
      {showCpu && (
        <div className={styles.cpuPanel}>
          <p>CPU Usage: {cpuUsage}%</p>
          <div className={styles.cpuBar}>
            <div className={styles.cpuFill} style={{ width: `${cpuUsage}%` }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityBar;
