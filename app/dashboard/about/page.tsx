import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our company and mission'
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">About Us</h1>

      <div className="space-y-6">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground">
            We are dedicated to providing innovative solutions that help
            businesses grow and succeed in the digital age.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Our Values</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Excellence in everything we do</li>
            <li>Customer satisfaction is our priority</li>
            <li>Innovation and continuous improvement</li>
            <li>Integrity and transparency</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Our Story</h2>
          <p className="text-muted-foreground">
            Founded with a vision to transform how businesses operate,
            we&apos;ve grown into a trusted partner for organizations seeking to
            optimize their operations and achieve their goals.
          </p>
        </section>
      </div>
    </div>
  );
}
