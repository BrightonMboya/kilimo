import React from 'react';
import { PenLine, Box, UserCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';


interface StepCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ icon: Icon, title, description }) => (
  <div className="text-center space-y-4">
    <div className="w-12 h-12 bg-lighter rounded-full mx-auto flex items-center justify-center">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default function Call2Action(){
  const steps = [
    {
      icon: PenLine,
      title: "Complete Traceability Records",
      description: "Track every touchpoint from farm inputs to final processing, meeting EU Regulation 178/2002 requirements for end-to-end traceability."
    },
    {
      icon: Box,
      title: "Real-Time Documentation",
      description: "Generate instant compliance reports with detailed records of farmers, harvests, and supply chain movements. Perfect for audits and buyer verification."
    },
    {
      icon: UserCircle,
      title: "Quality Control Tracking",
      description: "Monitor and document quality checks, input usage, and processing steps to ensure compliance with food safety standards and buyer specifications."
    },
    {
      icon: ArrowRight,
      title: "Build Buyer Confidence",
      description: "Give your buyers verified proof of origin, processing methods, and quality standards - opening doors to premium markets that demand transparency."
    }
  ];

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
           Complete traceability, ready when you are
          </h2>
          <p className="text-xl text-gray-600">
            Available to agricultural businesses of all sizes, with flexible plans to fit your needs.

          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} />
          ))}
        </div>


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
  );
};

