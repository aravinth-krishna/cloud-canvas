"use client";

import React, { useState, useMemo, useEffect } from "react";
import Groq from "groq-sdk";
import styles from "./AIChatbot.module.css";
import { FaPaperPlane } from "react-icons/fa";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

interface Action {
  label: string;
  prompt: string;
}

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
  const [pendingAction, setPendingAction] = useState<Action | null>(null);

  const dataClient = useMemo(() => generateClient<Schema>(), []);
  const groq = useMemo(
    () =>
      new Groq({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY!,
        dangerouslyAllowBrowser: true,
      }),
    []
  );

  useEffect(() => {
    if (activeChatId) {
      dataClient.models.ChatEntry.get({ id: activeChatId }).then((resp) => {
        if (!resp.errors && resp.data) {
          const lines = resp.data.content!.split("\n\n");
          const conv = lines.map((l, i) => ({
            role: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
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
      `You are an expert AI coding assistant. Users supply code files and choose actions like Fix, Explain, or Optimize. Respond clearly with minimal markdown.`,
    []
  );

  const ACTIONS: Action[] = [
    { label: "Fix", prompt: "Please fix the following code:" },
    { label: "Explain", prompt: "Please explain the following code:" },
    { label: "Optimize", prompt: "Please optimize this for AI development:" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // build message array
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msgs: any[] = [
      { role: "system", content: systemPrompt },
      ...(pendingAction
        ? [{ role: "user", content: pendingAction.prompt }]
        : []),
      ...(selectedFileId
        ? [
            {
              role: "user",
              content: `File "${
                files.find((f) => f.id === selectedFileId)!.name
              }":\n\`\`\`\n${
                files.find((f) => f.id === selectedFileId)!.content
              }\n\`\`\``,
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

    setConversation((c) => [
      ...c,
      { role: "user", text: message },
      { role: "assistant", text: reply },
    ]);
    setMessage("");
    setPendingAction(null);

    const name = `Chat ${new Date().toLocaleString()}`;
    const content = [message, reply].join("\n\n");
    await dataClient.models.ChatEntry.create({ name, content });
    onHistoryUpdate();
  };

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.conversation}>
        {conversation.map((m, i) => {
          const isUser = m.role === "user";
          return (
            <div
              key={i}
              className={isUser ? styles.userBubble : styles.botBubble}
            >
              {m.text.includes("```") ? (
                m.text.split(/```([\s\S]*?)```/).map((part, idx) =>
                  idx % 2 === 1 ? (
                    <pre key={idx} className={styles.codeBlock}>
                      <code>{part}</code>
                    </pre>
                  ) : (
                    <span key={idx}>{part}</span>
                  )
                )
              ) : (
                <span>{m.text}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.controls}>
        <select
          value={selectedFileId}
          onChange={(e) => setSelectedFileId(e.target.value)}
          className={styles.fileSelect}
        >
          <option value="">Select file…</option>
          {files.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <div className={styles.actions}>
          {ACTIONS.map((a) => (
            <button
              key={a.label}
              type="button"
              className={
                pendingAction?.label === a.label ? styles.activeAction : ""
              }
              onClick={() => setPendingAction(a)}
            >
              {a.label}
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
