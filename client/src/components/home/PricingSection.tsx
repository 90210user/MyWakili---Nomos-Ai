import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentModal from "../payment/PaymentModal";

interface PricingPlan {
  label: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  disabledFeatures?: string[];
  buttonText: string;
  amount: number;
  buttonVariant: "outline" | "primary" | "accent";
  mostPopular?: boolean;
}

export default function PricingSection() {
  const { t } = useTranslation();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  const plans: PricingPlan[] = [
    {
      label: t("pricing.free.label"),
      name: t("pricing.free.name"),
      price: t("pricing.free.price"),
      period: t("pricing.free.period"),
      features: t("pricing.free.features", { returnObjects: true }),
      disabledFeatures: t("pricing.free.disabledFeatures", { returnObjects: true }),
      buttonText: t("pricing.free.button"),
      amount: 0,
      buttonVariant: "outline",
    },
    {
      label: t("pricing.standard.label"),
      name: t("pricing.standard.name"),
      price: t("pricing.standard.price"),
      period: t("pricing.standard.period"),
      features: t("pricing.standard.features", { returnObjects: true }),
      disabledFeatures: t("pricing.standard.disabledFeatures", { returnObjects: true }),
      buttonText: t("pricing.standard.button"),
      amount: 2999,
      buttonVariant: "primary",
      mostPopular: true,
    },
    {
      label: t("pricing.business.label"),
      name: t("pricing.business.name"),
      price: t("pricing.business.price"),
      period: t("pricing.business.period"),
      features: t("pricing.business.features", { returnObjects: true }),
      buttonText: t("pricing.business.button"),
      amount: 9999,
      buttonVariant: "accent",
    },
  ];

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    
    if (plan.amount > 0) {
      setIsPaymentModalOpen(true);
    } else {
      // Handle free plan selection
      // This could navigate to a registration page or show a welcome message
      console.log("Free plan selected");
    }
  };

  return (
    <>
      <section id="pricing" className="mb-10">
        <h3 className="font-heading text-xl md:text-2xl font-semibold mb-6 text-gray-800">
          {t("pricing.title")}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`bg-white rounded-lg shadow-sm border ${
                plan.mostPopular ? "border-primary-200" : "border-gray-100"
              } p-6 hover:shadow-md transition-shadow relative`}
            >
              {plan.mostPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-700 text-white text-xs py-1 px-3 rounded-full">
                  {t("pricing.standard.mostPopular")}
                </div>
              )}
              
              <div className="mb-4">
                <span className={`${
                  plan.label === "Free" ? "bg-gray-100 text-gray-700" :
                  plan.label === "Standard" ? "bg-primary-100 text-primary-700" :
                  "bg-accent-100 text-accent-500"
                } text-xs py-1 px-2 rounded-full`}>
                  {plan.label}
                </span>
              </div>
              
              <h4 className="font-heading font-semibold text-xl mb-2">{plan.name}</h4>
              <div className="flex items-baseline mb-4">
                <span className="text-2xl font-bold">{plan.price}</span>
                <span className="text-gray-500 ml-1">{plan.period}</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
                
                {plan.disabledFeatures?.map((feature, featureIndex) => (
                  <li key={`disabled-${featureIndex}`} className="flex items-start text-gray-400">
                    <X className="h-4 w-4 mt-0.5 mr-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full ${
                  plan.buttonVariant === "outline" 
                    ? "border border-primary-600 text-primary-600 hover:bg-primary-50" 
                    : plan.buttonVariant === "primary"
                    ? "bg-primary-700 hover:bg-primary-800 text-white"
                    : "bg-accent-500 hover:bg-accent-600 text-white"
                }`}
                variant={plan.buttonVariant === "outline" ? "outline" : "default"}
                onClick={() => handleSelectPlan(plan)}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </section>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPlan}
      />
    </>
  );
}
