// app/api/chat/save/route.ts
import { NextResponse } from "next/server";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const dataClient = generateClient<Schema>();

export async function POST(req: Request) {
  const { name, content } = await req.json();

  const resp = await dataClient.models.ChatEntry.create({ name, content });
  if (resp.errors?.length) {
    console.error("Failed to save chat entry:", resp.errors);
    return NextResponse.json(
      { success: false, errors: resp.errors },
      { status: 500 }
    );
  }

  if (!resp.data) {
    console.error("No data returned from ChatEntry.create");
    return NextResponse.json(
      { success: false, error: "No data returned" },
      { status: 500 }
    );
  }
  return NextResponse.json({ success: true, id: resp.data.id });
}
