'use client';
import { useState } from 'react';

export default function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  const btnCls = 'neo-btn inline-flex items-center gap-1.5 px-3.5 py-2 font-display font-semibold text-[13px] text-fg bg-surface no-underline';

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleCopy}
        className={`${btnCls} ${copied ? 'bg-accent text-[#1f1f1f]!' : ''}`}
      >
        {copied ? '✓ Copied!' : '⬡ Copy Link'}
      </button>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={btnCls}
      >
        Share on X
      </a>
    </div>
  );
}
