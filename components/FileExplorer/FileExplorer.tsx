// components/FileExplorer/FileExplorer.tsx
"use client";
import { useEffect, useState } from "react";
import styles from "./FileExplorer.module.css";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

interface FileItem {
  id: string;
  name: string;
  type: string;
  content: string;
  parentId: string | null;
}

const fileClient = generateClient<Schema>();

const FileExplorer = () => {
  const [files, setFiles] = useState<FileItem[]>([]);

  const fetchFiles = async () => {
    try {
      const { data } = await fileClient.models.FileItem.list();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files", error);
    }
  };

  useEffect(() => {
    fetchFiles();
    const handleFileChanged = () => {
      fetchFiles();
    };
    window.addEventListener("fileChanged", handleFileChanged);
    return () => {
      window.removeEventListener("fileChanged", handleFileChanged);
    };
  }, []);

  return (
    <div className={styles.fileExplorer}>
      <h3>Files</h3>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            {file.type === "folder" ? "📁" : "📄"} {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileExplorer;
