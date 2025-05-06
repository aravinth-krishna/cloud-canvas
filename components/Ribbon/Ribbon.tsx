// components/Ribbon/Ribbon.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Ribbon.module.css";
import DependenciesModal from "@/components/DependenciesModel/DependenciesModel";

interface RibbonProps {
  onNewFile: (name: string) => void;
  onSaveFile: () => void;
  disableSave: boolean;
  onRunCode: () => void;
  disableRun: boolean;
  onShowMetrics: () => void;
  disableMetrics: boolean;
  onSwitchMode: () => void;
}

export default function Ribbon({
  onNewFile,
  onSaveFile,
  disableSave,
  onRunCode,
  disableRun,
  onShowMetrics,
  disableMetrics,
  onSwitchMode,
}: RibbonProps) {
  const [depsOpen, setDepsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={styles.ribbon}>
      <div className={styles.dropdown}>
        <button>File</button>
        <div className={styles.dropdownContent}>
          <button
            onClick={() => {
              const name = prompt("Enter new file name:");
              if (name) onNewFile(name);
            }}
          >
            New File
          </button>
          <button onClick={onSaveFile} disabled={disableSave}>
            Save File
          </button>
        </div>
      </div>

      <div className={styles.dropdown}>
        <button>View</button>
        <div className={styles.dropdownContent}>
          <button
            onClick={() => {
              setDarkMode((prev) => !prev);
              onSwitchMode();
            }}
          >
            Switch Mode
          </button>
          <button onClick={onShowMetrics} disabled={disableMetrics}>
            Resource Utilization
          </button>
        </div>
      </div>

      <div className={styles.dropdown}>
        <button>Runtime</button>
        <div className={styles.dropdownContent}>
          <button onClick={onRunCode} disabled={disableRun}>
            Run Code
          </button>
          <button onClick={() => setDepsOpen(true)}>See Dependencies</button>
          <DependenciesModal
            isOpen={depsOpen}
            onClose={() => setDepsOpen(false)}
            dependencies={[
              {
                name: "torch",
                version: "2.0.1+cpu",
                description:
                  "PyTorch is an open source machine learning framework...",
                officialUrl: "https://pytorch.org",
              },
              {
                name: "numpy",
                version: "latest",
                description:
                  "NumPy is the fundamental package for scientific computing...",
                officialUrl: "https://numpy.org",
              },
              {
                name: "psutil",
                version: "latest",
                description:
                  "psutil is a cross-platform library for retrieving process/system info...",
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
            <Link href="/settings">Settings</Link>
          </button>
        </div>
      </div>

      <div className={styles.dropdown}>
        <button>Help</button>
        <div className={styles.dropdownContent}>
          <button>
            <Link
              href="https://github.com/aravinth-krishna/cloud-canvas/blob/main/README.md"
              target="_blank"
            >
              Docs
            </Link>
          </button>
          <button>
            <Link href="/#about">About</Link>
          </button>
          <button>
            <Link
              href="https://github.com/aravinth-krishna/cloud-canvas"
              target="_blank"
            >
              GitHub
            </Link>
          </button>
          <button>
            <Link href="/chatbot">Ask AI ✨</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
