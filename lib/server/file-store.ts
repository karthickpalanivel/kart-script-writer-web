import { promises as fs } from "node:fs"
import path from "node:path"
import type { Script } from "@/lib/types"

const dataDir = path.join(process.cwd(), "data")
const scriptsFile = path.join(dataDir, "scripts.json")
const draftFile = path.join(dataDir, "draft.json")

async function ensureDataFile(filePath: string, defaultValue: unknown): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(filePath)
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), "utf8")
  }
}

export async function readScripts(): Promise<Script[]> {
  await ensureDataFile(scriptsFile, [])
  const raw = await fs.readFile(scriptsFile, "utf8")
  return JSON.parse(raw) as Script[]
}

export async function writeScripts(scripts: Script[]): Promise<void> {
  await ensureDataFile(scriptsFile, [])
  await fs.writeFile(scriptsFile, JSON.stringify(scripts, null, 2), "utf8")
}

export async function readDraft(): Promise<Script | null> {
  await ensureDataFile(draftFile, null)
  const raw = await fs.readFile(draftFile, "utf8")
  return JSON.parse(raw) as Script | null
}

export async function writeDraft(draft: Script | null): Promise<void> {
  await ensureDataFile(draftFile, null)
  await fs.writeFile(draftFile, JSON.stringify(draft, null, 2), "utf8")
}
