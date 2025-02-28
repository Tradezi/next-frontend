import PageContainer from '@/components/layout/page-container';
import { Metadata } from 'next';
import Image from 'next/image';
import FAQSection from '@/components/about/faq-section';

export const metadata: Metadata = {
  title: 'About Tradezi',
  description:
    'Learn about Tradezi - the virtual stock trading platform for beginners'
};

export default function AboutPage() {
  return (
    <PageContainer scrollable={true}>
      <div className="mx-auto max-w-4xl space-y-6 px-4 sm:space-y-8 sm:px-6 md:px-8">
        <div className="mb-2 sm:mb-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            About Tradezi
          </h2>
        </div>

        {/* Our Story Section */}
        <section className="space-y-3 sm:space-y-4">
          <h3 className="mb-2 text-xl font-semibold sm:mb-4 sm:text-2xl">
            Our Story
          </h3>
          <p className="text-sm sm:text-base">
            Tradezi was born in 2021 when three college friends noticed a common
            challenge: many of our peers wanted to learn about stock trading but
            were intimidated by the complexity and risk involved. What started
            as a college project has evolved into a platform dedicated to making
            stock market education accessible to everyone.
          </p>
          <p className="text-sm sm:text-base">
            We set out to solve the steep learning curve of stock market
            investing. Too many beginners were losing money due to inexperience
            or were too afraid to start at all. We believed there was a better
            way—a risk-free environment where anyone could learn the ropes of
            trading before putting real money on the line.
          </p>
        </section>

        {/* Meet the Team Section */}
        <section>
          <h3 className="mb-2 text-xl font-semibold sm:mb-4 sm:text-2xl">
            Meet the Team
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="mx-auto mb-3 h-32 w-32 overflow-hidden rounded-full bg-gray-200 sm:mb-4 sm:h-40 sm:w-40">
                <Image
                  src="https://avatars.githubusercontent.com/u/37625961?v=4"
                  alt="Advait Lonkar"
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
              <h4 className="text-sm font-bold sm:text-base">Advait Lonkar</h4>
              <p className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                Co-founder
              </p>
              <p className="mt-1 text-xs sm:mt-2 sm:text-sm">
                Combining a passion for finance with technical expertise to make
                stock trading accessible to everyone.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="mx-auto mb-3 h-32 w-32 overflow-hidden rounded-full bg-gray-200 sm:mb-4 sm:h-40 sm:w-40">
                <Image
                  src="/Ronak_Doshi.jpg"
                  alt="Ronak Doshi"
                  width={160}
                  height={160}
                  className="object-cover object-bottom"
                />
              </div>
              <h4 className="text-sm font-bold sm:text-base">Ronak Doshi</h4>
              <p className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                Co-founder
              </p>
              <p className="mt-1 text-xs sm:mt-2 sm:text-sm">
                Building the technical foundation that powers Tradezi&apos;s
                realistic virtual trading experience.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center sm:col-span-2 md:col-span-1">
              <div className="mx-auto mb-3 h-32 w-32 overflow-hidden rounded-full bg-gray-200 sm:mb-4 sm:h-40 sm:w-40">
                <Image
                  src="/Arvind_Ramsankar.jpg"
                  alt="Arvind Ramsankar"
                  width={160}
                  height={160}
                  className="object-cover object-bottom"
                />
              </div>
              <h4 className="text-sm font-bold sm:text-base">
                Arvind Ramsankar
              </h4>
              <p className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                Co-founder
              </p>
              <p className="mt-1 text-xs sm:mt-2 sm:text-sm">
                Creating educational content and ensuring Tradezi is intuitive
                for complete beginners.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="space-y-3 sm:space-y-4">
          <h3 className="mb-2 text-xl font-semibold sm:mb-4 sm:text-2xl">
            Our Mission
          </h3>
          <p className="text-sm sm:text-base">
            At Tradezi, we&apos;re on a mission to democratize stock market
            education by providing a risk-free environment where beginners can
            learn, practice, and gain confidence before investing real money.
          </p>
          <p className="text-sm sm:text-base">
            We believe financial literacy should be accessible to everyone,
            regardless of background or experience. Our platform is guided by
            three core principles: education first, learn-by-doing, and
            risk-free experimentation. Success for us means watching our users
            graduate from Tradezi to make informed, confident decisions in the
            real market.
          </p>
        </section>

        {/* How We Work Section */}
        <section className="space-y-3 sm:space-y-4">
          <h3 className="mb-2 text-xl font-semibold sm:mb-4 sm:text-2xl">
            How We Work
          </h3>
          <p className="text-sm sm:text-base">
            Tradezi provides a virtual trading environment that mirrors real
            market conditions using live market data. Users start with simulated
            funds and can build their portfolios, execute trades, and track
            performance—all without risking real money.
          </p>
          <p className="text-sm sm:text-base">
            Beyond the platform itself, we offer educational resources, from
            basic terminology to advanced trading strategies. Our analytics
            tools help users understand their trading patterns, identify
            mistakes, and improve their strategies over time. We&apos;re
            constantly refining our platform based on user feedback to create
            the most effective learning experience possible.
          </p>
        </section>

        {/* What Sets Us Apart Section */}
        <section>
          <h3 className="mb-2 text-xl font-semibold sm:mb-4 sm:text-2xl">
            What Sets Us Apart
          </h3>
          <ul className="list-disc space-y-2 pl-5 text-sm sm:text-base">
            <li>
              <span className="font-medium">Risk-Free Learning:</span> Practice
              with virtual money while experiencing real market conditions and
              live data.
            </li>
            <li>
              <span className="font-medium">Educational Focus:</span> We&apos;re
              not just a simulator—we&apos;re a comprehensive learning platform
              with resources for all levels.
            </li>
            <li>
              <span className="font-medium">Performance Analytics:</span>{' '}
              Detailed insights into your trading patterns help you identify
              strengths and areas for improvement.
            </li>
            <li>
              <span className="font-medium">Community Support:</span> Connect
              with fellow learners to share strategies, tips, and experiences.
            </li>
            <li>
              <span className="font-medium">Beginner-Friendly Interface:</span>{' '}
              Designed specifically for newcomers, with clear explanations and
              intuitive navigation.
            </li>
          </ul>
        </section>

        {/* FAQ Section */}
        <FAQSection />

        {/* Join Our Journey Section */}
        <section className="rounded-lg bg-gray-100 p-4 sm:p-6 dark:bg-gray-800">
          <h3 className="mb-2 text-xl font-semibold text-gray-900 sm:mb-4 sm:text-2xl dark:text-white">
            Join Our Journey
          </h3>
          <p className="mb-4 text-sm text-gray-700 sm:text-base dark:text-gray-300">
            Whether you&apos;re completely new to investing or looking to refine
            your trading strategies, Tradezi is your risk-free gateway to stock
            market confidence. Join thousands of users who are building their
            investing skills one virtual trade at a time.
          </p>
          <div className="mt-4">
            <a
              href="/dashboard"
              className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 sm:px-6 sm:text-base"
            >
              Start Trading Today
            </a>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
