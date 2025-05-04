// components/Ribbon/Ribbon.tsx
"use client";
import styles from "./Ribbon.module.css";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import Link from "next/link";
import DependenciesModal from "@/components/DependenciesModel/DependenciesModel";
import { useState } from "react";

const dataClient = generateClient<Schema>();

const Ribbon = () => {
  const [depsOpen, setDepsOpen] = useState(false);

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
          <button>Open File</button>
          <button>Open Folder</button>
        </div>
      </div>
      <div className={styles.dropdown}>
        <button>Edit</button>
        <div className={styles.dropdownContent}>
          <button>Undo</button>
          <button>Redo</button>
          <button>Cut</button>
          <button>Copy</button>
          <button>Paste</button>
        </div>
      </div>

      <div className={styles.dropdown}>
        <button>View</button>
        <div className={styles.dropdownContent}>
          <button>Switch Mode</button>
          <button>Resource Utilization</button>
        </div>
      </div>

      <div className={styles.dropdown}>
        <button>Runtime</button>
        <div className={styles.dropdownContent}>
          <button>Run Code</button>
          <button onClick={() => setDepsOpen(true)}>See Dependencies</button>
          <DependenciesModal
            isOpen={depsOpen}
            onClose={() => setDepsOpen(false)}
            dependencies={[
              {
                name: "torch",
                version: "2.0.1+cpu",
                description:
                  "PyTorch is an open source machine learning framework that accelerates the path from research prototyping to production deployment.",
                officialUrl: "https://pytorch.org",
              },
              {
                name: "numpy",
                version: "latest",
                description:
                  "NumPy is the fundamental package for scientific computing with Python, offering array objects and routines.",
                officialUrl: "https://numpy.org",
              },
              {
                name: "psutil",
                version: "latest",
                description:
                  "psutil (process and system utilities) is a cross-platform library for retrieving information on running processes and system utilization in Python.",
                officialUrl: "https://psutil.readthedocs.io",
              },
            ]}
          />
        </div>
      </div>

      <div className={styles.dropdown}>
        <button>Tools</button>
        <div className={styles.dropdownContent}>
          <button>
            <Link href={"/settings"}>Settings</Link>
          </button>
        </div>
      </div>

      <div className={styles.dropdown}>
        <button>Help</button>
        <div className={styles.dropdownContent}>
          <button>
            <Link
              href={
                "https://github.com/aravinth-krishna/cloud-canvas/blob/main/README.md"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </Link>
          </button>
          <button>
            <Link href={"/#about"}>About</Link>
          </button>
          <button>
            <Link
              href={"https://github.com/aravinth-krishna/cloud-canvas"}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ribbon;
