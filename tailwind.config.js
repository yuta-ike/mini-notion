module.exports = {
  content: ["./src/**/*.{tsx,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "'Noto Sans JP'",
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
  safelist: ["leading-[2em]", "text-2xl", "text-xl", "font-bold"],
}
