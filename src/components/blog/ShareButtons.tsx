'use client';
import { useState } from 'react';

export default function ShareButtons({
  title,
  url,
  igImageUrl,
}: {
  title: string;
  url: string;
  igImageUrl: string;
}) {
  const [copied, setCopied] = useState(false);
  const [igBusy, setIgBusy] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  // Instagram has no web share intent: on mobile the share sheet (with IG in it) takes the image
  // as a file; elsewhere fall back to downloading it for manual upload.
  const handleInstagram = async () => {
    setIgBusy(true);
    try {
      const blob = await (await fetch(igImageUrl)).blob();
      const file = new File([blob], `${title}.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        const href = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement('a'), { href, download: file.name });
        a.click();
        URL.revokeObjectURL(href);
      }
    } catch { /* share sheet dismissed or fetch failed */ }
    setIgBusy(false);
  };

  const btnCls = 'neo-btn inline-flex items-center gap-1.5 px-3.5 py-2 font-display font-semibold text-[13px] text-fg bg-surface no-underline';

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleCopy}
        className={`${btnCls} ${copied ? 'bg-accent text-[#1f1f1f]!' : ''}`}
      >
        {copied ? '✓ Copied!' : '⬡ Copy Link'}
      </button>
      <button onClick={handleInstagram} disabled={igBusy} className={btnCls}>
        {igBusy ? 'Preparing...' : 'Share to Instagram'}
      </button>
    </div>
  );
}
