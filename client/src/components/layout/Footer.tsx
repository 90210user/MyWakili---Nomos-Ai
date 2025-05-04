import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  const serviceLinks = [
    { href: "#", label: t("footer.serviceLinks.legalAdvice") },
    { href: "#", label: t("footer.serviceLinks.legalResearch") },
    { href: "#", label: t("footer.serviceLinks.smeSupport") },
    { href: "#", label: t("footer.serviceLinks.documentGeneration") },
    { href: "#", label: t("footer.serviceLinks.complianceChecks") },
  ];

  const companyLinks = [
    { href: "#", label: t("footer.companyLinks.about") },
    { href: "#", label: t("footer.companyLinks.team") },
    { href: "#", label: t("footer.companyLinks.careers") },
    { href: "#", label: t("footer.companyLinks.blog") },
    { href: "#", label: t("footer.companyLinks.contact") },
  ];

  const legalLinks = [
    { href: "#", label: t("footer.legalLinks.terms") },
    { href: "#", label: t("footer.legalLinks.privacy") },
    { href: "#", label: t("footer.legalLinks.cookie") },
    { href: "#", label: t("footer.legalLinks.disclaimer") },
  ];

  return (
    <footer className="bg-muted text-muted-foreground py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <i className="ri-scales-3-line text-accent text-2xl mr-2"></i>
              <h3 className="text-xl font-heading font-bold text-foreground">
                {t("common.appName")}
              </h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Democratizing access to legal services through AI technology. Available in English and Kiswahili.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-medium text-lg mb-4 text-foreground">
              {t("footer.services")}
            </h4>
            <ul className="space-y-2">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-medium text-lg mb-4 text-foreground">
              {t("footer.company")}
            </h4>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-medium text-lg mb-4 text-foreground">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">{t("footer.rights")}</p>
          <div className="mt-4 md:mt-0">
            <LanguageToggle variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
