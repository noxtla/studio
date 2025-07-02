// tailwind.config.ts
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['"Space Grotesk"', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        // ACTUALIZADOS: NUEVOS COLORES PRIMARY, SECONDARY, ACCENT
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        // Destructive permanece igual
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        // COLORES ESPECÍFICOS DEL QUIZ (ACTUALIZADOS)
        'quiz-action': { // RENOMBRADO: Antes 'quiz-primary-green'
          DEFAULT: 'hsl(var(--primary))', // Usa el nuevo primary (naranja)
          darker: 'hsl(var(--quiz-primary-button-darker))', // Para hover
        },
        'quiz-success-green': { // Mantiene el verde para semántica de 'éxito'
          DEFAULT: '#22c55e',
          darker: '#16a34a',
        },
        'quiz-danger-red': { // Mantiene el rojo para semántica de 'peligro'
          DEFAULT: '#ef4444',
          darker: '#dc2626',
        },
        'quiz-background-light': '#f0f2f5', // Fondo del body del quiz
        'quiz-section-bg': '#f9fafb', // Fondo de la sección de flashcard
        'quiz-message-blue': { // Usa derivados de la nueva paleta
          DEFAULT: 'hsl(var(--quiz-message-blue))',
          text: 'hsl(var(--quiz-message-blue-text))',
        },
        'quiz-elaboration-green': { // Usa derivados de la nueva paleta
          DEFAULT: 'hsl(var(--quiz-elaboration-green))',
          border: 'hsl(var(--quiz-elaboration-border))',
          text: 'hsl(var(--quiz-elaboration-text))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'quiz-lg': '16px', // .container
        'quiz-md': '12px', // .flashcard-section, .message-box, .elaboration-box
        'quiz-sm': '10px', // .button
        'quiz-xs': '8px', // .section-nav-button
        'full': '9999px', // Para el spinner
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'step-enter': 'stepEnter 0.5s ease-in-out forwards',
        spin: 'spin 1s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;