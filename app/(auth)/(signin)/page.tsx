import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { cookies } from 'next/headers';
import UserAuthForm from '@/components/forms/user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Sign In | Tradezi',
  description: 'Authentication for Tradezi.'
};

async function getUser() {
  try {
    // First check cookie
    const cookieStore = cookies();
    const userCookie = cookieStore.get('user');

    if (userCookie) {
      return JSON.parse(userCookie.value);
    }

    // If no cookie, check API
    const { data } = await axios.get('/api/user/details', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return data;
  } catch (error) {
    return null;
  }
}

export default async function AuthenticationPage() {
  const user = await getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="relative flex min-h-screen flex-col md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative flex h-[15vh] w-full flex-col bg-muted text-white md:h-full dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex h-[15vh] w-full items-center justify-center px-4 md:items-start md:justify-start md:p-10">
          <div className="flex items-center text-lg font-medium md:mt-8 lg:mt-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-5 w-5 sm:h-6 sm:w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="text-base sm:text-lg md:text-xl">Tradezi</span>
          </div>
        </div>
        <div className="relative z-20 mt-auto hidden px-6 pb-6 sm:px-8 sm:pb-8 lg:block lg:px-10 lg:pb-10">
          <blockquote className="space-y-2">
            <p className="text-base sm:text-lg">
              {/* &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo; */}
            </p>
            {/* <footer className="text-sm">Sofia Davis</footer> */}
          </blockquote>
        </div>
      </div>
      <div className="flex flex-1 items-center px-4 py-6 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
              Create an account
            </h1>
            {/* <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p> */}
          </div>
          <div className="w-full">
            <UserAuthForm />
          </div>
          <p className="px-2 text-center text-xs text-muted-foreground sm:px-4 sm:text-sm">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 transition-colors hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
