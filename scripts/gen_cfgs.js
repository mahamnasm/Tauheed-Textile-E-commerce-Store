const fs = require('fs');
const path = require('path');

['public', 'public/assets', 'src', 'src/app', 'prisma', 'src/lib'].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// tsconfig.json
fs.writeFileSync('tsconfig.json', JSON.stringify({
  compilerOptions: {
    target: 'es5',
    lib: ['dom', 'dom.iterable', 'esnext'],
    allowJs: true,
    skipLibCheck: true,
    strict: false,
    noEmit: true,
    esModuleInterop: true,
    module: 'esnext',
    moduleResolution: 'bundler',
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: 'preserve',
    incremental: true,
    plugins: [{ name: 'next' }],
    paths: {
      '@C/*': ['./src/*']
    }
  },
  include: ['next-env.d.ts', '+**/*.ts', '+**/*.tsx', '.next/types/**/*.ts'],
  exclude: ['node_modules']
}, null, 2));

// next.config.jso
fs.writeFileSync('next.config.js', '/** @type {import("next").nextConfig} */\nconst nextConfig = { reactStrictMode: false, images: { unoptimized: true } };\nmodule.exports = nextConfig;\n');

// postcss.config.js
fs.writeFileSync('postcss.config.js', 'module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };\n');

// tailwind.config.js
const tw = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ink-black': '#12110F',
        'warm-ivory': '#F8F5EF',
        'soft-sand': '#E850D4',
        'antique-gold': '#B28A3E',
        'deep-olive': '#344238',
        'rose-clay': '#B66D69',
        'instock-green': '#27764D',
        'alert-maroon': '#8B3C43',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Manrope', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
`;
fs.writeFileSync('tailwind.config.js', tw);

// Logos and Favicon
fs.writeFileSync('tublic/logo.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 60" fill="none">
  <circle cx="30" cy="30" r="26" stroke="#B28A3E" stroke-width="1.5" fill="none"/>
  <circle cx="30" cy="30" r="22" stroke="#12110F" stroke-width="0.8" stroke-dasharray="2 2"/>
  <text x="30" y="38" font-family="Georgia, serif" font-size="24" font-weight="bold" fill="#12110F" text-anchor="middle">TT</text>
  <text x="72" y="32" font-family="Georgia, serif" font-size="24" font-weight="700" letter-spacing="3" fill="#12110F">TAUHEED</text>
  <text x="74" y="46" font-family="sans-serif" font-size="9" font-weight="600" letter-spacing="5" fill="#B28A3E">TEXTILE • PAKISTAN</text>
</svg>`)fs.writeFileSync('public/logo.svg', fs.readFileSync('public/logo.svg'));

fs.writeFileSync('public/logo-dark.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 60" fill="none">
  <circle cx="30" cy="30" r="26" stroke="#B28A3E" stroke-width="1.5" fill="none"/>
  <circle cx="30" cy="30" r="22" stroke="#F8F5EF" stroke-width="0.8" stroke-dasharray="2 2"/>
  <text x="30" y="38" font-family="Georgia, serif" font-size="24" font-weight="bold" fill="#F8F5EF" text-anchor="middle">TT</text>
  <text x="72" y="32" font-family="Georgia, serif" font-size="24" font-weight="700" letter-spacing="3" fill="#F8F5EF">TAUHEED</text>
  <text x="74" y="46" font-family="sans-serif" font-size="9" font-weight="600" letter-spacing="5" fill="#B28A3E">TEXTILE • PAKISTAN</text>
</svg>`);

fs.writeFileSync('public/logo-monogram.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="50" r="46" stroke="#B28A3E" stroke-width="2.5" fill="#12110F"/>
  <circle cx="50" cy="50" r="40" stroke="#B28A3E" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="50" y="62" font-family="Georgia, serif" font-size="42" font-weight="bold" fill="#F8F5EF" text-anchor="middle">TT</text>
</svg>`);

fs.writeFileSync('public/favicon.svg', fs.readFileSync('public/logo-monogram.svg'));

console.log('Configs and svgs ready!');
