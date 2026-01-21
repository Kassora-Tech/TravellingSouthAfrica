import Image from 'next/image';
import { cn } from '@/lib/utils';

const Logo = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/2026%20Logo%20(1)-Photoroom.png"
      alt="Travelling South Africa Logo"
      width={300}
      height={150}
      className={cn('h-auto w-64', className)}
    />
  );
};

export default Logo;
