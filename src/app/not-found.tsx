import Link from 'next/link';
import { Translatable } from '@/components/translatable';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <FileQuestion className="mx-auto h-24 w-24 text-primary" />
        <h1 className="mt-8 text-4xl font-bold font-headline">
          <Translatable text="404 - Page Not Found" />
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          <Translatable text="Oops! The page you are looking for does not exist. It might have been moved or deleted." />
        </p>
        <Button asChild className="mt-8">
          <Link href="/">
            <Translatable text="Go Back to Homepage" />
          </Link>
        </Button>
        <div className="mt-8">
            <p className="text-sm text-muted-foreground mb-4">
              <Translatable text="Here are some helpful links instead:" />
            </p>
            <div className="flex justify-center gap-4">
                <Button variant="outline" asChild>
                    <Link href="/provinces">
                        <Translatable text="Provinces" />
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/towns">
                        <Translatable text="Towns" />
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/sights">
                        <Translatable text="Sights" />
                    </Link>
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
