module.exports = {
  content: ["./src/**/*.{ts,tsx,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          // "'Noto Sans JP'",
          "ui-sans-serif",
          "-apple-system",
          "'Helvetica Neue'",
          "Arial",
          "'Hiragino Sans'",
          "'Hiragino Kaku Gothic ProN'",
          "Meiryo",
          "sans-serif",
        ],
        serif: ["ui-serif", "Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
        mono: [
          "'Fira Code'",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
      },
    },
  },
  plugins: [],
  safelist: ["leading-[2em]", "text-3xl", "text-2xl", "text-xl", "text-sm", "text-lg", "font-bold"],
}
