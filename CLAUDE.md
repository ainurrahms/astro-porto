# CLAUDE.md — astro-porto

Konteks project ini buat AI assistant (Claude). Baca file ini duluan sebelum bantu nambah fitur atau brainstorming, biar langsung nyambung tanpa explore ulang dari nol. Dokumentasi lebih dalam per-area ada di `obsidian-vault/` (lokal, tidak ikut commit).

## Apa ini

Portfolio + blog pribadi Ainur Rahman. Astro 6 (SSR default) + React islands + Tailwind CSS v4 + Notion sebagai CMS blog. Gaya desain **Neo-Brutalism**, layout sempit (max-width ~680px).

## Commands

```
yarn dev       # dev server
yarn build     # production build
yarn preview   # preview hasil build
yarn lint      # eslint src --ext .ts,.tsx
yarn format    # prettier --write src
```

Node `>=22.12.0`. Package manager: **yarn** (ada `yarn.lock`, jangan pakai npm/pnpm).

## Struktur & routing

- File-based routing di `src/pages/`. Default `output: 'server'` (SSR) di `astro.config.mjs`, adapter `@astrojs/node` (mode `standalone`).
- Override per halaman lewat `export const prerender = true/false` di frontmatter.
  - `/` -> SSR · `/about` -> SSG (`prerender: true`) · `/blog` -> SSR · `/blog/[slug]` -> SSR · `/rss.xml` -> endpoint (`@astrojs/rss`)
- Komponen interaktif = `.tsx` + directive `client:load`. Komponen statis (Navigation, Footer) = `.astro` murni.
- Path alias `@/*` -> `./src/*` (lihat `tsconfig.json`), tapi kode masih campur sama relative import (`../../lib/...`) — pakai alias kalau nulis import baru biar makin konsisten.
- Semua halaman dibungkus `src/layouts/BaseLayout.astro` (SEO via `astro-seo`, Navigation, Footer, script anti-flash tema).

## Data & content

- **Blog** — dari Notion API lewat `src/lib/notion.ts`: `getAllPosts()`, `getFeaturedPosts()`, `getPostBySlug(slug)`. Butuh env `NOTION_API_KEY` + `NOTION_DATABASE_ID`. Kalau kosong/API gagal -> fallback ke `getMockPosts()` (**lihat Known Issues**, saat ini kosong).
- **Project showcase** — `src/content/projects/projects.json`
- **Tech stack icons** — `src/content/data/stack.json`
- **Social links** — `src/content/data/social.json`
- Semua shape data ada di `src/lib/types.ts` (`BlogPost`, `Project`, `TechStack`, `SocialLink`) — update type ini kalau nambah field baru di JSON/Notion.
- Helper umum (format tanggal, reading time, slugify, extract heading buat TOC) ada di `src/lib/utils.ts`.

## Design tokens

- Warna: `#1F1F1F` (fg) · `#00FFAB` (aksen hijau) · `#FF3D00` (aksen merah) · `#C4C4C4` (netral)
- Font: Space Grotesk (display/heading) · Inter (body) · JetBrains Mono (code)
- Layout: narrow-centered, max-width ~680px (kelas Tailwind custom `max-w-170`)
- Tailwind **v4** lewat plugin Vite `@tailwindcss/vite` — bukan `tailwind.config.js` klasik, cek variabel warna di `src/styles/global.css`.
- Dark/light theme: atribut `data-theme` di `<html>`, state disimpan di `localStorage['theme']`, fallback ke `prefers-color-scheme`.

## Known issues — perlu hati-hati

- `getMockPosts()` di `notion.ts` return array kosong (isinya di-comment semua). README klaim ada mock/demo content otomatis kalau env kosong — kenyataannya `/blog` bakal keliatan kosong. Kalau diminta bikin demo atau debug "blog kosong", ini penyebabnya.
- Adapter aktif di `astro.config.mjs` = `@astrojs/node`, tapi `@astrojs/vercel` juga ada di dependencies dan README bilang target deploy Vercel. Belum sinkron — tanya target deploy sebelum ubah adapter.
- `public/resume.pdf` belum ada (disebut di README sebagai langkah kustomisasi yang belum dilakukan).
- Import style campur alias `@/*` vs relative path — tidak fatal, cuma tidak konsisten.

## Kalau diminta nambah fitur / brainstorming

Langsung acu ke file/fungsi yang relevan dari daftar di atas — nggak perlu re-explore struktur dasar tiap kali. Untuk konteks lebih detail per-komponen atau per-halaman, buka `obsidian-vault/Home.md` dan note-note terkait di situ.

## Terkait

- `obsidian-vault/Home.md` — knowledge base lengkap (arsitektur, komponen, design system, dll)
- `README.md` — setup guide standar (install, env vars, struktur database Notion)
