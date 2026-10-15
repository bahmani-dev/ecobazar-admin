import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                admin: {
                    bg: '#F7F6F2',
                    panel: '#FFFFFF',
                    border: '#E5E2D8',
                    ink: '#1E231D',
                    muted: '#6B6F63',
                    sidebar: '#1E2A22',
                    sidebarMuted: '#9AAA9D',
                    accent: '#57734B',
                    accentHover: '#48603E',
                    accentSoft: '#E8EEE4',
                    danger: '#9C4221',
                    dangerSoft: '#F5E7E0',
                    warn: '#946B1E',
                    warnSoft: '#F4ECDA',
                    info: '#3D5A73',
                    infoSoft: '#E4EBF0',
                },
            },
            borderRadius: { admin: '6px' },
        },
    },

    plugins: [forms],
};
