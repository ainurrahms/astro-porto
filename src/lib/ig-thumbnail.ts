import { readFile } from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import type { BlogPostContent } from './types';
import { formatDate } from './utils';

const WIDTH = 1080;
const HEIGHT = 1350; // Instagram feed 4:5
const INK = '#1f1f1f';
const ACCENT = '#00ffab';

// satori only reads ttf/otf/woff, not woff2.
const font = (pkg: string, file: string) =>
  readFile(path.resolve('node_modules/@fontsource', pkg, 'files', file));

let fonts: ReturnType<typeof loadFonts> | null = null;

function loadFonts() {
  return Promise.all([
    font('space-grotesk', 'space-grotesk-latin-700-normal.woff'),
    font('inter', 'inter-latin-500-normal.woff'),
  ]).then(([display, body]) => [
    { name: 'Space Grotesk', data: display, weight: 700 as const, style: 'normal' as const },
    { name: 'Inter', data: body, weight: 500 as const, style: 'normal' as const },
  ]);
}

// Covers are downloaded to public/notion at build time; satori can't render webp/avif, so re-encode.
async function coverDataUri(coverUrl?: string): Promise<string | undefined> {
  if (!coverUrl?.startsWith('/')) return undefined;
  try {
    const buf = await sharp(await readFile(path.resolve('public', coverUrl.slice(1))))
      .resize(840, 480, { fit: 'cover' })
      .jpeg({ quality: 85 })
      .toBuffer();
    return `data:image/jpeg;base64,${buf.toString('base64')}`;
  } catch (error) {
    console.warn(`IG thumbnail: cover skipped (${coverUrl})`, error);
    return undefined;
  }
}

function titleSize(title: string, hasCover: boolean): number {
  const base = title.length < 40 ? 88 : title.length < 80 ? 72 : 60;
  return hasCover ? Math.min(base, 64) : base;
}

type Node = { type: string; props: Record<string, unknown> };

const h = (type: string, style: Record<string, unknown>, children?: unknown, extra = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

// Falls back to the first image in the post body when the Notion Cover property is empty.
const firstContentImage = (content: string) => content.match(/!\[[^\]]*\]\(([^)\s]+)/)?.[1];

export async function renderIgThumbnail(post: BlogPostContent, host: string): Promise<Buffer> {
  fonts ??= loadFonts();
  const cover = await coverDataUri(post.coverUrl ?? firstContentImage(post.content ?? ''));

  const tags = post.tags.slice(0, 3).map((tag) =>
    h(
      'div',
      {
        display: 'flex',
        padding: '6px 18px',
        border: `4px solid ${INK}`,
        background: ACCENT,
        color: INK,
        fontFamily: 'Space Grotesk',
        fontSize: 28,
      },
      tag,
    ),
  );

  const body = [
    cover &&
      h('img', { width: 840, height: 480, border: `6px solid ${INK}`, objectFit: 'cover' }, undefined, {
        src: cover,
        width: 840,
        height: 480,
      }),
    h(
      'div',
      {
        display: 'flex',
        fontFamily: 'Space Grotesk',
        fontSize: titleSize(post.title, !!cover),
        lineHeight: 1.1,
        color: INK,
      },
      post.title,
    ),
    !cover &&
      post.excerpt &&
      h(
        'div',
        { display: 'flex', fontFamily: 'Inter', fontSize: 34, lineHeight: 1.4, color: '#3c3c3c' },
        post.excerpt.length > 140 ? `${post.excerpt.slice(0, 137)}...` : post.excerpt,
      ),
  ].filter(Boolean);

  const tree = h(
    'div',
    {
      display: 'flex',
      boxSizing: 'border-box',
      width: WIDTH,
      height: HEIGHT,
      background: '#ffffff',
      padding: '56px 72px 72px 56px',
    },
    h(
      'div',
      {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        flex: 1,
        padding: 48,
        border: `8px solid ${INK}`,
        background: '#ffffff',
        boxShadow: `16px 16px 0 ${INK}`,
      },
      [
        h('div', { display: 'flex', gap: 12 }, tags),
        h('div', { display: 'flex', flexDirection: 'column', gap: 32 }, body),
        h(
          'div',
          {
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 24,
            borderTop: `4px solid ${INK}`,
            fontFamily: 'Inter',
            fontSize: 28,
            color: INK,
          },
          [h('div', { display: 'flex' }, host), h('div', { display: 'flex' }, formatDate(post.publishedDate))],
        ),
      ],
    ),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svg = await satori(tree as any, { width: WIDTH, height: HEIGHT, fonts: await fonts });
  return sharp(Buffer.from(svg)).png().toBuffer();
}
