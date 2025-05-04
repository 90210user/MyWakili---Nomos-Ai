import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  generateContract, 
  checkBusinessCompliance 
} from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";

export default function SMETools() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [contractType, setContractType] = useState("");
  const [businessIndustry, setBusinessIndustry] = useState("");
  const [isGeneratingContract, setIsGeneratingContract] = useState(false);
  const [isCheckingCompliance, setIsCheckingCompliance] = useState(false);

  const handleGenerateContract = async () => {
    if (!contractType) {
      toast({
        title: "Selection required",
        description: "Please select a contract type",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingContract(true);
    
    try {
      // In a real implementation, this would open a form to gather more details
      // For now, we'll just show a success message
      toast({
        title: "Contract generator",
        description: `Opening ${contractType} contract generator form`,
      });
      
      // Example of how the actual API call would work:
      // const contract = await generateContract({
      //   contractType: contractType,
      //   details: { /* form data would go here */ },
      //   language: i18n.language
      // });
      
    } catch (error) {
      console.error("Error generating contract:", error);
      toast({
        title: t("common.error"),
        description: "Failed to generate contract",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingContract(false);
    }
  };

  const handleCheckCompliance = async () => {
    if (!businessIndustry) {
      toast({
        title: "Selection required",
        description: "Please select your business industry",
        variant: "destructive"
      });
      return;
    }

    setIsCheckingCompliance(true);
    
    try {
      // In a real implementation, this would open a form to gather more details
      // For now, we'll just show a success message
      toast({
        title: "Compliance checker",
        description: `Opening compliance checker for ${businessIndustry} industry`,
      });
      
      // Example of how the actual API call would work:
      // const complianceResults = await checkBusinessCompliance({
      //   industry: businessIndustry,
      //   businessDetails: { /* form data would go here */ },
      //   language: i18n.language
      // });
      
    } catch (error) {
      console.error("Error checking compliance:", error);
      toast({
        title: t("common.error"),
        description: "Failed to check compliance",
        variant: "destructive"
      });
    } finally {
      setIsCheckingCompliance(false);
    }
  };

  return (
    <section id="sme" className="mb-10">
      <h3 className="font-heading text-xl md:text-2xl font-semibold mb-6 text-foreground">
        {t("sme.title")}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contract Generator */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mr-3">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="font-heading font-medium text-lg text-card-foreground">
              {t("sme.contractGenerator.title")}
            </h4>
          </div>
          
          <p className="text-muted-foreground text-sm mb-4">
            {t("sme.contractGenerator.description")}
          </p>
          
          <div className="mb-5">
            <label className="block text-sm font-medium text-foreground mb-1">
              {t("sme.contractGenerator.contractType")}
            </label>
            <Select
              value={contractType}
              onValueChange={setContractType}
              disabled={isGeneratingContract}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("sme.contractGenerator.selectType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employment">{t("sme.contractGenerator.employment")}</SelectItem>
                <SelectItem value="service">{t("sme.contractGenerator.service")}</SelectItem>
                <SelectItem value="nda">{t("sme.contractGenerator.nda")}</SelectItem>
                <SelectItem value="lease">{t("sme.contractGenerator.lease")}</SelectItem>
                <SelectItem value="sale">{t("sme.contractGenerator.sale")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={handleGenerateContract}
            disabled={isGeneratingContract}
          >
            {isGeneratingContract ? t("common.loading") : t("sme.contractGenerator.generateButton")}
          </Button>
        </div>
        
        {/* Compliance Checker */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mr-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="font-heading font-medium text-lg text-card-foreground">
              {t("sme.complianceChecker.title")}
            </h4>
          </div>
          
          <p className="text-muted-foreground text-sm mb-4">
            {t("sme.complianceChecker.description")}
          </p>
          
          <div className="mb-5">
            <label className="block text-sm font-medium text-foreground mb-1">
              {t("sme.complianceChecker.industryLabel")}
            </label>
            <Select
              value={businessIndustry}
              onValueChange={setBusinessIndustry}
              disabled={isCheckingCompliance}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("sme.complianceChecker.selectIndustry")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retail">{t("sme.complianceChecker.retail")}</SelectItem>
                <SelectItem value="food">{t("sme.complianceChecker.food")}</SelectItem>
                <SelectItem value="tech">{t("sme.complianceChecker.tech")}</SelectItem>
                <SelectItem value="transport">{t("sme.complianceChecker.transport")}</SelectItem>
                <SelectItem value="construction">{t("sme.complianceChecker.construction")}</SelectItem>
                <SelectItem value="agriculture">{t("sme.complianceChecker.agriculture")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            onClick={handleCheckCompliance}
            disabled={isCheckingCompliance}
          >
            {isCheckingCompliance ? t("common.loading") : t("sme.complianceChecker.checkButton")}
          </Button>
        </div>
      </div>
    </section>
  );
}
