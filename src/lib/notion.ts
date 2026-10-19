import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import type { BlogPost, BlogPostContent } from './types';

const NOTION_API_KEY = import.meta.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = import.meta.env.NOTION_DATABASE_ID;

function getNotionClient(): Client | null {
  if (!NOTION_API_KEY) return null;
  return new Client({ auth: NOTION_API_KEY });
}

function getN2M(notion: Client): NotionToMarkdown {
  return new NotionToMarkdown({ notionClient: notion });
}

const IMAGE_DIR = path.resolve('public/notion');
const IMAGE_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/svg+xml': '.svg',
};

// Notion-hosted file URLs are signed and expire (~1h), so download them at build time.
// Hash ignores the query string so the same file maps to the same local name across builds.
async function localizeImage(url: string): Promise<string> {
  if (!/^https?:\/\//.test(url)) return url;

  try {
    const { origin, pathname } = new URL(url);
    const hash = createHash('sha1').update(origin + pathname).digest('hex').slice(0, 16);
    const urlExt = path.extname(pathname).toLowerCase();

    if (urlExt) {
      const name = `${hash}${urlExt}`;
      if (existsSync(path.join(IMAGE_DIR, name))) return `/notion/${name}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const type = (res.headers.get('content-type') ?? '').split(';')[0].trim();
    const ext = IMAGE_EXT[type] ?? (urlExt || '.img');
    const name = `${hash}${ext}`;

    await mkdir(IMAGE_DIR, { recursive: true });
    await writeFile(path.join(IMAGE_DIR, name), Buffer.from(await res.arrayBuffer()));
    return `/notion/${name}`;
  } catch (error) {
    console.error('Failed to download Notion image:', error);
    return url;
  }
}

async function localizeMarkdownImages(markdown: string): Promise<string> {
  const urls = new Set<string>();
  for (const m of markdown.matchAll(/!\[[^\]]*\]\(([^)\s]+)[^)]*\)/g)) urls.add(m[1]);

  const entries = await Promise.all([...urls].map(async (u) => [u, await localizeImage(u)] as const));
  let result = markdown;
  for (const [from, to] of entries) {
    if (from !== to) result = result.split(from).join(to);
  }
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function mapPageToBlogPost(page: any): Promise<BlogPost> {
  const props = page.properties;
  const rawCover: string | undefined =
    props.Cover?.files?.[0]?.file?.url ?? props.Cover?.files?.[0]?.external?.url ?? undefined;

  return {
    id: page.id,
    title: props.Title?.title?.[0]?.plain_text ?? 'Untitled',
    slug: props.Slug?.rich_text?.[0]?.plain_text ?? page.id,
    status: props.Status?.select?.name ?? 'Draft',
    publishedDate: props['Published Date']?.date?.start ?? '',
    tags: props.Tags?.multi_select?.map((t: { name: string }) => t.name) ?? [],
    coverUrl: rawCover ? await localizeImage(rawCover) : undefined,
    excerpt: props.Excerpt?.rich_text?.[0]?.plain_text ?? undefined,
    featured: props.Featured?.checkbox ?? false,
  };
}

let dataSourceId: Promise<string> | null = null;

// @notionhq/client v5 queries data sources, not databases; resolve the first one of the database.
function getDataSourceId(notion: Client): Promise<string> {
  dataSourceId ??= notion.databases
    .retrieve({ database_id: NOTION_DATABASE_ID })
    .then((db) => {
      const id = 'data_sources' in db ? db.data_sources[0]?.id : undefined;
      if (!id) throw new Error('Notion database has no data source');
      return id;
    });
  return dataSourceId;
}

let postsPromise: Promise<BlogPost[]> | null = null;

// Memoized so a static build hits the Notion API once, not once per page.
export function getAllPosts(): Promise<BlogPost[]> {
  postsPromise ??= fetchAllPosts();
  return postsPromise;
}

async function fetchAllPosts(): Promise<BlogPost[]> {
  const notion = getNotionClient();
  if (!notion || !NOTION_DATABASE_ID) {
    return getMockPosts();
  }

  try {
    const response = await notion.dataSources.query({
      data_source_id: await getDataSourceId(notion),
      filter: {
        property: 'Status',
        select: { equals: 'Published' },
      },
      sorts: [{ property: 'Published Date', direction: 'descending' }],
    });

    const posts = await Promise.all(response.results.map(mapPageToBlogPost));

    const seen = new Set<string>();
    return posts.filter((post) => {
      if (seen.has(post.slug)) {
        console.warn(`Duplicate slug "${post.slug}" skipped (${post.id})`);
        return false;
      }
      seen.add(post.slug);
      return true;
    });
  } catch (error) {
    console.error('Notion API error:', error);
    return getMockPosts();
  }
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.featured).slice(0, 4);
}

export async function getPostBySlug(slug: string): Promise<BlogPostContent | null> {
  const notion = getNotionClient();
  if (!notion || !NOTION_DATABASE_ID) {
    const mock = getMockPosts().find((p) => p.slug === slug);
    if (!mock) return null;
    return { ...mock, content: getMockContent() };
  }

  try {
    const response = await notion.dataSources.query({
      data_source_id: await getDataSourceId(notion),
      filter: {
        and: [
          { property: 'Slug', rich_text: { equals: slug } },
          { property: 'Status', select: { equals: 'Published' } },
        ],
      },
    });

    if (response.results.length === 0) return null;

    const page = response.results[0];
    const post = await mapPageToBlogPost(page);
    const n2m = getN2M(notion!);
    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const content = await localizeMarkdownImages(n2m.toMarkdownString(mdBlocks).parent);

    return { ...post, content };
  } catch (error) {
    console.error('Notion API error fetching post:', error);
    return null;
  }
}

// Mock data for development / when Notion keys aren't configured
function getMockPosts(): BlogPost[] {
  return [
    // {
    //   id: '1',
    //   title: 'Getting Started with Astro and Notion',
    //   slug: 'getting-started-astro-notion',
    //   status: 'Published',
    //   publishedDate: '2026-03-01',
    //   tags: ['Astro', 'Notion', 'Tutorial'],
    //   excerpt: 'A step-by-step guide to setting up a blog powered by Astro and Notion API.',
    //   featured: true,
    //   coverUrl: undefined,
    // },
    // {
    //   id: '2',
    //   title: 'Neo-Brutalism Design System in Tailwind CSS v4',
    //   slug: 'neo-brutalism-tailwind-v4',
    //   status: 'Published',
    //   publishedDate: '2026-02-15',
    //   tags: ['Design', 'Tailwind', 'CSS'],
    //   excerpt: 'Building a bold Neo-Brutalism design system using the new Tailwind CSS v4 architecture.',
    //   featured: true,
    //   coverUrl: undefined,
    // },
    // {
    //   id: '3',
    //   title: 'Framer Motion Tips for Astro Islands',
    //   slug: 'framer-motion-astro-islands',
    //   status: 'Published',
    //   publishedDate: '2026-01-20',
    //   tags: ['Framer Motion', 'Astro', 'Animation'],
    //   excerpt: 'How to use Framer Motion effectively inside Astro React islands for smooth page transitions.',
    //   featured: false,
    //   coverUrl: undefined,
    // },
    // {
    //   id: '4',
    //   title: 'Building a Portfolio with Next.js and TypeScript',
    //   slug: 'portfolio-nextjs-typescript',
    //   status: 'Published',
    //   publishedDate: '2025-12-10',
    //   tags: ['Next.js', 'TypeScript', 'Portfolio'],
    //   excerpt: 'A comprehensive guide to building a production-ready portfolio website with Next.js.',
    //   featured: false,
    //   coverUrl: undefined,
    // },
  ];
}

function getMockContent(): string {
  return `## Introduction

This is a sample blog post with mock content. Set up your \`NOTION_API_KEY\` and \`NOTION_DATABASE_ID\` environment variables to load real content from Notion.

## Getting Started

To connect this blog to Notion:

1. Create a Notion integration at [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Copy your API key to \`.env\` as \`NOTION_API_KEY\`
3. Share your database with the integration
4. Copy the database ID to \`.env\` as \`NOTION_DATABASE_ID\`

## Code Example

\`\`\`typescript
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const posts = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
});
\`\`\`

## Conclusion

Once your environment variables are configured, all posts from your Notion database will appear automatically.
`;
}
