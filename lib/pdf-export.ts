import type { Script } from "./types"

export async function exportToPDF(script: Script) {
  const { jsPDF } = await import("jspdf")

  const doc = new jsPDF({
    unit: "pt",
    format: "letter",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const marginLeft = 72
  const marginRight = 72
  const marginTop = 72
  const marginBottom = 72
  const usableWidth = pageWidth - marginLeft - marginRight
  const lineHeight = 18
  let yPosition = marginTop

  doc.setFont("Courier", "normal")
  doc.setFontSize(12)

  // Title
  doc.setFont("Courier", "bold")
  const titleWidth = doc.getTextWidth(script.title.toUpperCase())
  doc.text(script.title.toUpperCase(), (pageWidth - titleWidth) / 2, yPosition)
  yPosition += lineHeight * 3

  doc.setFont("Courier", "normal")

  for (const line of script.lines) {
    if (yPosition > pageHeight - marginBottom) {
      doc.addPage()
      yPosition = marginTop
    }

    const text = line.text || ""
    if (!text.trim()) {
      yPosition += lineHeight
      continue
    }

    const splitLines = doc.splitTextToSize(text, usableWidth)

    for (const splitLine of splitLines) {
      if (yPosition > pageHeight - marginBottom) {
        doc.addPage()
        yPosition = marginTop
      }

      let xPosition = marginLeft
      if (line.align === "center") {
        const textWidth = doc.getTextWidth(splitLine)
        xPosition = (pageWidth - textWidth) / 2
      } else if (line.align === "right") {
        const textWidth = doc.getTextWidth(splitLine)
        xPosition = pageWidth - marginRight - textWidth
      }

      doc.text(splitLine, xPosition, yPosition)
      yPosition += lineHeight
    }
  }

  doc.save(`${script.title || "untitled"}.pdf`)
}
