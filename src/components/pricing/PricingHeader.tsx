
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

interface PricingHeaderProps {
  onRedeemClick: () => void;
}

export const PricingHeader = ({ onRedeemClick }: PricingHeaderProps) => {
  return (
    <div className="text-center mb-8 md:mb-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
        Start with 3 Free Documents - 40% OFF!
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 mb-4 md:mb-6">
        Try our analyzer free, then save 40% on all paid plans. Limited time offer!
      </p>
      <Button 
        onClick={onRedeemClick}
        variant="outline"
        size="lg"
        className="flex items-center mx-auto text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
      >
        <Ticket className="mr-2 h-4 w-4" />
        Redeem Lifetime Deal ($299)
      </Button>
    </div>
  );
};
