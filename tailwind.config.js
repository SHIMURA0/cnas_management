/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // 确保 Tailwind 的样式不会覆盖 Ant Design 的样式
  corePlugins: {
    preflight: false,
  },
} 