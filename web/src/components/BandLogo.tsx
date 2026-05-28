export function BandLogo({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="합주 매니저 로고"
    >
      {/* Beam connecting two note stems */}
      <path d="M11 13.5L30 8.5V13L11 18V13.5Z" fill="#7C3AED" />
      {/* Left stem */}
      <rect x="10" y="13" width="2.5" height="14" rx="1.25" fill="#7C3AED" />
      {/* Right stem */}
      <rect x="28" y="8" width="2.5" height="14" rx="1.25" fill="#7C3AED" />
      {/* Left note head */}
      <ellipse
        cx="8.5"
        cy="27"
        rx="5.5"
        ry="3.5"
        transform="rotate(-15 8.5 27)"
        fill="#7C3AED"
      />
      {/* Right note head */}
      <ellipse
        cx="27"
        cy="22"
        rx="5.5"
        ry="3.5"
        transform="rotate(-15 27 22)"
        fill="#7C3AED"
      />
    </svg>
  );
}
