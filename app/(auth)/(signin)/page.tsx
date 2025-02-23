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
    <div className="relative flex min-h-screen flex-col lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative flex h-[50vh] w-full flex-col bg-zinc-900 text-white lg:h-full dark:border-r">
        <div className="relative z-20 flex h-[15vh] w-full items-center justify-center px-4 pt-8 sm:pt-10 lg:h-auto lg:items-start lg:justify-start lg:p-10">
          <div className="flex items-center text-lg font-medium lg:mt-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-8 w-8 sm:h-10 sm:w-10 lg:h-8 lg:w-8"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="text-2xl sm:text-3xl lg:text-3xl">Tradezi</span>
          </div>
        </div>
        <div className="relative z-20 flex flex-1 flex-col lg:items-start lg:justify-center">
          <div className="px-6 pb-8 pt-16 sm:pt-20 lg:px-16 lg:py-0">
            <div className="space-y-4 text-center lg:text-left">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-5xl">
                Learn to Trade, <br />
                Risk-Free
              </h2>
              <p className="text-base text-zinc-300 sm:text-lg lg:text-2xl">
                Master real stock market trading with virtual money.
                <br />
                Experience live market conditions... <br />
                ...without risking your capital.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[50vh] flex-col lg:mt-[140px] lg:flex lg:h-[calc(100vh-140px)]">
        <div className="flex flex-1 items-center px-4 py-12 sm:px-8 sm:py-16 lg:flex lg:items-center lg:justify-center lg:p-12 ">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:max-w-[400px] lg:max-w-[450px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl lg:text-3xl">
                Create an account
              </h1>
            </div>
            <div className="w-full">
              <UserAuthForm />
            </div>
            <p className="px-2 text-center text-xs text-muted-foreground sm:text-sm lg:text-base">
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
    </div>
  );
}
