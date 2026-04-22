/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1479FF",
          light: "#EBF3FF",
        },
        brand: {
          text: "#193B68",
          bg: "#F5F7FB",
        },
      },
      boxShadow: {
        card: "0 8px 40px rgba(20, 30, 60, 0.08)",
        "card-sm": "0 2px 16px rgba(20, 30, 60, 0.06)",
        btn: "0 4px 16px rgba(20, 121, 255, 0.28)",
        sidebar: "4px 0 24px rgba(20, 30, 60, 0.06)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "40px",
      },
    },
  },
  plugins: [],
};
