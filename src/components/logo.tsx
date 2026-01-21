import { cn } from '@/lib/utils';

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('h-auto w-64', className)}>
      <svg
        viewBox="0 0 300 150"
        xmlns="http://www.w3.org/2000/svg"
        aria-labelledby="logoTitle"
      >
        <title id="logoTitle">Travelling South Africa Logo</title>
        {/* Simplified artistic representation, not a real map */}
        <g>
          {/* Main green shape */}
          <path
            d="M50 20 C 100 0, 200 10, 250 40 L 260 90 C 200 110, 100 120, 40 100 Z"
            fill="#27AE60"
          />
          {/* Flag-like stripes */}
          <path
            d="M50 20 C 100 0, 200 10, 250 40"
            fill="none"
            stroke="#0077C8"
            strokeWidth="10"
          />
          <path
            d="M45 60 L 150 75 L 260 90"
            fill="none"
            stroke="#FFBF00"
            strokeWidth="8"
          />
          <path
            d="M45 60 L 120 72"
            fill="none"
            stroke="#E03C31"
            strokeWidth="8"
          />
          <path d="M45 60 L 90 68" fill="none" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M45 60 L 60 64" fill="none" stroke="#000000" strokeWidth="4" />

          {/* Table Mountain silhouette */}
          <path d="M60 90 H 90 L 85 80 L 75 80 L 70 85 Z" fill="#34495E" />

          {/* Sun */}
          <circle cx="220" cy="25" r="10" fill="#F1C40F" />

          {/* Palm Tree */}
          <g transform="translate(190, 80) scale(0.2)">
            <path d="M0,0 V-50" stroke="#795548" strokeWidth="10" />
            <path d="M0-50 C 20 -70, 40 -60, 50 -50" fill="#2ECC71" />
            <path d="M0-50 C -20 -70, -40 -60, -50 -50" fill="#2ECC71" />
            <path d="M0-50 C 0 -80, 20 -90, 30 -70" fill="#2ECC71" />
            <path d="M0-50 C 0 -80, -20 -90, -30 -70" fill="#2ECC71" />
          </g>

          {/* Hills */}
          <path d="M120 100 Q 150 80 180 100 T 240 100" fill="#27AE60" />
        </g>

        {/* Animated Text */}
        <text
          x="50%"
          y="140"
          fontFamily="cursive"
          fontSize="20"
          textAnchor="middle"
          stroke="hsl(var(--primary))"
          strokeWidth="0.5"
          fill="transparent"
          className="logo-text-path"
        >
          travellingsouthafrica.co.za
        </text>
      </svg>
    </div>
  );
};

export default Logo;
