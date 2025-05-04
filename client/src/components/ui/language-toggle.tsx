import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";

interface LanguageToggleProps {
  variant?: "header" | "footer";
}

export function LanguageToggle({ variant = "header" }: LanguageToggleProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "sw", name: "Kiswahili" },
  ];

  const currentLanguage = languages.find(
    (lang) => lang.code === i18n.language
  ) || languages[0];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === "footer" ? "secondary" : "outline"}
          className={
            variant === "footer"
              ? "bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }
          size="sm"
        >
          <Globe className="h-4 w-4 mr-1" />
          <span>{currentLanguage.name}</span>
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={lang.code === i18n.language ? "bg-gray-100" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
