"use client";

import { useState } from "react";
import styles from "./page.module.css";
import ActivityBar from "@/components/ActivityBar/ActivityBar";
import Sidebar from "@/components/Sidebar/Sidebar";
import CodeEditor from "@/components/CodeEditor/CodeEditor";
import RunCodeButton from "@/components/RunCodeButton/RunCodeButton";
import Output from "@/components/Output/Output";
import MetricsDisplay from "@/components/MetricsDisplay/MetricsDisplay";
import Navbar from "@/components/Navbar/Navbar";
import Ribbon from "@/components/Ribbon/Ribbon";
import StatusBar from "@/components/StatusBar/StatusBar";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

type Tab = "files" | "metrics";

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
  const [activeTab, setActiveTab] = useState<Tab>("files");
  const [code, setCode] = useState(defaultPythonCode);
  const [output, setOutput] = useState("");
  const [metrics, setMetrics] = useState<unknown>(null);
  const fsHandle = useFullScreenHandle();

  const handleOutput = (result: string, metrics: unknown) => {
    setOutput(result);
    setMetrics(metrics);
  };

  return (
    <FullScreen handle={fsHandle}>
      <Navbar fullScreenHandle={fsHandle} />
      <Ribbon />

      <div className={styles.content}>
        {/* pass current tab + setter into the ActivityBar */}
        <ActivityBar activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "files" && (
          <>
            <Sidebar />
            <div className={styles.codeContainer}>
              <div className={styles.buttonGroup}>
                <RunCodeButton code={code} onOutput={handleOutput} />
              </div>
              <CodeEditor code={code} onCodeChange={setCode} />
              <Output output={output} />
            </div>
          </>
        )}

        {activeTab === "metrics" && (
          <div className={styles.metricsView}>
            {/* only show metrics in this mode */}
            <MetricsDisplay metrics={metrics as Metrics} />
          </div>
        )}
      </div>

      <StatusBar />
    </FullScreen>
  );
};

export default CodePage;
