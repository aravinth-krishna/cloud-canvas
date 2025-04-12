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
        height="400px"
        defaultLanguage="python"
        value={code}
        onChange={(value, event) => onCodeChange(value ?? "")}
        theme="vs-light"
      />
    </div>
  );
};

export default CodeEditor;
