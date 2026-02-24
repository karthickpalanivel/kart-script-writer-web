import { NextResponse } from "next/server"
import type { Script } from "@/lib/types"
import { readScripts, writeScripts } from "@/lib/server/file-store"

export async function GET() {
  const scripts = await readScripts()
  return NextResponse.json(scripts)
}

export async function POST(request: Request) {
  const incoming = (await request.json()) as Script
  const scripts = await readScripts()
  const index = scripts.findIndex((script) => script.id === incoming.id)
  const scriptToSave: Script = {
    ...incoming,
    updatedAt: new Date().toISOString(),
  }

  if (index >= 0) {
    scripts[index] = scriptToSave
  } else {
    scripts.push(scriptToSave)
  }

  await writeScripts(scripts)
  return NextResponse.json(scriptToSave)
}
