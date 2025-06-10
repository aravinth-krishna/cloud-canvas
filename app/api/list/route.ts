import { NextResponse } from "next/server";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const dataClient = generateClient<Schema>();

export async function GET() {
  const resp = await dataClient.models.ChatEntry.list();
  if (resp.errors?.length) {
    console.error("Failed to list chat entries:", resp.errors);
    return NextResponse.json(
      { success: false, errors: resp.errors },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, items: resp.data });
}
