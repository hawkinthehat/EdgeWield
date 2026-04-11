import type { SVGProps } from 'react';

type HawkLogoProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

export default function HawkLogo({ title = 'Geometric Hawk icon', ...props }: HawkLogoProps) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={title} {...props}>
      <title>{title}</title>
      <polygon points="8,34 24,14 38,18 30,34 16,38" fill="#334155" />
      <polygon points="30,34 38,18 52,24 44,40 30,44" fill="#4682B4" />
      <polygon points="16,38 30,34 30,44 20,52 10,46" fill="#1E293B" />
      <polygon points="30,44 44,40 54,50 36,56 20,52" fill="#0F172A" />
      <polygon points="45,33 60,36 46,43 41,38" fill="#39FF14" />
      <circle cx="34.5" cy="29.5" r="2" fill="#39FF14" />
    </svg>
  );
}
