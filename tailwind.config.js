/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      screens: {
        "sm": "540px"
      }
    },
  }
}