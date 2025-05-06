// app/(protected)/code/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

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
import { Metrics } from "@/components/MetricsDisplay/MetricsDisplay";
import { FaPython, FaSave } from "react-icons/fa";
import { FloatingChatbot } from "@/components/FloatingChatbot/FloatingChatbot";

export default function CodePage() {
  const dataClient = useMemo(() => generateClient<Schema>(), []);

  const [activeTab, setActiveTab] = useState<"files" | "metrics">("files");
  const [files, setFiles] = useState<{ id: string; name: string }[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const defaultCode = "# New file...\n";
  const [code, setCode] = useState(defaultCode);
  const [isDirty, setIsDirty] = useState(false);

  const [output, setOutput] = useState("");
  const [metrics, setMetrics] = useState<unknown>(null);
  const fsHandle = useFullScreenHandle();

  // Ref to trigger RunCodeButton
  const runBtnRef = useRef<HTMLButtonElement>(null);

  // loadFiles
  const loadFiles = useCallback(async () => {
    const resp = await dataClient.models.File.list();
    setFiles(resp.data.map((f) => ({ id: f.id, name: f.name! })));
  }, [dataClient]);

  // selectFile
  const selectFile = useCallback(
    async (id: string) => {
      if (isDirty && !confirm("Discard unsaved changes?")) return;
      const { data } = await dataClient.models.File.get({ id });
      if (!data) {
        alert("Could not load file.");
        return;
      }
      setSelectedFileId(id);
      setCode(data.content ?? defaultCode);
      setIsDirty(false);
      setActiveTab("files");
    },
    [dataClient, defaultCode, isDirty]
  );

  // saveFile
  const saveFile = useCallback(async () => {
    if (!selectedFileId) {
      alert("No file selected!");
      return;
    }
    await dataClient.models.File.update({ id: selectedFileId, content: code });
    setIsDirty(false);
    alert("Saved!");
  }, [dataClient, code, selectedFileId]);

  // deleteFile
  const deleteFile = useCallback(
    async (id: string) => {
      if (!confirm("Delete this file?")) return;
      await dataClient.models.File.delete({ id });
      if (id === selectedFileId) {
        setSelectedFileId(null);
        setCode(defaultCode);
        setIsDirty(false);
      }
      await loadFiles();
    },
    [dataClient, defaultCode, loadFiles, selectedFileId]
  );

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // editor change
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setIsDirty(true);
  };

  // handle output
  const handleOutput = (result: string, m: unknown) => {
    setOutput(result);
    setMetrics(m);
    setActiveTab("files");
  };

  // toggle dark/light
  const toggleMode = useCallback(() => {
    document.body.classList.toggle("dark");
  }, []);

  return (
    <FullScreen handle={fsHandle}>
      <Navbar fullScreenHandle={fsHandle} />

      <Ribbon
        onNewFile={async (name) => {
          const { data } = await dataClient.models.File.create({
            name,
            content: defaultCode,
          });
          await loadFiles();
          if (data?.id) selectFile(data.id);
        }}
        onSaveFile={saveFile}
        disableSave={!selectedFileId || !isDirty}
        onRunCode={() => runBtnRef.current?.click()}
        disableRun={!selectedFileId}
        onShowMetrics={() => setActiveTab("metrics")}
        disableMetrics={false}
        onSwitchMode={toggleMode}
      />

      <div className={styles.content}>
        <ActivityBar activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "files" && (
          <>
            <Sidebar
              files={files}
              selectedFileId={selectedFileId}
              onSelect={selectFile}
              onDelete={deleteFile}
            />

            <div className={styles.codeContainer}>
              <div className={styles.buttonGroup}>
                <span>
                  <FaPython /> Python v3.13
                </span>
                <button
                  onClick={saveFile}
                  disabled={!selectedFileId || !isDirty}
                  className={styles.saveButton}
                >
                  <FaSave /> Save
                </button>
                <RunCodeButton
                  ref={runBtnRef}
                  code={code}
                  onOutput={handleOutput}
                />
              </div>

              <CodeEditor code={code} onCodeChange={handleCodeChange} />
              <Output output={output} />
            </div>
          </>
        )}

        {activeTab === "metrics" && (
          <div className={styles.metricsView}>
            <MetricsDisplay metrics={metrics as Metrics} />
          </div>
        )}
      </div>

      <FloatingChatbot />
      <StatusBar />
    </FullScreen>
  );
}
