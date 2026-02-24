import { NextResponse } from "next/server"
import type { Script } from "@/lib/types"
import { readDraft, writeDraft } from "@/lib/server/file-store"

export async function GET() {
  const draft = await readDraft()
  return NextResponse.json(draft)
}

export async function POST(request: Request) {
  const draft = (await request.json()) as Script
  await writeDraft(draft)
  return new NextResponse(null, { status: 204 })
}

export async function DELETE() {
  await writeDraft(null)
  return new NextResponse(null, { status: 204 })
}
