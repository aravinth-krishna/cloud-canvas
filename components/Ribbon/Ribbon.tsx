// components/Ribbon/Ribbon.tsx
"use client";
import styles from "./Ribbon.module.css";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const dataClient = generateClient<Schema>();

const Ribbon = () => {
  const createItem = async (type: "file" | "folder") => {
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;
    try {
      await dataClient.models.FileItem.create({
        name,
        type,
        content: type === "file" ? "" : "",
        parentId: null,
      });
      alert(
        `${type.charAt(0).toUpperCase() + type.slice(1)} created successfully.`
      );
      // Dispatch an event to signal the FileExplorer to refresh.
      window.dispatchEvent(new Event("fileChanged"));
    } catch (error) {
      console.error("Error creating item", error);
      alert("Error creating " + type);
    }
  };

  return (
    <div className={styles.ribbon}>
      <div className={styles.dropdown}>
        <button>File</button>
        <div className={styles.dropdownContent}>
          <button onClick={() => createItem("file")}>New File</button>
          <button onClick={() => createItem("folder")}>New Folder</button>
        </div>
      </div>
      <button>Edit</button>
      <button>View</button>
      <button>Runtime</button>
      <button>Tools</button>
      <button>Help</button>
    </div>
  );
};

export default Ribbon;
