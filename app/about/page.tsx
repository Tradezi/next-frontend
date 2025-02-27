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
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="mb-4">
          <h2 className="text-3xl font-bold tracking-tight">About Tradezi</h2>
        </div>

        {/* Our Story Section */}
        <section>
          <h3 className="mb-4 text-2xl font-semibold">Our Story</h3>
          <p className="mb-4">
            Tradezi was born in 2021 when three college friends noticed a common
            challenge: many of our peers wanted to learn about stock trading but
            were intimidated by the complexity and risk involved. What started
            as a college project has evolved into a platform dedicated to making
            stock market education accessible to everyone.
          </p>
          <p>
            We set out to solve the steep learning curve of stock market
            investing. Too many beginners were losing money due to inexperience
            or were too afraid to start at all. We believed there was a better
            way—a risk-free environment where anyone could learn the ropes of
            trading before putting real money on the line.
          </p>
        </section>

        {/* Meet the Team Section */}
        <section>
          <h3 className="mb-4 text-2xl font-semibold">Meet the Team</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src="https://avatars.githubusercontent.com/u/37625961?v=4"
                  alt="Advait Lonkar"
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
              <h4 className="font-bold">Advait Lonkar</h4>
              <p className="mt-2 text-sm">
                Combining a passion for finance with technical expertise to make
                stock trading accessible to everyone.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src="https://avatars.githubusercontent.com/u/33517942?v=4"
                  alt="Ronak Doshi"
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
              <h4 className="font-bold">Ronak Doshi</h4>
              <p className="mt-2 text-sm">
                Building the technical foundation that powers Tradezi's
                realistic virtual trading experience.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src="https://avatars.githubusercontent.com/u/32129503?v=4"
                  alt="Arvind Ramshankar"
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
              <h4 className="font-bold">Arvind Ramshankar</h4>
              <p className="mt-2 text-sm">
                Creating educational content and ensuring Tradezi is intuitive
                for complete beginners.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section>
          <h3 className="mb-4 text-2xl font-semibold">Our Mission</h3>
          <p className="mb-4">
            At Tradezi, we're on a mission to democratize stock market education
            by providing a risk-free environment where beginners can learn,
            practice, and gain confidence before investing real money.
          </p>
          <p>
            We believe financial literacy should be accessible to everyone,
            regardless of background or experience. Our platform is guided by
            three core principles: education first, learn-by-doing, and
            risk-free experimentation. Success for us means watching our users
            graduate from Tradezi to make informed, confident decisions in the
            real market.
          </p>
        </section>

        {/* How We Work Section */}
        <section>
          <h3 className="mb-4 text-2xl font-semibold">How We Work</h3>
          <p className="mb-4">
            Tradezi provides a virtual trading environment that mirrors real
            market conditions using live market data. Users start with simulated
            funds and can build their portfolios, execute trades, and track
            performance—all without risking real money.
          </p>
          <p>
            Beyond the platform itself, we offer educational resources, from
            basic terminology to advanced trading strategies. Our analytics
            tools help users understand their trading patterns, identify
            mistakes, and improve their strategies over time. We're constantly
            refining our platform based on user feedback to create the most
            effective learning experience possible.
          </p>
        </section>

        {/* What Sets Us Apart Section */}
        <section>
          <h3 className="mb-4 text-2xl font-semibold">What Sets Us Apart</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium">Risk-Free Learning:</span> Practice
              with virtual money while experiencing real market conditions and
              live data.
            </li>
            <li>
              <span className="font-medium">Educational Focus:</span> We're not
              just a simulator—we're a comprehensive learning platform with
              resources for all levels.
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
        <section className="rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
          <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Join Our Journey
          </h3>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Whether you're completely new to investing or looking to refine your
            trading strategies, Tradezi is your risk-free gateway to stock
            market confidence. Join thousands of users who are building their
            investing skills one virtual trade at a time.
          </p>
          <div className="mt-4">
            <a
              href="/register"
              className="inline-block rounded-md bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Start Trading Today
            </a>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
