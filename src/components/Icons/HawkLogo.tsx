import type { SVGProps } from 'react';

type HawkLogoProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

export default function HawkLogo({
  title = 'Geometric Hawk icon',
  className = 'h-8 w-8',
  ...props
}: HawkLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      width={64}
      height={64}
      className={className}
      {...props}
    >
      <title>{title}</title>
      <polygon points="8,36 24,14 40,20 30,38 16,42" fill="#374151" />
      <polygon points="30,38 40,20 54,26 46,42 32,46" fill="#4B5563" />
      <polygon points="16,42 30,38 32,46 20,54 10,48" fill="#1F2937" />
      <polygon points="32,46 46,42 56,52 36,58 20,54" fill="#111827" />
      <polygon points="46,33 61,36 47,43 42,38" fill="#39FF14" />
      <circle cx="35" cy="30" r="2.1" fill="#39FF14" />
    </svg>
  );
}
