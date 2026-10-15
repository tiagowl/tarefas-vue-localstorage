/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        text: {
          DEFAULT: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
        },
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
        },
        danger: '#DC2626',
        status: {
          todo: '#64748B',
          doing: '#D97706',
          done: '#16A34A',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(15,23,42,.08)',
        md: '0 8px 24px rgba(15,23,42,.12)',
        lg: '0 20px 48px rgba(15,23,42,.22)',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        display: ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        h2: ['20px', { lineHeight: '1.35', fontWeight: '600' }],
        body: ['16px', { lineHeight: '1.5' }],
      },
      keyframes: {
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'toast-in': 'toast-in 200ms ease-out',
      },
    },
  },
  plugins: [],
};
