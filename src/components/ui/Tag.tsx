interface TagProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
}

export default function Tag({ label, active = false, onClick, href }: TagProps) {
  const style: React.CSSProperties = {
    display: 'inline-block',
    fontSize: '12px',
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 600,
    padding: '3px 10px',
    border: '2px solid #1F1F1F',
    background: active ? '#00FFAB' : '#FFFFFF',
    color: '#1F1F1F',
    cursor: onClick || href ? 'pointer' : 'default',
    textDecoration: 'none',
    transition: 'background 0.15s',
    letterSpacing: '0.02em',
  };

  if (href) {
    return (
      <a href={href} style={style}>
        {label}
      </a>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} style={{ ...style, border: '2px solid #1F1F1F' }}>
        {label}
      </button>
    );
  }

  return <span style={style}>{label}</span>;
}
