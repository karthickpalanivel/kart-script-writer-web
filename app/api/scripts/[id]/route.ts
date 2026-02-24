import { NextResponse } from "next/server"
import { readScripts, writeScripts } from "@/lib/server/file-store"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params
  const scripts = await readScripts()
  const script = scripts.find((item) => item.id === id) ?? null
  return NextResponse.json(script)
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params
  const scripts = await readScripts()
  const filtered = scripts.filter((script) => script.id !== id)
  await writeScripts(filtered)
  return new NextResponse(null, { status: 204 })
}
