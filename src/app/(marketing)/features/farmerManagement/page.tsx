import React from 'react';
import { Home, CheckCircle, Download } from 'lucide-react';
import Image from 'next/image';
import FeaturesGrid from './_components/KeyFeatures';
import Reviews from './_components/ReviewsCard';
import Call2Action from './_components/Call2Action';
import Link from 'next/link';

const AssetPageSection = () => {
  const features = [
    "Easy Mobile Access",
    "Team Collaboration",
    "Easy Traceability reports generation",
    "Simple QR Code generation"
  ];

  const whyTraceability = [
    "Real-Time Compliance Documentation",
    "End-to-End Supply Chain Visibility",
    "Quality Control & Safety Monitoring",
    "Instant Product History Access"
  ]


  return (
    <>
     <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-block">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary text-white font-medium">
            Digital Traceability Solution
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
         Food Traceability Compliance Made Simple
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
        JANI helps agricultural businesses track products from farm to market, ensure quality compliance, 
        and build trust with buyers. Perfect for exporters, processors, and cooperatives.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="https://cal.com/brightonmboya/15min" >
            
          <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium">
            Book a demo
          </button>
            </Link>
          <Link href="/register">
          
          <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 font-medium">
            Get started
          </button>
          </Link>
        </div>
      </div>
    </div>
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Why JANI ...</h2>
          <p className="text-gray-600 text-lg">
                        Track your agricultural supply chain with confidence. 
                        Our digital platform helps you manage farmer records, harvests, 
                        and compliance documentation in one accessible place.

          </p>
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

      <div>
        <div className="mt-10 hidden rounded-md border-2 border-primary shadow-lg md:block">
                    <img
                      src="/static/images/product.png"
                      alt="hero"
                      className="mx-auto max-w-full rounded-md rounded-t-xl rounded-tr-xl"
                    />
                  </div>
      </div>
      </div>
    </div>
      <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
        <div className="mt-10 hidden rounded-md border-2 border-primary shadow-lg md:block">
                    <img
                      src="/static/images/product.png"
                      alt="hero"
                      className="mx-auto max-w-full rounded-md rounded-t-xl rounded-tr-xl"
                    />
  
                  </div>
      </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Meet EU Traceability Requirements with Confidence</h2>
          <p className="text-gray-600 text-lg">
Our digital platform ensures you comply with EU food safety regulations while simplifying your supply chain management.
 Track products from farm to market, generate compliance documentation, and build trust with buyers - all in one place.

          </p>
          <ul className="space-y-4">
            {whyTraceability.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

      
      </div>
    </div>
    <FeaturesGrid/>
    <Reviews/>
    <Call2Action/>
    </>
  );
};

export default AssetPageSection;