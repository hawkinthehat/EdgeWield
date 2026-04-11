import type { SVGProps } from 'react';

type AppLogoProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

export default function AppLogo({ title = 'EdgeWield Pro logo', className, ...props }: AppLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label={title}
      width={32}
      height={32}
      className={className ? `${className} h-8 w-8` : 'h-8 w-8'}
      {...props}
    >
      <title>{title}</title>
      <path d="M7 5h18v4H11v5h8v4h-8v5h14v4H7z" fill="#64748b" />
      <path d="M11 14h14l-3 2-3 1-3-1-3 1-2 1 2-2-2-2z" fill="#4ade80" />
    </svg>
  );
}
