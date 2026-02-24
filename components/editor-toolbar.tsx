"use client"

import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Download,
  ArrowLeft,
  Save,
} from "lucide-react"

interface EditorToolbarProps {
  currentAlign: "left" | "center" | "right"
  onAlignChange: (align: "left" | "center" | "right") => void
  onExportPDF: () => void
  onBack: () => void
  onSave: () => void
  title: string
  onTitleChange: (title: string) => void
  wordCount: number
  lineCount: number
  isSaving: boolean
}

export function EditorToolbar({
  currentAlign,
  onAlignChange,
  onExportPDF,
  onBack,
  onSave,
  title,
  onTitleChange,
  wordCount,
  lineCount,
  isSaving,
}: EditorToolbarProps) {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back to scripts"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden md:inline">Back</span>
          </button>

          <div className="h-4 w-px bg-border" />

          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Untitled Script"
            className="bg-transparent border-none outline-none text-sm font-bold text-foreground placeholder:text-muted-foreground w-40 md:w-64"
            aria-label="Script title"
          />
        </div>

        <div className="flex items-center gap-1">
          <div className="hidden md:flex items-center gap-1 mr-3 text-xs text-muted-foreground">
            <span>{wordCount} words</span>
            <span className="mx-1">/</span>
            <span>{lineCount} lines</span>
          </div>

          <div className="flex items-center border border-border">
            <button
              onClick={() => onAlignChange("left")}
              className={`p-2 transition-colors ${
                currentAlign === "left"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              aria-label="Align left"
              aria-pressed={currentAlign === "left"}
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onAlignChange("center")}
              className={`p-2 border-x border-border transition-colors ${
                currentAlign === "center"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              aria-label="Align center"
              aria-pressed={currentAlign === "center"}
            >
              <AlignCenter className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onAlignChange("right")}
              className={`p-2 transition-colors ${
                currentAlign === "right"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              aria-label="Align right"
              aria-pressed={currentAlign === "right"}
            >
              <AlignRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={onSave}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors ml-1"
            aria-label="Save script"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving && (
              <span className="sr-only">Saving...</span>
            )}
          </button>

          <button
            onClick={onExportPDF}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Export as PDF"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  )
}
