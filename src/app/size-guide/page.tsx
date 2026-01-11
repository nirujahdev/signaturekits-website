import { Metadata } from 'next';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { SizeHelper } from '@/components/SizeHelper';
import { generatePageMetadata } from '@/lib/generate-metadata';
import { SEO_CONFIG } from '@/lib/seo-config';
import Image from 'next/image';

export const metadata: Metadata = generatePageMetadata({
  title: 'Jersey Size Guide Sri Lanka | How to Choose the Right Size – Signature Kits',
  description: 'Find your perfect jersey size with our size guide. Measure your chest correctly and use our size calculator for kids and adults. Available sizes S to 3XL.',
  path: '/size-guide',
});

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-12 max-w-4xl pt-24 md:pt-28">
        <h1 className="text-4xl font-semibold mb-4">
          Jersey Size Guide
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Use our size calculator and chart to find your perfect fit. Measure your chest for best accuracy.
        </p>

        {/* Size Helper Component */}
        <SizeHelper mode="auto" />

        {/* How to Measure Section */}
        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">How to Measure</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700">
              For the most accurate size, measure your chest at the fullest part while standing straight. 
              Keep the measuring tape level and snug, but not tight. Use these measurements to compare 
              with our size chart above.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Stand straight with arms at your sides</li>
              <li>Wrap the tape around the fullest part of your chest (usually at nipple level)</li>
              <li>Keep the tape parallel to the ground</li>
              <li>Make sure the tape is snug but not compressing your chest</li>
              <li>Take the measurement in inches or centimeters</li>
            </ul>
          </div>
        </section>

        {/* Size Chart Image (if available) */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Visual Size Chart</h2>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-4">
              Size chart image would be displayed here. Alt text: &quot;Jersey size chart showing chest and length measurements and sizes S to 3XL&quot;
            </p>
            {/* Uncomment when you have the actual image */}
            {/* <Image
              src="/assets/size-chart.png"
              alt="Jersey size chart showing chest and length measurements and sizes S to 3XL"
              width={800}
              height={600}
              className="mx-auto"
            /> */}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
