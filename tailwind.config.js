/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        drab: {
          950: '#0E1310',
          900: '#141A16',
          850: '#1A221C',
          800: '#222D25',
          700: '#2F3D33',
          600: '#3F5244',
          500: '#566E5D',
          400: '#758F7D',
          300: '#9CB2A3',
        },
        steel: {
          950: '#0B0E10',
          900: '#101418',
          850: '#161B20',
          800: '#1E252C',
          700: '#29323B',
          600: '#394652',
          500: '#4F606F',
          400: '#6C8092',
          300: '#96A7B6',
          200: '#CAD3DC',
        },
        khaki: {
          900: '#2C271E',
          800: '#433B2E',
          700: '#5D5240',
          600: '#7F7057',
          500: '#A69473',
          400: '#C2B191',
          300: '#D9CDB5',
          200: '#EAE3D3',
          100: '#F4F0E6',
          50: '#FAF8F4',
        },
        tactical: {
          red: '#A82828',
          redMuted: '#581F1F',
          amber: '#B87216',
          amberMuted: '#593B12',
          green: '#2F6E3B',
          greenMuted: '#193A20',
          blue: '#2B577A',
          blueMuted: '#172E41',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
