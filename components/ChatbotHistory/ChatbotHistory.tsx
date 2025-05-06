"use client";

import React from "react";
import styles from "./ChatbotHistory.module.css";

export interface HistoryItem {
  id: string;
  name: string;
  onClick: (id: string) => void;
}

interface ChatbotHistoryProps {
  items: HistoryItem[];
  activeId: string | null;
}

export default function ChatbotHistory({
  items,
  activeId,
}: ChatbotHistoryProps) {
  return (
    <aside className={styles.historyPane}>
      <div className={styles.header}>
        <h2>Chats</h2>
      </div>
      <ul className={styles.list}>
        {items.map((item) => (
          <li
            key={item.id}
            className={item.id === activeId ? styles.active : ""}
            onClick={() => item.onClick(item.id)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
