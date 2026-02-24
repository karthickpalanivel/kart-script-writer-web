import type { Script } from "./types"

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Storage request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export async function getAllScripts(): Promise<Script[]> {
  return request<Script[]>("/api/scripts")
}

export async function getScriptById(id: string): Promise<Script | null> {
  return request<Script | null>(`/api/scripts/${id}`)
}

export async function saveScript(script: Script): Promise<Script> {
  return request<Script>("/api/scripts", {
    method: "POST",
    body: JSON.stringify(script),
  })
}

export async function deleteScript(id: string): Promise<void> {
  await request<void>(`/api/scripts/${id}`, { method: "DELETE" })
}

export async function saveDraft(script: Script): Promise<void> {
  await request<void>("/api/draft", {
    method: "POST",
    body: JSON.stringify(script),
  })
}

export async function getDraft(): Promise<Script | null> {
  return request<Script | null>("/api/draft")
}

export async function clearDraft(): Promise<void> {
  await request<void>("/api/draft", { method: "DELETE" })
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
