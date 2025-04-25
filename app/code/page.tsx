"use client";

import styles from "./page.module.css";
import CodeEditor from "@/components/CodeEditor/CodeEditor";
import Navbar from "@/components/Navbar/Navbar";
import Output from "@/components/Output/Output";
import Ribbon from "@/components/Ribbon/Ribbon";
import RunCodeButton from "@/components/RunCodeButton/RunCodeButton";
import MetricsDisplay from "@/components/MetricsDisplay/MetricsDisplay";
import { useState } from "react";
import ActivityBar from "@/components/ActivityBar/ActivityBar";
import Sidebar from "@/components/Sidebar/Sidebar";
import StatusBar from "@/components/StatusBar/StatusBar";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

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

const defaultPythonCode = `# This is a sample Python code.
# You can modify it and run it to see the output.

print("Hello, world!")`;

const CodePage = () => {
  const [code, setCode] = useState<string>(defaultPythonCode);
  const [output, setOutput] = useState<string>("");
  const [metrics, setMetrics] = useState<unknown>(null);

  const handleOutput = (result: string, metrics: unknown) => {
    setOutput(result);
    setMetrics(metrics);
  };

  const fsHandle = useFullScreenHandle();

  return (
    <>
      <FullScreen handle={fsHandle}>
        <Navbar fullScreenHandle={fsHandle} />

        <Ribbon />
        <div className={styles.content}>
          <ActivityBar />
          <Sidebar />

          <div className={styles.codeContainer}>
            <div className={styles.buttonGroup}>
              <RunCodeButton code={code} onOutput={handleOutput} />
            </div>

            <CodeEditor code={code} onCodeChange={setCode} />
            <Output output={output} />

            <MetricsDisplay metrics={metrics as Metrics} />
          </div>
        </div>

        <StatusBar />
      </FullScreen>
    </>
  );
};

export default CodePage;
