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
        height="100%" // Use 100% height to fill the container
        defaultLanguage="python"
        value={code} // Initial value set from prop
        onChange={(value) => onCodeChange(value ?? "")} // Call parent handler on change
        theme="vs-light" // Or your preferred theme
        options={{
          minimap: { enabled: false }, // Disable minimap
          fontSize: 14, // Adjust font size as needed
          scrollBeyondLastLine: false, // Prevent scrolling beyond the last line
          automaticLayout: true, // Automatically adjust layout when container size changes
        }}
      />
    </div>
  );
};

export default CodeEditor;
