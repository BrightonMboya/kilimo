import React from "react";
import { Home, CheckCircle, Download } from "lucide-react";
import Image from "next/image";
import FeaturesGrid from "./_components/KeyFeatures";
import Reviews from "./_components/ReviewsCard";
import Call2Action from "./_components/Call2Action";
import Link from "next/link";

const AssetPageSection = () => {
  const features = [
    "Easy Mobile Access",
    "Team Collaboration",
    "Easy Traceability reports generation",
    "Simple QR Code generation",
  ];

  const whyTraceability = [
    "Real-Time Compliance Documentation",
    "End-to-End Supply Chain Visibility",
    "Quality Control & Safety Monitoring",
    "Instant Product History Access",
  ];

  return (
    <>
      <div className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <div className="inline-block">
            <span className="bg-primary inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-white">
              Digital Traceability Solution
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Food Traceability Compliance Made Simple
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
            JANI helps agricultural businesses track products from farm to
            market, ensure quality compliance, and build trust with buyers.
            Perfect for exporters, processors, and cooperatives.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Link href="https://cal.com/brightonmboya/15min">
              <button className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50">
                Book a demo
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium text-white">
                Get started
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Why JANI ...</h2>
            <p className="text-lg text-gray-600">
              Track your agricultural supply chain with confidence. Our digital
              platform helps you manage farmer records, harvests, and compliance
              documentation in one accessible place.
            </p>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-primary mt-1 h-6 w-6 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="border-primary mt-10 hidden rounded-md border-2 shadow-lg md:block">
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
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div>
            <div className="border-primary mt-10 hidden rounded-md border-2 shadow-lg md:block">
              <img
                src="/static/images/product.png"
                alt="hero"
                className="mx-auto max-w-full rounded-md rounded-t-xl rounded-tr-xl"
              />
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Meet EU Traceability Requirements with Confidence
            </h2>
            <p className="text-lg text-gray-600">
              Our digital platform ensures you comply with EU food safety
              regulations while simplifying your supply chain management. Track
              products from farm to market, generate compliance documentation,
              and build trust with buyers - all in one place.
            </p>
            <ul className="space-y-4">
              {whyTraceability.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-primary mt-1 h-6 w-6 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <FeaturesGrid />
      <Reviews />
      <Call2Action />
    </>
  );
};

export default AssetPageSection;
