
import React from "react";

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ElementType;
  image?: string;
  details: string[];
}

interface MainFeaturesProps {
  features: FeatureProps[];
}

export const MainFeatures = ({ features }: MainFeaturesProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
      {features.map((feature) => (
        <div 
          key={feature.title}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group"
        >
          {feature.image && (
            <div className="mb-6 overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-4">
              <img 
                src={feature.image} 
                alt={feature.title}
                className="w-full h-32 object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="flex items-center mb-4">
            <feature.icon className="h-8 w-8 text-blue-500 mr-3 group-hover:text-blue-600 transition-colors" />
            <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
          </div>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{feature.description}</p>
          <ul className="space-y-2">
            {feature.details.map((detail) => (
              <li key={detail} className="text-gray-600 flex items-start text-sm">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
