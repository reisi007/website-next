/** @type {import('tailwindcss').Config} */

function extensions() {
    return ['hover', 'focus', 'disabled', 'visited']
}

module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontWeight: extensions(),
            fontFamily: {
                sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "Liberation Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
            },
            colors: {
                primary: {
                    DEFAULT: '#786DBF',
                    alternative: '#DBB8FF',
                    accent: '#FAC9FF'
                },
                onPrimary: {
                    DEFAULT: '#FFFFFF',
                },
                secondary: {
                    DEFAULT: '#50B4C7',
                    alternative: '#9EDBCD'
                },
                gold: {
                    DEFAULT: '#FFD700'
                }
            },
            screens: {
                'xxl': '1400px'
            },
            spacing: {
                '128': '32rem',
                '192': '48rem'
            }
        }
    },
    plugins: [],
}
