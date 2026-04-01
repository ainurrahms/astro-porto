import { motion } from 'framer-motion';
import type { BlogPost } from '../../lib/types';
import { formatDate } from '../../lib/utils';

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function PostCard({ post }: { post: BlogPost }) {
  return (
    <motion.article variants={itemVariants}>
      <a href={`/blog/${post.slug}`} className="neo-card block no-underline p-5">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-display font-semibold text-[11px] px-2 py-0.5 border-2 border-ink bg-accent text-[#1f1f1f] leading-snug"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h2 className="font-display font-bold text-lg text-fg m-0 mb-2 leading-snug">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="font-sans text-sm text-muted m-0 mb-3 leading-relaxed">
            {post.excerpt}
          </p>
        )}
        <time dateTime={post.publishedDate} className="font-sans text-xs font-medium text-subtle">
          {formatDate(post.publishedDate)}
        </time>
      </a>
    </motion.article>
  );
}
