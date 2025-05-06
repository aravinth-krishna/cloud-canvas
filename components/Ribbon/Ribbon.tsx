// components/Ribbon/Ribbon.tsx
"use client";
import styles from "./Ribbon.module.css";
import Link from "next/link";
import DependenciesModal from "@/components/DependenciesModel/DependenciesModel";
import { useState } from "react";

interface RibbonProps {
  onNewFile: (name: string) => void;
}

const Ribbon = ({ onNewFile }: RibbonProps) => {
  const [depsOpen, setDepsOpen] = useState(false);

  const handleNew = () => {
    const name = prompt("Enter file name:");
    if (name) onNewFile(name);
  };

  return (
    <div className={styles.ribbon}>
      <div className={styles.dropdown}>
        <button>File</button>
        <div className={styles.dropdownContent}>
          <button onClick={handleNew}>New File</button>
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
          <button>
            <Link href={"/chatbot"}>Ask AI ✨</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ribbon;
