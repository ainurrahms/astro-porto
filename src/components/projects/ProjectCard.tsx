import { motion } from 'framer-motion';
import type { Project } from '../../lib/types';

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      variants={itemVariants}
      className="neo-card p-6"
      whileHover={{ x: 2, y: 2, boxShadow: '2px 2px 0 var(--shadow)' }}
      whileTap={{ x: 4, y: 4, boxShadow: 'none' }}
    >
      {project.coverImage && (
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-[180px] object-cover border-2 border-ink mb-4"
        />
      )}
      <h3 className="font-display font-bold text-xl text-fg m-0 mb-2">{project.title}</h3>
      <p className="font-sans text-sm text-muted m-0 mb-4 leading-relaxed">{project.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="font-display font-semibold text-[11px] px-2 py-0.5 border-2 border-ink bg-card text-fg"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn font-display font-semibold text-[13px] text-[#1f1f1f] bg-accent px-3.5 py-1.5 no-underline"
          >
            Live ↗
          </a>
        )}
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
    </motion.article>
  );
}
