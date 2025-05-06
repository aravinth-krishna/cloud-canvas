"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  // 1️⃣ Single, memoized data client
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

  // 2️⃣ loadFiles + selectFile + saveFile all stable via useCallback
  const loadFiles = useCallback(async () => {
    const resp = await dataClient.models.File.list();
    setFiles(resp.data.map((f) => ({ id: f.id, name: f.name! })));
  }, [dataClient]);

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
    },
    [dataClient, defaultCode, isDirty]
  );

  const saveFile = useCallback(async () => {
    if (!selectedFileId) {
      alert("No file selected!");
      return;
    }
    await dataClient.models.File.update({
      id: selectedFileId,
      content: code,
    });
    setIsDirty(false);
    alert("Saved!");
  }, [dataClient, code, selectedFileId]);

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

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setIsDirty(true);
  };

  const handleOutput = (result: string, metrics: unknown) => {
    setOutput(result);
    setMetrics(metrics);
  };

  return (
    <FullScreen handle={fsHandle}>
      <Navbar fullScreenHandle={fsHandle} />

      {/* 3️⃣ Pass saveFile into Ribbon */}
      <Ribbon
        onNewFile={async (name: string) => {
          const { data } = await dataClient.models.File.create({
            name,
            content: defaultCode,
          });
          await loadFiles();
          if (data?.id) selectFile(data.id);
        }}
        onSaveFile={saveFile}
        disableSave={!selectedFileId || !isDirty}
      />

      <div className={styles.content}>
        <ActivityBar activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "files" && (
          <>
            <Sidebar
              files={files}
              selectedFileId={selectedFileId}
              onSelect={selectFile} // 4️⃣ ensure Sidebar calls this
              onDelete={deleteFile}
            />

            <div className={styles.codeContainer}>
              <div className={styles.buttonGroup}>
                <span>
                  <FaPython /> Python v3.13
                </span>

                {/* inline Save button still works */}
                <button
                  onClick={saveFile}
                  disabled={!selectedFileId || !isDirty}
                  className={styles.saveButton}
                >
                  <FaSave /> Save
                </button>

                <RunCodeButton code={code} onOutput={handleOutput} />
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
