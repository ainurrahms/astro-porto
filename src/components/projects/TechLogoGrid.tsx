import { motion } from 'framer-motion';
import TechLogoCard from './TechLogoCard';
import type { TechStack } from '../../lib/types';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function TechLogoGrid({ stack }: { stack: TechStack[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-3"
    >
      {stack.map((tech) => (
        <TechLogoCard key={tech.slug} tech={tech} />
      ))}
    </motion.div>
  );
}
