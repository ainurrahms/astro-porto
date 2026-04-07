import { motion } from 'framer-motion';
import type { TechStack } from '../../lib/types';

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function TechLogoCard({ tech }: { tech: TechStack }) {
  return (
    <motion.div
      variants={itemVariants}
      title={tech.name}
      className="neo-card w-18 h-18 flex flex-col items-center justify-center gap-1 p-2 cursor-default"
      whileHover={{ x: 2, y: 2, boxShadow: '2px 2px 0 var(--shadow)' }}
      whileTap={{ x: 4, y: 4, boxShadow: 'none' }}
    >
      <img
        src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color.replace('#', '')}`}
        alt={tech.name}
        width={32}
        height={32}
        className="object-contain"
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent && !parent.querySelector('.icon-fallback')) {
            const fb = document.createElement('span');
            fb.className = 'icon-fallback font-display font-bold text-[13px] text-fg';
            fb.textContent = tech.name.slice(0, 2).toUpperCase();
            parent.insertBefore(fb, target);
          }
        }}
      />
      <span className="font-sans text-[9px] font-medium text-muted text-center leading-tight max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
        {tech.name}
      </span>
    </motion.div>
  );
}
