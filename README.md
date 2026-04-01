# Astro Portfolio & Blog

Personal portfolio website built with **Astro**, **Tailwind CSS v4**, and **Notion as CMS**. Designed with a clean Neo-Brutalism aesthetic featuring a narrow-centered layout (max-width 680px).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro (SSR + SSG hybrid) |
| UI | React Islands |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Blog CMS | Notion API |
| Deployment | Vercel |

## Design System

- **Layout**: Narrow-centered, max-width 680px
- **Style**: Neo-Brutalism (hard shadows, bold borders)
- **Colors**: `#1F1F1F` · `#00FFAB` · `#FF3D00` · `#C4C4C4`
- **Fonts**: Space Grotesk + Inter + JetBrains Mono

## Pages

| Route | Type | Description |
|-------|------|-------------|
| `/` | SSR | Home: hero, projects, latest posts, tech stack |
| `/blog` | SSR | Blog list with tag filter (from Notion) |
| `/blog/[slug]` | SSR | Blog detail with TOC, reading time, share |
| `/about` | SSG | Bio, experience timeline, tech stack cards |
| `/rss.xml` | SSR | RSS feed |

## Getting Started

```bash
# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env

# Start development server
yarn dev
```

## Environment Variables

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxx
```

### Notion Database Setup

Create a Notion database with these properties:

| Property | Type |
|----------|------|
| Title | Title |
| Slug | Text |
| Status | Select (`Draft` / `Published`) |
| Published Date | Date |
| Tags | Multi-select |
| Cover | Files & Media |
| Excerpt | Text |
| Featured | Checkbox |

> If environment variables are not set, the site shows mock/demo content automatically.

## Folder Structure

```
src/
  components/
    ui/           # Button, Badge, Tag
    blog/         # PostCard, BlogList, TableOfContents, ShareButtons
    projects/     # ProjectCard, TechLogoCard, TechLogoGrid
    layout/       # Navigation, Footer
    motion/       # PageTransition, StaggerContainer
  pages/
    index.astro         # Home
    about.astro         # About
    blog/index.astro    # Blog list
    blog/[slug].astro   # Blog detail
    rss.xml.ts          # RSS feed
  layouts/
    BaseLayout.astro    # HTML base with SEO + nav + footer
  lib/
    notion.ts     # Notion API helpers
    types.ts      # TypeScript interfaces
    utils.ts      # Reading time, date format, etc.
  content/
    data/         # social.json, stack.json
    projects/     # projects.json
  styles/
    global.css    # CSS variables + Tailwind v4 + Neo-Brutalism base
```

## Deployment

Deploy to Vercel with zero configuration. The `@astrojs/vercel` adapter is pre-configured.

```bash
# Build for production
yarn build
```

## Customization

1. Update `src/content/data/social.json` with your social links
2. Update `src/content/data/stack.json` with your tech stack
3. Update `src/content/projects/projects.json` with your projects
4. Edit `src/layouts/BaseLayout.astro` to replace "Ainur Rahman" with your actual name
5. Add your resume PDF to `public/resume.pdf`
6. Update the `site` URL in `astro.config.mjs`
