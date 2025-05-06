"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import AIChatbot from "@/components/AIChatbot/AIChatbot";
import ChatbotHistory, {
  HistoryItem,
} from "@/components/ChatbotHistory/ChatbotHistory";
import Navbar from "@/components/Navbar/Navbar";
import StatusBar from "@/components/StatusBar/StatusBar";
import styles from "./page.module.css";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";

export default function ChatbotPage() {
  const [files, setFiles] = useState<
    { id: string; name: string; content: string }[]
  >([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const dataClient = generateClient<Schema>();

  // Load code files
  useEffect(() => {
    dataClient.models.File.list().then((resp) => {
      if (!resp.errors) {
        setFiles(
          resp.data.map((f) => ({
            id: f.id,
            name: f.name!,
            content: f.content!,
          }))
        );
      }
    });
  }, [dataClient]);

  // Load chat history
  useEffect(() => {
    dataClient.models.ChatEntry.list().then((resp) => {
      if (!resp.errors) {
        setHistoryItems(
          resp.data.map((c) => ({
            id: c.id,
            name: c.name!,
            onClick: (id: string) => setActiveChatId(id),
          }))
        );
      }
    });
  }, [dataClient]);

  return (
    <div>
      <Navbar />
      <Link href="/code" className={styles.backButton}>
        <IoMdArrowBack /> Back
      </Link>
      <div className={styles.chatbotContainer}>
        <ChatbotHistory items={historyItems} activeId={activeChatId} />

        <AIChatbot
          files={files}
          activeChatId={activeChatId}
          onHistoryUpdate={() => {
            // reload history when a new chat is saved
            dataClient.models.ChatEntry.list().then((resp) => {
              if (!resp.errors) {
                setHistoryItems(
                  resp.data.map((c) => ({
                    id: c.id,
                    name: c.name!,
                    onClick: (id: string) => setActiveChatId(id),
                  }))
                );
              }
            });
          }}
        />
      </div>

      <StatusBar />
    </div>
  );
}
