
import { FileText, Pen } from "lucide-react";

export function ESignaturesHeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#E9DFFF] via-[#F1F5F9] to-white rounded-2xl overflow-hidden shadow-lg mb-12 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 lg:py-20 gap-6 sm:gap-8 md:gap-12 lg:gap-16">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-instrument text-purple-900 leading-tight mb-3 sm:mb-4 drop-shadow">
            E-Signature Requests
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-medium font-instrument text-purple-700 mb-3 sm:mb-4 max-w-lg mx-auto md:mx-0">
            Effortlessly send, sign, and manage important documents in a beautiful, secure environment made with love.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start mt-4 sm:mt-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 sm:px-4 py-2 text-purple-800 font-semibold font-instrument text-xs sm:text-sm shadow hover:bg-purple-200 transition">
              <Pen className="w-3 h-3 sm:w-4 sm:h-4" />
              100% Digital & Safe
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 sm:px-4 py-2 text-blue-800 font-semibold font-instrument text-xs sm:text-sm shadow hover:bg-blue-200 transition">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" /> 
              PDF Only
            </span>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="/lovable-uploads/a7e13ef3-e179-4732-982f-a6f8dcfb9600.png"
            alt="Stylus signing on tablet"
            className="max-h-48 sm:max-h-64 md:max-h-72 lg:max-h-96 w-auto rounded-xl shadow-lg ring-2 ring-white ring-offset-2 sm:ring-offset-4 ring-offset-purple-100 object-cover animate-fade-in"
            loading="lazy"
            decoding="async"
            width={720}
            height={960}
          />
        </div>
      </div>
    </section>
  );
}
