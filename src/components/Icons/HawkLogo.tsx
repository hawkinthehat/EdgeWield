import type { SVGProps } from 'react';

type HawkLogoProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

export default function HawkLogo({
  title = 'Geometric Hawk icon',
  className = 'h-10 w-10',
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
      <polygon points="8,36 24,14 40,20 30,38 16,42" className="fill-slate-950 stroke-slate-400" strokeWidth="1.2" />
      <polygon points="30,38 40,20 54,26 46,42 32,46" className="fill-slate-900 stroke-slate-400" strokeWidth="1.2" />
      <polygon points="16,42 30,38 32,46 20,54 10,48" className="fill-slate-900 stroke-slate-400" strokeWidth="1.2" />
      <polygon points="32,46 46,42 56,52 36,58 20,54" className="fill-slate-950 stroke-slate-400" strokeWidth="1.2" />
      <polygon points="46,33 61,36 47,43 42,38" className="fill-lime-400 stroke-slate-400" strokeWidth="1.1" />
      <circle cx="35" cy="30" r="2.1" className="fill-lime-400" />
    </svg>
  );
}
