import Image from 'next/image';
import { cn } from '@/lib/utils';

const Logo = ({ className }: { className?: string }) => {
  return (
    <Image
      src="https://i.ibb.co/Cxn46LL/Made-with-Flex-Clip-AI-2026-01-28-T091645.png"
      alt="Travelling South Africa Logo"
      width={300}
      height={150}
      className={cn('h-auto w-64', className)}
    />
  );
};

export default Logo;
