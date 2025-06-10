"use client";
import styles from "./FileExplorer.module.css";
import { FaFile, FaTrash } from "react-icons/fa";

interface FileExplorerProps {
  files: Array<{ id: string; name: string }>;
  selectedFileId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function FileExplorer({
  files,
  selectedFileId,
  onSelect,
  onDelete,
}: FileExplorerProps) {
  return (
    <div className={styles.fileExplorer}>
      <h3>Explorer</h3>
      <ul>
        {files.map((file) => (
          <li
            key={file.id}
            className={file.id === selectedFileId ? styles.selected : undefined}
          >
            <span className={styles.fileName} onClick={() => onSelect(file.id)}>
              <FaFile /> {file.name}
            </span>
            <FaTrash
              className={styles.deleteIcon}
              onClick={() => onDelete(file.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
