'use client';

import { Button } from './ui/button';
import { Icons } from './icons';

export default function GoogleSignInButton() {
  const handleGoogleSignIn = () => {
    const FLASK_BACKEND_URL =
      process.env.NEXT_PUBLIC_FLASK_BACKEND_URL ||
      'https://backend.tradezi.co.in';

    // Redirect to Flask backend's login endpoint
    window.location.href = `${FLASK_BACKEND_URL}/login`;
  };

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={handleGoogleSignIn}
      data-umami-event="google-sign-in"
    >
      <Icons.google className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
}
