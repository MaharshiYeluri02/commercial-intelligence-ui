module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // blue-600 - deeper, more professional
          dark: '#1D4ED8',    // blue-700
          light: '#3B82F6',   // blue-500
          lighter: '#EFF6FF', // blue-50
        },
        secondary: {
          DEFAULT: '#7C3AED', // violet-600 - sophisticated purple
          dark: '#6D28D9',    // violet-700
          light: '#8B5CF6',   // violet-500
          lighter: '#F3E8FF', // violet-50
        },
        accent: {
          DEFAULT: '#059669', // emerald-600 - professional green
          dark: '#047857',    // emerald-700
          light: '#10B981',   // emerald-500
          lighter: '#ECFDF5', // emerald-50
        },
        gray: {
          light: '#F9FAFB',    // gray-50 - softer background
          medium: '#6B7280',   // gray-500 - better contrast
          dark: '#111827',     // gray-900 - stronger text
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
