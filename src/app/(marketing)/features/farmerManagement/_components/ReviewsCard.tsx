import React from 'react';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  content: string;
  author: string;
  subtitle: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ content, author, subtitle }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <p className="text-gray-700 mb-6 leading-relaxed">{content}</p>
    <div>
      <h4 className="font-semibold text-gray-900">{author}</h4>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  </div>
);

export default function Reviews() {
  const reviews = [
    {
      content: "JANI was crucial when the new EU regulations hit. Within weeks, we had our entire tea supply chain digitized and compliant with Regulation 178/2002. Their platform helped us maintain our EU market access without any disruption. What could have been a crisis turned into a smooth transition.",
      author: "Sarah Mwangi",
      subtitle: "Managing 2,000+ smallholder farmers"
    },
    {
      content: "Managing traceability for our coffee exports used to be a paperwork nightmare. JANI simplified everything - from farmer registration to final processing. Now we can instantly show buyers our complete supply chain documentation. It's given us a real competitive advantage in premium markets.",
      author: "James Omondi",
      subtitle: "Exporting coffee to 12 countries"
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-primary text-primary" />
            ))}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Reviews</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Real stories from businesses transforming their supply chain traceability with JANI.

          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>
    </div>
  );
};

