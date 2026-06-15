/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        // 田园大世界 - 像素风格配色
        grass: {
          light: '#8FD14F',
          DEFAULT: '#7EC850',
          dark: '#5B9A30',
        },
        sky: {
          light: '#87CEEB',
          DEFAULT: '#5B9BD5',
          dark: '#4A8AC4',
        },
        sunlight: {
          DEFAULT: '#F5A623',
          light: '#FFD93D',
        },
        earth: {
          light: '#D4B896',
          DEFAULT: '#C4A46B',
          dark: '#A08550',
        },
        wood: {
          light: '#DEB887',
          DEFAULT: '#D2691E',
          dark: '#8B4513',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      imageRendering: {
        pixel: 'pixelated',
      },
    },
  },
  plugins: [],
};
