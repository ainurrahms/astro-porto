import rss from '@astrojs/rss';
import { getAllPosts } from '../lib/notion';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getAllPosts();

  return rss({
    title: 'Ainur Rahman — Blog',
    description: "Articles about web development, design, and things I'm learning.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.publishedDate),
      description: post.excerpt ?? '',
      link: `/blog/${post.slug}`,
    })),
    customData: '<language>en-us</language>',
  });
};
