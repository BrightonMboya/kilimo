import React from 'react';
import { CalendarDays, Smartphone, Tag, ClipboardList, SlidersHorizontal, MapPin } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div className="p-6 space-y-4">
    <div className="w-12 h-12 rounded-lg bg-lighter flex items-center justify-center">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const FeaturesGrid = () => {
  const features = [
    {
      icon: MapPin,
      title: "Real-Time Compliance Documentation",
      description: "Generate EU-compliant traceability reports within 24 hours as required by Regulation 178/2002"
    },
    {
      icon: Tag,
      title: "End-to-End Supply Chain Visibility ",
      description: `Track every step from farm inputs to final processing, meeting the EU's "one-step-back, one-step-forward" requirement`
    },
    {
      icon: CalendarDays,
      title: "Quality Control & Safety Monitoring",
      description: "Document quality checks, input usage, and critical control points to maintain food safety standards"
    },
    {
      icon: ClipboardList,
      title: "Instant Product History Access",
      description: "QR codes provide immediate access to complete product journey information"
    },
    {
      icon: SlidersHorizontal,
      title: "Team Collaboration",
      description: "Give your entire team real-time access to critical supply chain information"
    },
    {
      icon: Smartphone,
      title: "Easy Mobile Access",
      description: "Access your supply chain data anywhere - perfect for field operations and remote monitoring"
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-primary font-bold lg:text-lg mb-2">Digital Traceability Made Simple</p>
          <h2 className="text-3xl font-bold text-gray-900 max-w-[600px] whitespace-normal "> Here's how JANI helps you maintain
              compliance and build trust:
</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesGrid;