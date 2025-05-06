// app/(protected)/chatbot/page.tsx
"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import AIChatbot from "@/components/AIChatbot/AIChatbot";
import ChatbotHistory from "@/components/ChatbotHistory/ChatbotHistory";

export default function ChatbotPage() {
  const [files, setFiles] = useState<
    { id: string; name: string; content: string }[]
  >([]);
  const dataClient = generateClient<Schema>();

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

  return (
    <>
      <ChatbotHistory />
      <AIChatbot files={files} />
    </>
  );
}
