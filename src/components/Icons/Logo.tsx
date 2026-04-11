import type { SVGProps } from 'react';

type LogoProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

export default function Logo({ title = 'EdgeWield Eagle Logo', ...props }: LogoProps) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={title} {...props}>
      <title>{title}</title>

      <polygon points="6,35 18,17 34,10 43,16 36,28 18,31" fill="#5A92C0" />
      <polygon points="18,31 36,28 43,16 50,22 44,33 24,41" fill="#4682B4" />
      <polygon points="24,41 44,33 50,22 52,34 42,49 23,53 12,45" fill="#3E709A" />
      <polygon points="12,45 23,53 18,60 4,52" fill="#5A92C0" />
      <polygon points="36,28 44,26 52,34 44,33" fill="#2F5F84" />

      <polygon points="50,29 61,32 49,37 45,32" fill="#39FF14" />
      <polygon points="35,24 39,26 34,29 31,26" fill="#39FF14" />
    </svg>
  );
}
