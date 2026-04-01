interface BadgeProps {
  label: string;
  variant?: 'default' | 'green' | 'red';
}

const variantMap = {
  default: { background: '#F7F7F7', color: '#1F1F1F', border: '2px solid #1F1F1F' },
  green: { background: '#00FFAB', color: '#1F1F1F', border: '2px solid #1F1F1F' },
  red: { background: '#FF3D00', color: '#FFFFFF', border: '2px solid #1F1F1F' },
};

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  const style = {
    ...variantMap[variant],
    display: 'inline-block',
    fontSize: '12px',
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 600,
    padding: '2px 8px',
    lineHeight: '1.6',
    letterSpacing: '0.03em',
  };

  return <span style={style as React.CSSProperties}>{label}</span>;
}
