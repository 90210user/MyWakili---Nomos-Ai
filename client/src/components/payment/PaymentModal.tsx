import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { validatePhoneNumber, formatPhoneNumber } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  name: string;
  price: string;
  amount: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
}

export default function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plan) return;
    
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid M-Pesa registered phone number",
        variant: "destructive"
      });
      return;
    }
    
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    setIsProcessing(true);
    
    try {
      const response = await apiRequest("POST", "/api/payments/mpesa", {
        amount: plan.amount,
        phoneNumber: formattedPhoneNumber,
        planName: plan.name
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "STK Push sent",
          description: "Please check your phone to complete the payment",
        });
        
        // Close modal after successful payment initiation
        onClose();
      } else {
        throw new Error(result.message || "Payment initiation failed");
      }
    } catch (error: any) {
      console.error("Error processing M-Pesa payment:", error);
      toast({
        title: "Payment failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold bg-primary-700 text-white py-4 px-6 -mx-6 -mt-4 rounded-t-lg">
            {t("payment.title")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-2">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">{t("payment.plan")}</span>
              <span className="font-medium">{plan.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("payment.amount")}</span>
              <span className="font-medium">{plan.price}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/320px-M-PESA_LOGO-01.svg.png" 
                  alt="M-Pesa Logo" 
                  className="h-6 mr-2"
                />
                {t("payment.mpesa")}
              </h4>
              
              <form onSubmit={handlePayment}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("payment.phoneNumber")}
                  </label>
                  <Input
                    type="tel"
                    className="w-full border border-gray-300 rounded-lg"
                    placeholder={t("payment.phoneNumberPlaceholder")}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isProcessing}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t("payment.phoneNumberHelp")}
                  </p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? t("common.loading") : t("payment.payButton")}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="text-center">
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-gray-700 text-sm"
              onClick={onClose}
              disabled={isProcessing}
            >
              {t("payment.cancel")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
