import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  href?: string;
}

const variantClass = {
  primary:   'bg-accent text-[#1f1f1f]',
  secondary: 'bg-fg text-surface',
  outline:   'bg-surface text-fg',
};

const sizeClass = {
  sm: 'text-[13px] px-[14px] py-[6px]',
  md: 'text-[15px] px-5 py-[10px]',
  lg: 'text-base px-7 py-[13px]',
};

const base =
  'neo-btn inline-flex items-center gap-2 font-display font-semibold leading-none no-underline';

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  href,
  className = '',
  ...props
}: ButtonProps) {
  const cls = `${base} ${variantClass[variant]} ${sizeClass[size]} ${className}`;

  if (href) {
    return <a href={href} className={cls}>{children}</a>;
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
