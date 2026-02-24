"use client"

import { useCallback } from "react"
import type { Script } from "@/lib/types"
import { deleteScript } from "@/lib/storage"
import { FileText, Trash2 } from "lucide-react"

interface ScriptListProps {
  scripts: Script[]
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function ScriptList({ scripts, onSelect, onDelete }: ScriptListProps) {
  const handleDelete = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation()
      const removeScript = async () => {
        await deleteScript(id)
        onDelete(id)
      }

      void removeScript()
    },
    [onDelete]
  )

  if (scripts.length === 0) {
    return (
      <div className="border border-border py-16 flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-sm">No saved scripts yet.</p>
        <p className="text-muted-foreground text-xs">
          Create a new script to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col border-t border-border">
      {scripts.map((script) => (
        <div
          key={script.id}
          role="button"
          tabIndex={0}
          onClick={() => onSelect(script.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onSelect(script.id)
            }
          }}
          className="flex items-center gap-4 px-4 py-4 border-b border-border text-left hover:bg-secondary transition-colors group cursor-pointer"
        >
          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-foreground">
              {script.title || "Untitled"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(script.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              {" \u00B7 "}
              {script.lines.filter((l) => l.text.trim()).length} lines
            </p>
          </div>
          <button
            onClick={(e) => handleDelete(e, script.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-accent text-muted-foreground hover:text-foreground"
            aria-label={`Delete ${script.title || "Untitled"}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
