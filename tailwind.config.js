export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fbe8ef',
          100: '#f4c7da',
          200: '#ee88b4',
          300: '#e84b8f',
          400: '#d92a72',
          500: '#c2185b',
          600: '#ad1650',
          700: '#8e24aa',
          800: '#5e35b1',
        },
        accent: {
          cyan: '#00bcd4',
          blue: '#0277bd'
        },
        surface: {
          900: '#0a0a0f',
          800: '#111224',
          700: '#1a1a2e'
        }
      },
      fontFamily: {
        heading: ['Montserrat', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'hero-glow': '0 0 20px rgba(194,24,91,0.4)',
        'card-accent': '0 8px 30px rgba(0,0,0,0.6)'
      },
      fontSize: {
        'hero-xl': ['6rem', { lineHeight: '1', fontWeight: '800' }],
        'hero-lg': ['3rem', { lineHeight: '1.05', fontWeight: '700' }]
      },
      keyframes: {
        slowParallax: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-12px)' }
        }
      },
      animation: {
        'slow-parallax': 'slowParallax 8s linear infinite'
      }
    },
  },
  plugins: [],
}
