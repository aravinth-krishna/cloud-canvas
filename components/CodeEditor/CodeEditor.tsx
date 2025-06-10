"use client";

import styles from "./CodeEditor.module.css";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  onCodeChange: (value: string) => void;
}

const CodeEditor = ({ code, onCodeChange }: CodeEditorProps) => {
  return (
    <div className={styles.editorWrapper}>
      <Editor
        height="100%"
        defaultLanguage="python"
        value={code}
        onChange={(value) => onCodeChange(value ?? "")}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
