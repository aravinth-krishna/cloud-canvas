"use client";

import React, { useState, useMemo, useEffect } from "react";
import Groq from "groq-sdk";
import styles from "./AIChatbot.module.css";
import { FaPaperPlane } from "react-icons/fa";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

interface AIChatbotProps {
  files: { id: string; name: string; content: string }[];
  activeChatId: string | null;
  onHistoryUpdate: () => void;
}

export default function AIChatbot({
  files,
  activeChatId,
  onHistoryUpdate,
}: AIChatbotProps) {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const dataClient = useMemo(() => generateClient<Schema>(), []);
  const groq = useMemo(
    () =>
      new Groq({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY!,
        dangerouslyAllowBrowser: true,
      }),
    []
  );

  // Load selected chat from ChatEntry
  useEffect(() => {
    if (activeChatId) {
      dataClient.models.ChatEntry.get(activeChatId).then((resp) => {
        if (!resp.errors && resp.data) {
          const lines = resp.data.content!.split("\n\n");
          const conv: { role: "user" | "assistant"; text: string }[] =
            lines.map((l, i) => ({
              role: i % 2 === 0 ? ("user" as const) : ("assistant" as const),
              text: l,
            }));
          setConversation(conv);
        }
      });
    } else {
      setConversation([]);
    }
  }, [activeChatId, dataClient]);

  const systemPrompt = useMemo(
    () =>
      `You are an expert AI coding assistant. Users supply code files and choose actions like Fix, Explain, or Optimize. Respond clearly, with minimal markdown.`,
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // build messages
    const msgs: any[] = [
      { role: "system", content: systemPrompt },
      ...(pendingAction ? [{ role: "user", content: pendingAction }] : []),
      ...(selectedFileId
        ? [
            {
              role: "user",
              content: `File "${files.find((f) => f.id === selectedFileId)!.name}":\n\`\`\`\n${files.find((f) => f.id === selectedFileId)!.content}\n\`\`\``,
            },
          ]
        : []),
      { role: "user", content: message },
    ];

    // call Groq
    const comp = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: msgs,
    });
    const reply = comp.choices[0]?.message.content || "";

    // update conversation
    setConversation((c) => [
      ...c,
      { role: "user", text: message },
      { role: "assistant", text: reply },
    ]);
    setMessage("");
    setPendingAction(null);

    // persist
    const name = `Chat ${new Date().toLocaleString()}`;
    const content = [message, reply].join("\n\n");
    await dataClient.models.ChatEntry.create({ name, content });
    onHistoryUpdate();
  };

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.conversation}>
        {conversation.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? styles.userBubble : styles.botBubble}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <select
          value={selectedFileId}
          onChange={(e) => setSelectedFileId(e.target.value)}
        >
          <option value="">Select file…</option>
          {files.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <div className={styles.actions}>
          {["Fix", "Explain", "Optimize"].map((label) => (
            <button
              key={label}
              className={pendingAction === label ? styles.activeAction : ""}
              onClick={() =>
                setPendingAction(
                  `Please ${label.toLowerCase()} the following code:`
                )
              }
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.inputBar}>
        <input
          type="text"
          className={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask AI..."
        />
        <button type="submit" className={styles.sendBtn}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}
