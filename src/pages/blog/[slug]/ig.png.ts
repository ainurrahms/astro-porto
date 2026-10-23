import type { APIRoute, GetStaticPaths } from 'astro';
import { getAllPosts, getPostBySlug } from '../../../lib/notion';
import { renderIgThumbnail } from '../../../lib/ig-thumbnail';

export const getStaticPaths = (async () => {
  const posts = await getAllPosts();
  const full = await Promise.all(posts.map((p) => getPostBySlug(p.slug)));
  return full.filter((post) => post !== null).map((post) => ({ params: { slug: post.slug }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params, props, site }) => {
  // Load by slug rather than trusting props: they can be stale or content-less under dev HMR.
  const post = (await getPostBySlug(params.slug as string)) ?? props.post;
  const png = await renderIgThumbnail(post, site?.host ?? '');
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
