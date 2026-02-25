"use client"

import { useState, useCallback, useEffect } from "react"
import type { Script, Line } from "@/lib/types"
import { saveScript, saveDraft, generateId } from "@/lib/storage"
import { exportToPDF } from "@/lib/pdf-export"
import { EditorLine } from "./editor-line"
import { EditorToolbar } from "./editor-toolbar"

interface ScriptEditorProps {
  script: Script
  onBack: () => void
}

export function ScriptEditor({ script: initialScript, onBack }: ScriptEditorProps) {
  const GUIDE_BLOCK_SIZE = 30
  const GUIDE_LINE_HEIGHT_REM = 1.75

  const [script, setScript] = useState<Script>(initialScript)
  const [focusedLineId, setFocusedLineId] = useState<string>(
    initialScript.lines[0]?.id || ""
  )
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      void saveDraft(script)
    }, 3000)
    return () => clearInterval(interval)
  }, [script])

  useEffect(() => {
    const handleBeforeUnload = () => {
      void saveScript(script)
      void saveDraft(script)
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [script])

  const currentLine = script.lines.find((l) => l.id === focusedLineId)
  const currentAlign = currentLine?.align || "left"

  const wordCount = script.lines.reduce((acc, line) => {
    const words = line.text.trim().split(/\s+/).filter(Boolean)
    return acc + words.length
  }, 0)

  const lineCount = script.lines.filter((l) => l.text.trim()).length
  const totalLinesForGuides = Math.max(script.lines.length, 1)
  const visibleGuideLineCount =
    Math.ceil(totalLinesForGuides / GUIDE_BLOCK_SIZE) * GUIDE_BLOCK_SIZE

  const focusScriptZone = useCallback(() => {
    const fallbackLineId = script.lines[0]?.id
    const targetLineId = focusedLineId || fallbackLineId
    if (!targetLineId) return

    setFocusedLineId(targetLineId)

    window.requestAnimationFrame(() => {
      const editorLine = document.querySelector<HTMLTextAreaElement>(
        `textarea[data-line-id="${targetLineId}"]`
      )
      editorLine?.focus()
    })
  }, [focusedLineId, script.lines])

  const handleTextChange = useCallback((id: string, text: string) => {
    setScript((prev) => ({
      ...prev,
      lines: prev.lines.map((l) => (l.id === id ? { ...l, text } : l)),
    }))
  }, [])

  const handleEnter = useCallback(
    (id: string) => {
      const newLine: Line = {
        id: generateId(),
        text: "",
        align: currentAlign,
      }
      setScript((prev) => {
        const index = prev.lines.findIndex((l) => l.id === id)
        const newLines = [...prev.lines]
        newLines.splice(index + 1, 0, newLine)
        return { ...prev, lines: newLines }
      })
      setFocusedLineId(newLine.id)
    },
    [currentAlign]
  )

  const handleDeleteLine = useCallback(
    (id: string) => {
      setScript((prev) => {
        if (prev.lines.length <= 1) return prev
        const index = prev.lines.findIndex((l) => l.id === id)
        const newLines = prev.lines.filter((l) => l.id !== id)
        const focusIndex = Math.max(0, index - 1)
        setFocusedLineId(newLines[focusIndex].id)
        return { ...prev, lines: newLines }
      })
    },
    []
  )

  const handleArrowUp = useCallback((id: string) => {
    setScript((prev) => {
      const index = prev.lines.findIndex((l) => l.id === id)
      if (index > 0) {
        setFocusedLineId(prev.lines[index - 1].id)
      }
      return prev
    })
  }, [])

  const handleArrowDown = useCallback((id: string) => {
    setScript((prev) => {
      const index = prev.lines.findIndex((l) => l.id === id)
      if (index < prev.lines.length - 1) {
        setFocusedLineId(prev.lines[index + 1].id)
      }
      return prev
    })
  }, [])

  const handleAlignChange = useCallback(
    (align: "left" | "center" | "right") => {
      if (!focusedLineId) return
      setScript((prev) => ({
        ...prev,
        lines: prev.lines.map((l) =>
          l.id === focusedLineId ? { ...l, align } : l
        ),
      }))
    },
    [focusedLineId]
  )

  const handleTitleChange = useCallback((title: string) => {
    setScript((prev) => ({ ...prev, title }))
  }, [])

  const handleSave = useCallback(() => {
    const performSave = async () => {
      setIsSaving(true)
      await saveScript(script)
      await saveDraft(script)
      setTimeout(() => setIsSaving(false), 800)
    }

    void performSave()
  }, [script])

  const handleExportPDF = useCallback(() => {
    exportToPDF(script)
  }, [script])

  const handleBack = useCallback(() => {
    const persistAndReturn = async () => {
      await saveScript(script)
      onBack()
    }

    void persistAndReturn()
  }, [script, onBack])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <EditorToolbar
        currentAlign={currentAlign}
        onAlignChange={handleAlignChange}
        onExportPDF={handleExportPDF}
        onBack={handleBack}
        onSave={handleSave}
        title={script.title}
        onTitleChange={handleTitleChange}
        wordCount={wordCount}
        lineCount={lineCount}
        isSaving={isSaving}
      />

      <main className="flex-1 flex justify-center">
        <div
          className="w-full max-w-[680px] px-6 py-12 md:px-12 md:py-16"
          onMouseDown={(e) => {
            if ((e.target as HTMLElement).closest("textarea")) return
            e.preventDefault()
            focusScriptZone()
          }}
        >
          <div
            className="relative"
            style={{ minHeight: `${visibleGuideLineCount * GUIDE_LINE_HEIGHT_REM}rem` }}
          >
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              {Array.from({ length: visibleGuideLineCount }).map((_, index) => (
                <div
                  key={index}
                  className="border-b border-gray-400/50"
                  style={{ height: `${GUIDE_LINE_HEIGHT_REM}rem` }}
                />
              ))}
            </div>

            <div className="relative z-[1]">
              {script.lines.map((line) => (
                <EditorLine
                  key={line.id}
                  line={line}
                  isFocused={focusedLineId === line.id}
                  onTextChange={handleTextChange}
                  onEnter={handleEnter}
                  onDelete={handleDeleteLine}
                  onFocus={setFocusedLineId}
                  onArrowUp={handleArrowUp}
                  onArrowDown={handleArrowDown}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border px-4 py-2 md:px-8 flex items-center justify-between text-xs text-muted-foreground">
        <span>{isSaving ? "Saving..." : "Auto-saved"}</span>
        <span className="md:hidden">
          {wordCount}w / {lineCount}l
        </span>
      </footer>
    </div>
  )
}
