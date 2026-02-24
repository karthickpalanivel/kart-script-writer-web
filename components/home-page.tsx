"use client"

import { useState, useCallback, useEffect } from "react"
import type { Script } from "@/lib/types"
import { getAllScripts, getScriptById, generateId } from "@/lib/storage"
import { ScriptList } from "./script-list"
import { ScriptEditor } from "./script-editor"
import { Plus } from "lucide-react"

type View = { type: "home" } | { type: "editor"; script: Script }

export function HomePage() {
  const [view, setView] = useState<View>({ type: "home" })
  const [scripts, setScripts] = useState<Script[]>([])

  useEffect(() => {
    const loadScripts = async () => {
      const loadedScripts = await getAllScripts()
      setScripts(loadedScripts)
    }

    void loadScripts()
  }, [])

  const handleCreateNew = useCallback(() => {
    const newScript: Script = {
      id: generateId(),
      title: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lines: [
        {
          id: generateId(),
          text: "",
          align: "left",
        },
      ],
    }
    setView({ type: "editor", script: newScript })
  }, [])

  const handleSelectScript = useCallback((id: string) => {
    const loadScript = async () => {
      const script = await getScriptById(id)
      if (script) {
        setView({ type: "editor", script })
      }
    }

    void loadScript()
  }, [])

  const handleBack = useCallback(() => {
    const refreshScripts = async () => {
      setScripts(await getAllScripts())
      setView({ type: "home" })
    }

    void refreshScripts()
  }, [])

  const handleDeleteScript = useCallback((id: string) => {
    setScripts((prev) => prev.filter((s) => s.id !== id))
  }, [])

  if (view.type === "editor") {
    return <ScriptEditor script={view.script} onBack={handleBack} />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-8 md:px-8 md:py-12">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Script Studio
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            A minimal screenplay writing studio.
          </p>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-6 py-8 md:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
              Your Scripts
            </h2>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold hover:bg-foreground/80 transition-colors border border-primary"
            >
              <Plus className="h-3.5 w-3.5" />
              New Script
            </button>
          </div>

          <ScriptList
            scripts={scripts}
            onSelect={handleSelectScript}
            onDelete={handleDeleteScript}
          />
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-2xl mx-auto px-6 py-4 md:px-8">
          <p className="text-xs text-muted-foreground">
            All scripts are stored in the local project data folder.
          </p>
        </div>
      </footer>
    </div>
  )
}
