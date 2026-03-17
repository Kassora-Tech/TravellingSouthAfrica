import Image from 'next/image';
import { cn } from '@/lib/utils';

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className="logo-container">
      <Image
        src="https://i.ibb.co/0prkKCw3/2026-Logo-1-Photoroom.png"
        alt="Travelling South Africa Logo"
        width={300}
        height={150}
        className={cn('h-auto w-64', className)}
      />
    </div>
  );
};

export default Logo;
