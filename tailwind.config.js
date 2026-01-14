/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'omni-green': '#05F219',
                'omni-green-dim': '#03a110',
                'omni-black': '#000000',
                'omni-dark': '#0a0f0a',
                'omni-accent': '#00ff33',
            },
            animation: {
                'spin-slow': 'spin 10s linear infinite',
                'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #05F219' },
                    '100%': { boxShadow: '0 0 20px #05F219, 0 0 10px #05F219' },
                }
            }
        },
    },
    plugins: [],
}
