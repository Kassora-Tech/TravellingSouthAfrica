import { Translatable } from '@/components/translatable';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline text-primary">
        <Translatable text="Privacy Policy" />
      </h1>
      <p className="mt-4 text-muted-foreground">
        <Translatable text="Your privacy is important to us. This is a placeholder for the privacy policy." />
      </p>
    </div>
  );
}
