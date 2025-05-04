import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onChatClick: () => void;
  onLearnMoreClick: () => void;
}

export default function HeroSection({ onChatClick, onLearnMoreClick }: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 md:p-10 mb-10 text-primary-foreground">
      <div className="max-w-3xl">
        <h2 className="font-heading text-2xl md:text-4xl font-bold mb-4">
          {t("hero.title")}
        </h2>
        <p className="text-primary-foreground/80 mb-6 text-base md:text-lg">
          {t("hero.subtitle")}
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <Button
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3"
            onClick={onChatClick}
          >
            {t("hero.askLegalQuestion")}
          </Button>
          <Button
            variant="outline"
            className="bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground border border-primary-foreground/20 px-6 py-3"
            onClick={onLearnMoreClick}
          >
            {t("hero.learnMore")}
          </Button>
        </div>
      </div>
    </section>
  );
}
