import React from "react";
import { PenLine, Box, UserCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface StepCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="space-y-4 text-center">
    <div className="bg-lighter mx-auto flex h-12 w-12 items-center justify-center rounded-full">
      <Icon className="text-primary h-6 w-6" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    <p className="leading-relaxed text-gray-600">{description}</p>
  </div>
);

export default function Call2Action() {
  const steps = [
    {
      icon: PenLine,
      title: "Complete Traceability Records",
      description:
        "Track every touchpoint from farm inputs to final processing, meeting EU Regulation 178/2002 requirements for end-to-end traceability.",
    },
    {
      icon: Box,
      title: "Real-Time Documentation",
      description:
        "Generate instant compliance reports with detailed records of farmers, harvests, and supply chain movements. Perfect for audits and buyer verification.",
    },
    {
      icon: UserCircle,
      title: "Quality Control Tracking",
      description:
        "Monitor and document quality checks, input usage, and processing steps to ensure compliance with food safety standards and buyer specifications.",
    },
    {
      icon: ArrowRight,
      title: "Build Buyer Confidence",
      description:
        "Give your buyers verified proof of origin, processing methods, and quality standards - opening doors to premium markets that demand transparency.",
    },
  ];

  return (
    <div className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Complete traceability, ready when you are
          </h2>
          <p className="text-xl text-gray-600">
            Available to agricultural businesses of all sizes, with flexible
            plans to fit your needs.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mb-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} />
          ))}
        </div>

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
  );
}
