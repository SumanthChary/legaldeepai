import { Link } from "react-router-dom";
export const BrandLogo = () => {
  return <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
      <div className="relative">
        <img
          alt="LegalDeep AI"
          className="h-6 w-6 sm:h-8 sm:w-8 object-contain rounded-lg"
          src="/lovable-uploads/dd1d70eb-890d-405e-af4a-dab180dc4bf5.png"
          loading="eager"
          decoding="async"
          width={806}
          height={806}
        />
      </div>
      <span className="text-lg sm:text-xl font-normal font-editorial bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        LegalDeep AI
      </span>
    </Link>;
};