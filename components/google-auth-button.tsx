'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from './ui/button';
import { Icons } from './icons';

export default function GoogleSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';

  const handleGoogleSignIn = () => {
    const FLASK_BACKEND_URL =
      process.env.NEXT_PUBLIC_FLASK_BACKEND_URL || 'http://localhost:8080';

    // Get the full URL for the callback including the Next.js app domain
    const nextAppCallback = `${window.location.origin}${callbackUrl}`;

    // Include the callbackUrl as a query parameter
    const loginUrl = `${FLASK_BACKEND_URL}/login?callback=${encodeURIComponent(
      nextAppCallback
    )}`;

    window.location.href = loginUrl;
  };

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={handleGoogleSignIn}
    >
      <Icons.google className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
}
