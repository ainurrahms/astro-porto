'use client';
import { useState, useEffect } from 'react';

interface Heading { id: string; text: string; level: 2 | 3; }

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveId(e.target.id)),
      { rootMargin: '-80px 0px -60% 0px' }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="font-display font-bold text-[13px] text-fg uppercase tracking-widest mb-3 mt-0">
        On this page
      </p>
      <ol className="list-none p-0 m-0">
        {headings.map((h) => (
          <li key={h.id} className={`mb-1.5 ${h.level === 3 ? 'pl-4' : ''}`}>
            <a
              href={`#${h.id}`}
              className={`block pl-2 font-sans text-[13px] no-underline border-l-2 transition-all duration-150 ${
                activeId === h.id
                  ? 'border-accent text-fg font-semibold'
                  : 'border-transparent text-muted font-normal'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
