// app/(protected)/code/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
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
import { FaPython } from "react-icons/fa";

const dataClient = generateClient<Schema>();

export default function CodePage() {
  const [activeTab, setActiveTab] = useState<"files" | "metrics">("files");

  const [files, setFiles] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const defaultCode = `# New file...\n`;
  const [code, setCode] = useState(defaultCode);
  const [isDirty, setIsDirty] = useState(false);

  const [output, setOutput] = useState("");
  const [metrics, setMetrics] = useState<unknown>(null);
  const fsHandle = useFullScreenHandle();

  // Fetch all files
  const loadFiles = useCallback(async () => {
    const { data } = await dataClient.models.File.list();
    setFiles(data.map((f) => ({ id: f.id, name: f.name! })));
  }, []);

  // Load a single file into editor
  const selectFile = useCallback(
    async (id: string) => {
      if (isDirty && !confirm("Discard unsaved changes?")) return;
      const { data } = await dataClient.models.File.get({ id });
      if (data == null) {
        alert("Unable to load file content.");
        return;
      }
      setSelectedFileId(id);
      setCode(data.content ?? defaultCode);
      setIsDirty(false);
    },
    [isDirty, defaultCode]
  );

  // Save current file
  const saveFile = async () => {
    if (!selectedFileId) return alert("No file selected!");
    await dataClient.models.File.update({ id: selectedFileId, content: code });
    setIsDirty(false);
    alert("Saved!");
  };

  // Delete a file
  const deleteFile = async (id: string) => {
    if (!confirm("Really delete this file?")) return;
    await dataClient.models.File.delete({ id });
    if (id === selectedFileId) {
      setSelectedFileId(null);
      setCode(defaultCode);
      setIsDirty(false);
    }
    await loadFiles();
  };

  // On mount, load list
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Mark as dirty on code edit
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
      <Ribbon
        onNewFile={async (name: string) => {
          const { data } = await dataClient.models.File.create({
            name,
            content: defaultCode,
          });
          await loadFiles();
          if (data && data.id) {
            await selectFile(data.id);
          } else {
            alert("Failed to create file.");
          }
        }}
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
                >
                  Save
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

      <StatusBar />
    </FullScreen>
  );
}
