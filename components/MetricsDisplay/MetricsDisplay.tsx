// components/MetricsDisplay/MetricsDisplay.tsx
"use client";

import styles from "./MetricsDisplay.module.css";

interface MetricsDisplayProps {
  metrics: any;
}

const renderNested = (obj: any) => {
  return (
    <ul>
      {Object.entries(obj).map(([key, value]) => (
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
