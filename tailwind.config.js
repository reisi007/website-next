/** @type {import('tailwindcss').Config} */

function extensions() {
    return ['hover', 'focus', 'disabled', 'visited']
}

module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            fontWeight: extensions(),
            fontFamily: {
                sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "Liberation Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
            },
            colors: {
                primary: {
                    DEFAULT: '#2A9D8F',
                    alternative: '#1A6158',
                    accent: '#4ED0C1'
                },
                onPrimary: {
                    DEFAULT: '#FFFFFF',
                    accent: '#E8EDED'
                },
                secondary: {
                    DEFAULT: '#E8EDED',
                    alternative: '#040F0F'
                },
                gold: {
                    DEFAULT: '#EBE357'
                }
            },
            spacing: {
                '128': '32rem',
                '192': '48rem'
            }
        }
    },
    plugins: [],
}
