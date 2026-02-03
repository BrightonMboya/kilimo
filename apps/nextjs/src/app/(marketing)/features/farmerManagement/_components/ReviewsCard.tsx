import React from "react";
import { Star } from "lucide-react";

interface ReviewCardProps {
  content: string;
  author: string;
  subtitle: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  content,
  author,
  subtitle,
}) => (
  <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
    <p className="mb-6 leading-relaxed text-gray-700">{content}</p>
    <div>
      <h4 className="font-semibold text-gray-900">{author}</h4>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  </div>
);

export default function Reviews() {
  const reviews = [
    {
      content:
        "JANI was crucial when the new EU regulations hit. Within weeks, we had our entire tea supply chain digitized and compliant with Regulation 178/2002. Their platform helped us maintain our EU market access without any disruption. What could have been a crisis turned into a smooth transition.",
      author: "Sarah Mwangi",
      subtitle: "Managing 2,000+ smallholder farmers",
    },
    {
      content:
        "Managing traceability for our coffee exports used to be a paperwork nightmare. JANI simplified everything - from farmer registration to final processing. Now we can instantly show buyers our complete supply chain documentation. It's given us a real competitive advantage in premium markets.",
      author: "James Omondi",
      subtitle: "Exporting coffee to 12 countries",
    },
  ];

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <div className="mb-4 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="fill-primary text-primary h-6 w-6" />
            ))}
          </div>

          <h2 className="mb-4 text-3xl font-bold text-gray-900">Reviews</h2>
          <p className="text-xl leading-relaxed text-gray-600">
            Real stories from businesses transforming their supply chain
            traceability with JANI.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>
    </div>
  );
}
