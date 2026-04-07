import { motion } from 'framer-motion';
import type { Project } from '../../lib/types';

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function ProjectCard({ project }: { project: Project }) {
  const Wrapper = project.slug ? motion.a : motion.article;

  return (
    <Wrapper
      {...(project.slug && {
        href: `/projects/${project.slug}`,
      })}
      variants={itemVariants}
      className="neo-card p-6 cursor-pointer block no-underline"
      whileHover={{ x: 2, y: 2, boxShadow: '2px 2px 0 var(--shadow)' }}
      whileTap={{ x: 4, y: 4, boxShadow: 'none' }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-display font-bold text-xl text-fg m-0">{project.title}</h3>
        {project.year && (
          <span className="font-mono text-[11px] font-bold text-fg bg-accent border-2 border-ink px-2 py-0.5 shrink-0 leading-snug">
            {project.year}
          </span>
        )}
      </div>

      {project.coverImage && (
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-45 object-cover border-2 border-ink mb-4"
        />
      )}

      <p className="font-sans text-sm text-muted m-0 mb-4 leading-relaxed">{project.description}</p>

      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-3">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn font-display font-semibold text-[13px] text-fg bg-surface px-3.5 py-1.5 no-underline"
            >
              GitHub ↗
            </a>
          )}
        </div>

        {project.slug && (
          <a
            href={`/projects/${project.slug}`}
            className="font-display font-semibold text-[13px] text-muted underline underline-offset-2 decoration-accent hover:text-fg transition-colors"
          >
            Read case study →
          </a>
        )}
      </div>
    </Wrapper>
  );
}