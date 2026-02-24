"use client"

import { useRef, useEffect, useCallback } from "react"
import type { Line } from "@/lib/types"

interface EditorLineProps {
  line: Line
  isFocused: boolean
  onTextChange: (id: string, text: string) => void
  onEnter: (id: string) => void
  onDelete: (id: string) => void
  onFocus: (id: string) => void
  onArrowUp: (id: string) => void
  onArrowDown: (id: string) => void
}

export function EditorLine({
  line,
  isFocused,
  onTextChange,
  onEnter,
  onDelete,
  onFocus,
  onArrowUp,
  onArrowDown,
}: EditorLineProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isFocused && ref.current) {
      ref.current.focus()
      // Place cursor at end
      const range = document.createRange()
      const sel = window.getSelection()
      if (ref.current.childNodes.length > 0) {
        range.selectNodeContents(ref.current)
        range.collapse(false)
      } else {
        range.setStart(ref.current, 0)
        range.collapse(true)
      }
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }, [isFocused])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        onEnter(line.id)
      } else if (e.key === "Backspace" && !ref.current?.textContent) {
        e.preventDefault()
        onDelete(line.id)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        onArrowUp(line.id)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        onArrowDown(line.id)
      }
    },
    [line.id, onEnter, onDelete, onArrowUp, onArrowDown]
  )

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      onTextChange(line.id, (e.target as HTMLDivElement).textContent || "")
    },
    [line.id, onTextChange]
  )

  const alignClass =
    line.align === "center"
      ? "text-center"
      : line.align === "right"
        ? "text-right"
        : "text-left"

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      onFocus={() => onFocus(line.id)}
      className={`min-h-[1.75rem] py-0.5 outline-none text-foreground leading-7 ${alignClass}`}
      data-line-id={line.id}
      role="textbox"
      aria-label="Script line"
    >
      {line.text}
    </div>
  )
}
