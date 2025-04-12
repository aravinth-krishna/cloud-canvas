// components/MetricsDisplay/MetricsDisplay.tsx
"use client";

import styles from "./MetricsDisplay.module.css";

interface SystemInfo {
  platform: string;
  platform_release: string;
  machine: string;
}

interface Metrics {
  start_time: string;
  end_time: string;
  duration: number;
  max_memory_kb: number;
  system_info: SystemInfo;
  python_version: string;
  pytorch_version: string;
  process_cpu_percent: number;
  process_memory_percent: number;
  io_counters: Record<string, unknown>;
  system_memory: Record<string, unknown>;
  system_cpu_percent: number;
  psutil_error?: string;
}

interface MetricsDisplayProps {
  metrics: Metrics;
}

const renderNested = (obj: unknown) => {
  return (
    <ul>
      {Object.entries(obj as Record<string, unknown>).map(([key, value]) => (
        <li key={key}>
          <strong>{key}:</strong>{" "}
          {value && typeof value === "object"
            ? renderNested(value)
            : String(value)}
        </li>
      ))}
    </ul>
  );
};

const MetricsDisplay = ({ metrics }: MetricsDisplayProps) => {
  if (!metrics) return null;

  return (
    <div className={styles.metricsContainer}>
      <h2>Execution Metrics</h2>
      <ul>
        <li>
          <strong>Start Time:</strong> {metrics.start_time}
        </li>
        <li>
          <strong>End Time:</strong> {metrics.end_time}
        </li>
        <li>
          <strong>Duration:</strong> {metrics.duration} seconds
        </li>
        <li>
          <strong>Max Memory Used:</strong> {metrics.max_memory_kb} KB
        </li>
        <li>
          <strong>System Info:</strong>{" "}
          {`${metrics.system_info.platform} ${metrics.system_info.platform_release} (${metrics.system_info.machine})`}
        </li>
        <li>
          <strong>Python Version:</strong> {metrics.python_version}
        </li>
        <li>
          <strong>PyTorch Version:</strong> {metrics.pytorch_version}
        </li>
        <li>
          <strong>Process CPU Percent:</strong> {metrics.process_cpu_percent}%
        </li>
        <li>
          <strong>Process Memory Percent:</strong>{" "}
          {metrics.process_memory_percent}%
        </li>
        <li>
          <strong>I/O Counters:</strong>
          {renderNested(metrics.io_counters)}
        </li>
        <li>
          <strong>System Memory:</strong>
          {renderNested(metrics.system_memory)}
        </li>
        <li>
          <strong>System CPU Percent:</strong> {metrics.system_cpu_percent}%
        </li>

        <li>
          <strong>psutil Error:</strong> {metrics.psutil_error}
        </li>
      </ul>
    </div>
  );
};

export default MetricsDisplay;
