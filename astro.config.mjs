// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Notion images are downloaded into public/notion while pages render, which is after Astro
// has already copied public/ into dist/. Copy them over once the build is done.
const copyNotionImages = {
  name: 'copy-notion-images',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      if (!existsSync('public/notion')) return;
      await cp('public/notion', fileURLToPath(new URL('notion', dir)), { recursive: true });
    },
  },
};

export default defineConfig({
  site: 'https://porto.ainurrahmans.dev',
  output: 'static',
  integrations: [react(), sitemap(), copyNotionImages],
  vite: {
    plugins: [tailwindcss()],
  },
});
