'use client';
import { useState } from 'react';

const FAQItem = ({
  question,
  answer
}: {
  question: string;
  answer: string | JSX.Element;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4 dark:border-gray-700">
      <button
        className="flex w-full items-center justify-between text-left font-medium text-gray-900 dark:text-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <svg
          className={`h-5 w-5 transition-transform ${
            isOpen ? 'rotate-180 transform' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`mt-2 text-gray-600 dark:text-gray-300 ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        {answer}
      </div>
    </div>
  );
};

export default function FAQSection() {
  return (
    <section>
      <h3 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        Frequently Asked Questions
      </h3>
      <div className="space-y-1 border-t border-gray-200 dark:border-gray-700">
        <FAQItem
          question="Is Tradezi completely free to use?"
          answer="Yes, Tradezi is completely free to use. We believe in making financial education accessible to everyone, so our core platform and educational resources are available at no cost."
        />
        <FAQItem
          question="Do I need any prior knowledge to start using Tradezi?"
          answer="Not at all! Tradezi is specifically designed for beginners with no prior trading experience. Our platform includes educational resources that start from the very basics and gradually introduce more advanced concepts."
        />
        <FAQItem
          question="Is the market data on Tradezi real-time?"
          answer="Yes, Tradezi uses real-time market data to provide an authentic trading experience. This allows you to practice trading in conditions that accurately reflect the real stock market."
        />
        <FAQItem
          question="Can I lose real money on Tradezi?"
          answer="No, you cannot lose real money on Tradezi. Our platform uses virtual currency for all transactions, allowing you to learn and practice without any financial risk."
        />
        <FAQItem
          question="How do I track my performance on Tradezi?"
          answer={
            <div>
              <p>
                Tradezi offers comprehensive performance tracking tools
                including:
              </p>
              <ul className="mt-2 list-disc pl-5">
                <li>Portfolio performance charts</li>
                <li>Trade history analysis</li>
                <li>Profit/loss reports</li>
                <li>Risk assessment metrics</li>
              </ul>
              <p className="mt-2">
                These tools help you understand your trading patterns and
                identify areas for improvement.
              </p>
            </div>
          }
        />
        <FAQItem
          question="Can I use Tradezi on my mobile device?"
          answer="Yes, Tradezi is fully responsive and works on smartphones and tablets. You can access all features of our platform on the go, making it convenient to learn and practice trading anytime, anywhere."
        />
        <FAQItem
          question="How do I transition from Tradezi to real trading?"
          answer="When you feel confident in your trading skills on Tradezi, we provide resources and guidance on how to start trading with real money. This includes information on selecting brokers, understanding fees, and managing risk in real-world trading scenarios."
        />
      </div>
    </section>
  );
}
