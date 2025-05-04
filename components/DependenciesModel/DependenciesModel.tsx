// components/DependenciesModal/DependenciesModal.tsx
"use client";
import React, { useState, useEffect } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";
import styles from "./DependenciesModel.module.css";

type Dependency = {
  name: string;
  version: string;
  description: string;
  officialUrl: string;
};

interface DependenciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  dependencies: Dependency[];
}

const DependenciesModal: React.FC<DependenciesModalProps> = ({
  isOpen,
  onClose,
  dependencies,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>Dependencies</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </header>
        <div className={styles.accordionList}>
          {dependencies.map((dep, idx) => {
            const isOpenItem = expandedIndex === idx;
            return (
              <div key={dep.name} className={styles.accordionItem}>
                <button
                  className={styles.accordionHeader}
                  onClick={() => toggleExpand(idx)}
                  aria-expanded={isOpenItem}
                >
                  <span>
                    {dep.name}{" "}
                    <span className={styles.version}>v{dep.version}</span>
                  </span>
                  <FiChevronDown
                    className={`${styles.chevron} ${isOpenItem ? styles.chevronOpen : ""}`}
                  />
                </button>
                {isOpenItem && (
                  <div className={styles.accordionContent}>
                    <p className={styles.description}>{dep.description}</p>
                    <button
                      className={styles.detailsButton}
                      onClick={() => window.open(dep.officialUrl, "_blank")}
                    >
                      View Official Page
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DependenciesModal;
