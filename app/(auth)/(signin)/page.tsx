import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { cookies } from 'next/headers';
import UserAuthForm from '@/components/forms/user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  MotionLogo,
  MotionContainer,
  MotionItem,
  MotionFormContainer,
  MotionHeading,
  MotionForm,
  MotionText,
  MotionScrollIndicator,
  MotionScrollToSection
} from '@/components/animations/motion-wrapper';
import { FeatureCard } from '@/components/cards/feature-card';
import { Footer } from '@/components/layout/footer';
import { Icons } from '@/components/icons';
import { BurgerMenu } from '@/components/layout/burger-menu';

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
    <div className="flex flex-col overflow-auto">
      {/* Navbar with split background */}
      <nav className="z-20">
        {/* Mobile and iPad Navbar - Single row with split background */}
        <div className="fixed flex w-full items-center bg-muted shadow-md lg:hidden">
          {/* Left side - Logo with dark background */}
          <div className="w-3/4 px-4 py-4 text-white">
            <div className="flex items-center text-lg font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-8 w-8"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              <span className="text-2xl">Tradezi</span>
            </div>
          </div>

          {/* Right side - Burger menu with light background */}
          <div className="flex w-1/4 justify-end bg-muted px-4 py-4 text-foreground">
            <BurgerMenu
              items={[
                { label: 'About', href: '/about' }
                // { label: 'Blog', href: '/blog' },
              ]}
            />
          </div>
        </div>

        {/* Desktop Navbar - Hidden on mobile */}
        <div className="hidden items-center lg:flex lg:flex-row">
          {/* Left side of navbar - dark background */}
          <div className="w-1/2 bg-muted px-8 py-4 text-white">
            <div className="container mx-auto flex justify-start px-4">
              {/* Logo */}
              <div className="flex items-center text-lg font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-8 w-8"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                <span className="text-2xl">Tradezi</span>
              </div>
            </div>
          </div>

          {/* Right side of navbar - light background */}
          <div className="w-1/2 bg-background px-8 py-4 text-foreground">
            <div className="container mx-auto flex justify-end px-4">
              {/* Desktop Navigation */}
              <div className="flex items-center space-x-6">
                <Link
                  href="/about"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  About
                </Link>
                {/* <Link
                  href="/blog"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Blog
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Empty div to create space for fixed navbar on mobile */}
      <div className="h-[64px] lg:hidden"></div>

      {/* Main content - Full height */}
      <MotionScrollToSection
        id="main"
        className="relative flex min-h-[calc(100vh-64px)] flex-col pt-0 lg:h-full lg:flex-row"
        skipFirstScroll={true}
      >
        {/* Hero Section */}
        <div className="flex w-full flex-1 items-center bg-muted py-8 text-white md:py-12">
          <MotionContainer className="container mx-auto px-6 md:px-12">
            <div className="mx-auto max-w-3xl space-y-4 md:space-y-6">
              <MotionItem className="text-2xl font-bold tracking-tight text-white md:text-4xl">
                Trade Easy, <br />
                Risk-Free
              </MotionItem>
              <MotionItem className="text-lg text-zinc-300 md:text-2xl">
                Master real stock market trading with virtual money.
                <br />
                Experience live market conditions without risking your capital.
              </MotionItem>
            </div>
          </MotionContainer>
        </div>

        {/* Get Started Section */}
        <div className="flex w-full flex-1 items-center bg-background py-8 md:py-12">
          <MotionFormContainer className="container mx-auto px-6 md:px-12">
            <div className="mx-auto max-w-md">
              <MotionHeading className="mb-6 flex flex-col space-y-2 text-center md:mb-8">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Get Started
                </h1>
              </MotionHeading>
              <MotionForm>
                <UserAuthForm />
              </MotionForm>
              <MotionText className="mt-4 text-center text-sm text-muted-foreground md:mt-6">
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
              </MotionText>
            </div>
          </MotionFormContainer>
        </div>

        {/* Scroll indicator - Using Framer Motion with auto-fade */}
        <MotionScrollIndicator className="fixed bottom-6 right-6 z-10 flex animate-bounce items-center">
          <a
            href="#features"
            className="rounded-full bg-background/80 px-4 py-2 shadow-md backdrop-blur-sm"
          >
            <span className="flex items-center gap-2 text-sm text-foreground">
              Scroll to explore
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </span>
          </a>
        </MotionScrollIndicator>
      </MotionScrollToSection>

      {/* Features Section */}
      <MotionScrollToSection
        id="features"
        className="bg-gradient-to-r from-background  to-muted py-24 md:py-24"
        skipFirstScroll={false}
      >
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Why Choose Tradezi
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              Experience the most comprehensive virtual trading platform with
              real-time market data and powerful tools.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Icons.lineChart className="h-6 w-6" />}
              title="Real Market Data"
              description="Access stock prices, charts, and market indicators just like professional traders."
            />
            <FeatureCard
              icon={<Icons.wallet className="h-6 w-6" />}
              title="Virtual Portfolio"
              description="Start with virtual cash and build your portfolio without risking real money."
            />
            <FeatureCard
              icon={<Icons.bookOpen className="h-6 w-6" />}
              title="Educational Resources"
              description="Learn trading strategies and market concepts through our comprehensive guides."
            />
          </div>
        </div>
      </MotionScrollToSection>

      {/* Footer */}
      <Footer />
    </div>
  );
}
