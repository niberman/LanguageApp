interface ProgressRingProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProgressRing({ progress, size = 'md' }: ProgressRingProps) {
  const sizes = {
    sm: { width: 40, strokeWidth: 4 },
    md: { width: 56, strokeWidth: 5 },
    lg: { width: 80, strokeWidth: 6 },
  };

  const { width, strokeWidth } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={width} height={width} className="transform -rotate-90">
      <circle
        cx={width / 2}
        cy={width / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        className="text-muted"
      />
      <circle
        cx={width / 2}
        cy={width / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-primary transition-all duration-500"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="text-xs font-semibold fill-current transform rotate-90"
        style={{ transformOrigin: 'center' }}
      >
        {Math.round(progress)}%
      </text>
    </svg>
  );
}
