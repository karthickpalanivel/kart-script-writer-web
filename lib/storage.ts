import type { Script } from "./types"

const SCRIPTS_KEY = "scriptstudio_scripts"
const DRAFT_KEY = "scriptstudio_draft"

export function getAllScripts(): Script[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(SCRIPTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getScriptById(id: string): Script | null {
  const scripts = getAllScripts()
  return scripts.find((s) => s.id === id) ?? null
}

export function saveScript(script: Script): void {
  const scripts = getAllScripts()
  const index = scripts.findIndex((s) => s.id === script.id)
  if (index >= 0) {
    scripts[index] = { ...script, updatedAt: new Date().toISOString() }
  } else {
    scripts.push(script)
  }
  localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts))
}

export function deleteScript(id: string): void {
  const scripts = getAllScripts().filter((s) => s.id !== id)
  localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts))
}

export function saveDraft(script: Script): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(script))
}

export function getDraft(): Script | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY)
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
