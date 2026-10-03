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
| Deployment | Docker (Node standalone) on Dokploy |

## Design System

- **Layout**: Narrow-centered, max-width 680px
- **Style**: Neo-Brutalism (hard shadows, bold borders)
- **Colors**: `#1F1F1F` · `#00FFAB` · `#FF3D00` · `#C4C4C4`
- **Fonts**: Space Grotesk + Inter + JetBrains Mono

## Pages

| Route | Type | Description |
|-------|------|-------------|
| `/` | SSR | Home: hero, selected projects, latest posts |
| `/blog` | SSR | Blog list with tag filter (from Notion) |
| `/blog/[slug]` | SSR | Blog detail with TOC, reading time, share |
| `/about` | SSG | Bio, photo stack, experience timeline, social links |
| `/projects/[slug]` | SSG | Project case study: screenshots, tech stack, challenges |
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

> If environment variables are not set (or the Notion API fails), the site still runs, but the blog and the home page's latest posts are empty. `getMockPosts()` in `src/lib/notion.ts` currently returns an empty array.

## Folder Structure

```
src/
  components/
    ui/           # Button, Badge, Tag, DarkModeToggle, StackedPhotos
    blog/         # PostCard, BlogList, TableOfContents, ShareButtons
    projects/     # ProjectCard, TechLogoCard, TechLogoGrid
    layout/       # Navigation, Footer
    motion/       # PageTransition, StaggerContainer
  pages/
    index.astro         # Home
    about.astro         # About
    blog/index.astro    # Blog list
    blog/[slug].astro   # Blog detail
    projects/[slug].astro # Project case study
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

The site uses the `@astrojs/node` adapter in `standalone` mode and is deployed as a Docker image (see `Dockerfile`) on Dokploy. The container serves on port `4321`.

```bash
# Build for production
yarn build

# Run the built server locally
node ./dist/server/entry.mjs
```

Set `NOTION_API_KEY` and `NOTION_DATABASE_ID` as environment variables on the host.

## Customization

1. Update `src/content/data/social.json` with your social links
2. Update `src/content/data/stack.json` with your tech stack
3. Update `src/content/projects/projects.json` with your projects. Entries with a `slug` get a case study page at `/projects/[slug]`; put screenshots in `public/images/projects/<slug>/`
4. Edit `src/layouts/BaseLayout.astro` to replace "Ainur Rahman" with your actual name
5. Add your resume PDF to `public/resume.pdf`
6. Update the `site` URL in `astro.config.mjs`
