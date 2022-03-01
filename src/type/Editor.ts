export type Block = {
  raw: string
  content: string
  type: keyof typeof classes
}

export const classes = {
  h1: "text-2xl font-bold leading-[2em]",
  h2: "text-xl font-bold leading-[2em]",
  p: "",
}

export const modifiers = {
  h1: (v: string) => `# ${v}`,
  h2: (v: string) => `## ${v}`,
  p: (v: string) => v,
}

export const placeholders = {
  h1: "Heading 1...",
  h2: "Heading 2...",
  p: "Text...",
}
