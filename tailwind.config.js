module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // blue-500
          dark: '#2563EB',   // blue-600
          light: '#60A5FA',  // blue-400
          lighter: '#EFF6FF',// blue-50
        },
        secondary: {
          DEFAULT: '#F97316', // orange-500
          dark: '#EA580C',   // orange-600
          light: '#FB923C',  // orange-400
        },
        accent: {
          DEFAULT: '#10B981', // green-500
          dark: '#059669',   // green-600
          light: '#34D399',  // green-400
        },
        gray: {
          light: '#F3F4F6',    // gray-100
          medium: '#9CA3AF',   // gray-400
          dark: '#374151',     // gray-700
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
