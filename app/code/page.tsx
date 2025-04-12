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
      <MetricsDisplay metrics={metrics} />
    </>
  );
};

export default CodePage;
