import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: Array<{ href: string; label: string }>;
  onOpenAuth: () => void;
}

export default function MobileMenu({ 
  isOpen, 
  onClose, 
  navItems, 
  onOpenAuth 
}: MobileMenuProps) {
  const { t } = useTranslation();
  
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex flex-col space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:text-primary-600 py-2 text-sm font-medium"
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex flex-col space-y-3 mt-4 border-t pt-4">
          <LanguageToggle />
          
          <Button
            className="bg-primary-700 hover:bg-primary-800 text-white w-full"
            onClick={onOpenAuth}
          >
            {t("navigation.signIn")}
          </Button>
        </div>
      </div>
    </div>
  );
}
