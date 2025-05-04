import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";
import MobileMenu from "./MobileMenu";
import AuthDialog from "../auth/AuthDialog";
import { Menu } from "lucide-react";

export default function Header() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const navItems = [
    { href: "/", label: t("navigation.home") },
    { href: "#legal-advice", label: t("navigation.legalAdvice") },
    { href: "#research", label: t("navigation.research") },
    { href: "#sme-support", label: t("navigation.smeSupport") },
    { href: "#pricing", label: t("navigation.pricing") },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const openAuthDialog = () => {
    setAuthDialogOpen(true);
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <i className="ri-scales-3-line text-primary-700 text-2xl mr-2"></i>
                <h1 className="text-xl font-heading font-bold text-primary-700">
                  {t("common.appName")}
                </h1>
              </div>
            </div>

            {!isMobile && (
              <div className="flex items-center space-x-6">
                <nav className="flex space-x-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-gray-700 hover:text-primary-600 text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="flex items-center space-x-3">
                  <LanguageToggle />
                  <ThemeToggle />
                  
                  <Button
                    onClick={openAuthDialog}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {t("navigation.signIn")}
                  </Button>
                </div>
              </div>
            )}

            {isMobile && (
              <button 
                className="text-gray-700" 
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        onOpenAuth={() => {
          setMobileMenuOpen(false);
          openAuthDialog();
        }}
      />

      {/* Auth Dialog */}
      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)} 
      />
    </>
  );
}
