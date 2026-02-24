export interface Line {
  id: string
  text: string
  align: "left" | "center" | "right"
}

export interface Script {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  lines: Line[]
}
