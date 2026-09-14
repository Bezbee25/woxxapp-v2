import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        muted: "var(--color-text-muted)",
      },
      boxShadow: {
        'brutal-xs': '2px 2px 0px 0px #0F172A',
        'brutal-sm': '3px 3px 0px 0px #0F172A',
        'brutal': '5px 5px 0px 0px #0F172A',
        'brutal-lg': '8px 8px 0px 0px #0F172A',
        'brutal-xl': '12px 12px 0px 0px #0F172A',
        'brutal-hover': '2px 2px 0px 0px #0F172A',
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};
export default config;
