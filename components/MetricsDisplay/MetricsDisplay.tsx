"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import styles from "./MetricsDisplay.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

interface SystemInfo {
  platform: string;
  platform_release: string;
  machine: string;
}

export interface Metrics {
  start_time: string;
  end_time: string;
  duration: number;
  max_memory_kb: number;
  system_info: SystemInfo;
  python_version: string;
  pytorch_version: string;
  process_cpu_percent: number;
  process_memory_percent: number;
  io_counters: Record<string, number>;
  system_memory: { total: number; used: number };
  system_cpu_percent: number;
  psutil_error?: string;
}

interface MetricsDisplayProps {
  metrics: Metrics;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics }) => {
  if (!metrics) return null;

  const cpuData = {
    labels: ["Process", "System"],
    datasets: [
      {
        label: "CPU Utilization (%)",
        data: [metrics.process_cpu_percent, metrics.system_cpu_percent],
        borderColor: ["#4e79a7", "#f28e2b"],
        backgroundColor: ["rgba(78,121,167,0.2)", "rgba(242,142,43,0.2)"],
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const memUsedPerc =
    (metrics.system_memory.used / metrics.system_memory.total) * 100;
  const memData = {
    labels: ["Process", "System"],
    datasets: [
      {
        label: "Memory Usage (%)",
        data: [metrics.process_memory_percent, memUsedPerc],
        borderColor: ["#e15759", "#76b7b2"],
        backgroundColor: ["rgba(225,87,89,0.2)", "rgba(118,183,178,0.2)"],
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const ioLabels = Object.keys(metrics.io_counters);
  const ioValues = Object.values(metrics.io_counters);
  const ioData = {
    labels: ioLabels,
    datasets: [
      {
        label: "I/O Counters",
        data: ioValues,
        backgroundColor: ioLabels.map(
          (_, i) => `hsl(${(i * 360) / ioLabels.length}, 70%, 50%)`
        ),
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "" },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };

  return (
    <div className={styles.container}>
      <h1>Metrics Overview</h1>

      <section className={styles.cards}>
        <div className={styles.card}>
          <h3>Timeframe</h3>
          <p>
            {metrics.start_time} → {metrics.end_time}
          </p>
          <p>Duration: {metrics.duration}s</p>
        </div>

        <div className={styles.card}>
          <h3>Memory</h3>
          <p>Max Used: {metrics.max_memory_kb} KB</p>
        </div>

        <div className={styles.card}>
          <h3>System</h3>
          <p>
            {metrics.system_info.platform}{" "}
            {metrics.system_info.platform_release} (
            {metrics.system_info.machine})
          </p>
          <p>
            Python {metrics.python_version}, PyTorch {metrics.pytorch_version}
          </p>
        </div>

        {metrics.psutil_error && (
          <div className={styles.card}>
            <h3>Error</h3>
            <p>{metrics.psutil_error}</p>
          </div>
        )}
      </section>

      <section className={styles.charts}>
        <div className={styles.chart}>
          <Line
            data={cpuData}
            options={{
              ...commonOptions,
              plugins: {
                ...commonOptions.plugins,
                title: { display: true, text: "CPU Utilization" },
              },
            }}
          />
        </div>
        <div className={styles.chart}>
          <Line
            data={memData}
            options={{
              ...commonOptions,
              plugins: {
                ...commonOptions.plugins,
                title: { display: true, text: "Memory Usage" },
              },
            }}
          />
        </div>
        <div className={styles.chart}>
          <Doughnut
            data={ioData}
            options={{
              responsive: true,
              plugins: {
                title: { display: true, text: "I/O Counters" },
                legend: { position: "right" },
              },
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default MetricsDisplay;
