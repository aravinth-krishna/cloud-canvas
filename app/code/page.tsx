"use client";

import CodeEditor from "@/components/CodeEditor/CodeEditor";
import Navbar from "@/components/Navbar/Navbar";
import Output from "@/components/Output/Output";
import Ribbon from "@/components/Ribbon/Ribbon";
import RunCodeButton from "@/components/RunCodeButton/RunCodeButton";
import MetricsDisplay from "@/components/MetricsDisplay/MetricsDisplay";
import { useState } from "react";
import ActivityBar from "@/components/ActivityBar/ActivityBar";
import Sidebar from "@/components/Sidebar/Sidebar";

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

const defaultPythonCode = `print("Hello, world!")`;

const CodePage = () => {
  const [code, setCode] = useState<string>(defaultPythonCode);
  const [output, setOutput] = useState<string>("");
  const [metrics, setMetrics] = useState<unknown>(null);

  const handleOutput = (result: string, metrics: unknown) => {
    setOutput(result);
    setMetrics(metrics);
  };

  return (
    <>
      <Navbar />
      <Ribbon />
      <ActivityBar />
      <Sidebar />
      <CodeEditor code={code} onCodeChange={setCode} />
      <div>
        <RunCodeButton code={code} onOutput={handleOutput} />
      </div>
      <Output output={output} />
      <MetricsDisplay metrics={metrics as Metrics} />
    </>
  );
};

export default CodePage;
