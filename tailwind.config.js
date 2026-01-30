export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#ff7a2d',
          cyan: '#19d3ff',
          panel: '#0f0f10',
          surface: '#111015',
          accent: '#ffd166'
        }
      },
      fontFamily: {
        heading: ['Rajdhani', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
