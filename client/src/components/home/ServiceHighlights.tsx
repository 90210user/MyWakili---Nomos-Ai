import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { 
  MessageSquare,
  Search,
  Building,
  ArrowRight
} from "lucide-react";

export default function ServiceHighlights() {
  const { t } = useTranslation();

  const services = [
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: t("services.legalAdvice.title"),
      description: t("services.legalAdvice.description"),
      cta: t("services.legalAdvice.cta"),
      href: "#chat",
      iconClass: "bg-primary/10 text-primary",
      linkClass: "text-primary hover:text-primary/80",
    },
    {
      icon: <Search className="h-5 w-5" />,
      title: t("services.legalResearch.title"),
      description: t("services.legalResearch.description"),
      cta: t("services.legalResearch.cta"),
      href: "#research",
      iconClass: "bg-secondary/10 text-secondary",
      linkClass: "text-secondary hover:text-secondary/80",
    },
    {
      icon: <Building className="h-5 w-5" />,
      title: t("services.smeSupport.title"),
      description: t("services.smeSupport.description"),
      cta: t("services.smeSupport.cta"),
      href: "#sme",
      iconClass: "bg-accent/10 text-accent",
      linkClass: "text-accent hover:text-accent/80",
    },
  ];

  return (
    <section className="mb-10">
      <h3 className="font-heading text-xl md:text-2xl font-semibold mb-6 text-foreground">
        {t("services.title")}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
          >
            <div className={`flex items-center justify-center w-12 h-12 ${service.iconClass} rounded-full mb-4`}>
              {service.icon}
            </div>
            <h4 className="font-heading font-semibold text-lg mb-2 text-card-foreground">{service.title}</h4>
            <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
            <Link href={service.href} className={`${service.linkClass} text-sm font-medium flex items-center`}>
              {service.cta} <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
