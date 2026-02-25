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
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isFocused && ref.current) {
      ref.current.focus()
      const length = ref.current.value.length
      ref.current.setSelectionRange(length, length)
    }
  }, [isFocused])

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.height = "0px"
    ref.current.style.height = `${ref.current.scrollHeight}px`
  }, [line.text])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        onEnter(line.id)
      } else if (e.key === "Backspace" && !line.text) {
        e.preventDefault()
        onDelete(line.id)
      } else if (e.key === "ArrowUp" && ref.current?.selectionStart === 0) {
        e.preventDefault()
        onArrowUp(line.id)
      } else if (
        e.key === "ArrowDown" &&
        ref.current?.selectionStart === line.text.length
      ) {
        e.preventDefault()
        onArrowDown(line.id)
      }
    },
    [line.id, line.text, onEnter, onDelete, onArrowUp, onArrowDown]
  )

  const alignClass =
    line.align === "center"
      ? "text-center"
      : line.align === "right"
        ? "text-right"
        : "text-left"

  return (
    <textarea
      ref={ref}
      data-line-id={line.id}
      value={line.text}
      onChange={(e) => onTextChange(line.id, e.target.value)}
      onKeyDown={handleKeyDown}
      onFocus={() => onFocus(line.id)}
      rows={1}
      className={`w-full min-h-[1.75rem] resize-none overflow-hidden bg-transparent py-0.5 outline-none text-foreground leading-7 ${alignClass}`}
      aria-label="Script line"
    />
  )
}
