import { cn } from '@/lib/utils';

export function AnimatedTagline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 50"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-auto', className)}
    >
      <text x="50%" y="50%" dy=".35em" textAnchor="middle" className="logo-text-path">
        travellingsouthafrica.co.za
      </text>
    </svg>
  );
}
