import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite builds into `build/` so the existing Express server and GitHub Pages
// workflow keep serving the same directory. `base: './'` keeps assets
// relative, which is required for GitHub Pages project URLs.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'build',
    sourcemap: false,
  },
  server: {
    port: 3000,
  },
});
