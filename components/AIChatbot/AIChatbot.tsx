// components/AIChatbot/AIChatbot.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import Groq from "groq-sdk";
import styles from "./AIChatbot.module.css";
import { FaPaperPlane } from "react-icons/fa";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

interface ChatEntry {
  id: string;
  name: string;
  content: string;
}

interface AIChatbotProps {
  files: { id: string; name: string; content: string }[];
}

export default function AIChatbot({ files }: AIChatbotProps) {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<
    { message: string; response: string }[]
  >([]);
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [chatEntries, setChatEntries] = useState<ChatEntry[]>([]);

  const dataClient = useMemo(() => generateClient<Schema>(), []);
  const groq = useMemo(
    () =>
      new Groq({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY!,
        dangerouslyAllowBrowser: true,
      }),
    []
  );

  // load past chat entries for sidebar
  useEffect(() => {
    dataClient.models.ChatEntry.list().then((resp) => {
      if (!resp.errors) {
        setChatEntries(
          resp.data.map((c) => ({
            id: c.id,
            name: c.name!,
            content: c.content!,
          }))
        );
      }
    });
  }, [dataClient]);

  const systemPrompt = useMemo(
    () =>
      `You are an expert AI coding assistant. Users supply code files, pick actions (Fix, Explain, Optimize), and ask questions. Reply in plain text with minimal formatting.`,
    []
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const messages = [
      { role: "system", content: systemPrompt },
      ...(pendingAction ? [{ role: "user", content: pendingAction }] : []),
      ...(selectedFileId
        ? [
            {
              role: "user",
              content: `File "${files.find((f) => f.id === selectedFileId)!.name}":\n\`\`\`\n${
                files.find((f) => f.id === selectedFileId)!.content
              }\n\`\`\``,
            },
          ]
        : []),
      { role: "user", content: message },
    ];

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages as any,
    });
    const response = chatCompletion.choices[0]?.message.content || "";

    setHistory((h) => [{ message, response }, ...h]);
    setMessage("");
    setPendingAction(null);

    // save as ChatEntry
    const entryName = `Chat ${new Date().toLocaleString()}`;
    await fetch("/api/chat/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: entryName,
        content: `${message}\n\n${response}`,
      }),
    });

    // reload sidebar
    const listResp = await dataClient.models.ChatEntry.list();
    if (!listResp.errors) {
      setChatEntries(
        listResp.data.map((c) => ({
          id: c.id,
          name: c.name!,
          content: c.content!,
        }))
      );
    }
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h3>Chat History</h3>
        <ul>
          {chatEntries.map((c) => (
            <li key={c.id} onClick={() => setMessage(c.content)}>
              {c.name}
            </li>
          ))}
        </ul>
      </aside>

      <main className={styles.chatArea}>
        <div className={styles.controls}>
          <select
            value={selectedFileId}
            onChange={(e) => setSelectedFileId(e.target.value)}
          >
            <option value="">— select file —</option>
            {files.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setPendingAction("Please fix the following code:")}
          >
            Fix
          </button>
          <button
            onClick={() =>
              setPendingAction("Please explain the following code:")
            }
          >
            Explain
          </button>
          <button
            onClick={() =>
              setPendingAction("Please optimize this for AI development:")
            }
          >
            Optimize
          </button>
        </div>

        <div className={styles.history}>
          {history.map((h, i) => (
            <div key={i} className={styles.messagePair}>
              <div>
                <strong>You:</strong> {h.message}
              </div>
              <div>
                <strong>Bot:</strong> {h.response}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className={styles.inputArea}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about your code…"
          />
          <button type="submit">
            <FaPaperPlane />
          </button>
        </form>
      </main>
    </div>
  );
}
