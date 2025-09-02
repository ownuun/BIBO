import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // BIBO 디자인 시스템 컬러 팔레트 (피그마 기반)
        // Primary Colors (BIBO 로고 색상 기반)
        primary: {
          100: '#FFE5E5', // Light red
          500: '#FF0000', // BIBO 로고 빨간색
          900: '#CC0000', // Dark red
          DEFAULT: '#FF0000',
          foreground: '#FFFFFF',
        },
        // Secondary Colors (배경 노란색 기반)
        secondary: {
          100: '#FFF9E5', // Light yellow
          500: '#FFE500', // BIBO 배경 노란색
          900: '#E6CE00', // Dark yellow
          DEFAULT: '#FFE500',
          foreground: '#000000',
        },
        // Accent Color with variants
        accent: {
          DEFAULT: '#FF0000', // BIBO 로고 색상
          hover: '#E60000',
          focus: '#CC0000',
          foreground: '#FFFFFF',
        },
        // Grayscale (5 steps) - 노란색 배경과 조화
        grayscale: {
          50: '#FFFEF7',  // Almost white with yellow tint
          200: '#F5F0D1', // Light gray with yellow tint
          400: '#B8B08D', // Medium gray
          600: '#6B6540', // Dark gray
          900: '#2D2A1A', // Almost black with warm tint
        },
        // Legacy shadcn/ui colors (maintained for compatibility)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      // BIBO 타이포그래피 시스템
      fontFamily: {
        'crayons': ['CF Crayons', 'cursive', 'system-ui', 'sans-serif'], // BIBO 로고용 크레용 폰트
        'heading': ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        'body': ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        'mono': ['var(--font-geist-mono)', 'Consolas', 'monospace'],
      },
      fontSize: {
        // BIBO 로고용 크레용 폰트 스케일
        'logo-xl': ['6rem', { lineHeight: '1', letterSpacing: '0', fontWeight: '400' }], // 큰 로고
        'logo-lg': ['4rem', { lineHeight: '1', letterSpacing: '0', fontWeight: '400' }], // 중간 로고
        'logo-md': ['2.5rem', { lineHeight: '1', letterSpacing: '0', fontWeight: '400' }], // 작은 로고
        // Heading scale
        'h1': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h4': ['1.875rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'h5': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'h6': ['1.25rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '500' }],
        // Body text scale
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        // Caption
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.025em', fontWeight: '400' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config;

export default config;
