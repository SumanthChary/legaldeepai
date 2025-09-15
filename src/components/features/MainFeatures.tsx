
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-16">
      {features.map((feature) => (
        <div 
          key={feature.title}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group"
        >
          {feature.image && (
            <div className="mb-4 sm:mb-6 overflow-hidden rounded-lg p-2 sm:p-3">
              <img 
                src={feature.image} 
                alt={feature.title}
                className="w-full h-24 sm:h-32 md:h-36 object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="flex items-start sm:items-center mb-3 sm:mb-4">
            <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mr-2 sm:mr-3 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1 sm:mt-0" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">{feature.title}</h3>
          </div>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm leading-relaxed">{feature.description}</p>
          <ul className="space-y-1.5 sm:space-y-2">
            {feature.details.map((detail) => (
              <li key={detail} className="text-gray-600 flex items-start text-xs sm:text-sm">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-1.5 sm:mt-2 flex-shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
