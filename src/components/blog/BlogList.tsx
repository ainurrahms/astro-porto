'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { BlogPost } from '../../lib/types';
import PostCard from './PostCard';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function BlogList({ posts, allTags }: { posts: BlogPost[]; allTags: string[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {['All', ...allTags].map((tag) => {
          const isAll = tag === 'All';
          const isActive = isAll ? !activeTag : activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setActiveTag(isAll ? null : tag === activeTag ? null : tag)}
              className={`font-display font-semibold text-xs px-3 py-1 border-2 border-ink cursor-pointer transition-colors duration-150 ${
                isActive ? 'bg-accent text-[#1f1f1f]' : 'bg-surface text-fg hover:bg-card'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4"
      >
        {filtered.length > 0 ? (
          filtered.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="font-sans text-muted">No posts found for this tag.</p>
        )}
      </motion.div>
    </div>
  );
}
