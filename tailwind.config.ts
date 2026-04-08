import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#1a1a1a",
        surface: "#232323",
        surface2: "#2a2a2a",
        border: "#3a3a3a",
        text: "#d4d4d4",
        dim: "#666666",
        accent: "#c0a882",
        cold: "#7eb8c9",
        hot: "#ff2d78",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "SF Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
