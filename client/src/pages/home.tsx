import { useRef } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ServiceHighlights from "@/components/home/ServiceHighlights";
import ChatInterface from "@/components/home/ChatInterface";
import ResearchTool from "@/components/home/ResearchTool";
import SMETools from "@/components/home/SMETools";
import PricingSection from "@/components/home/PricingSection";

export default function Home() {
  const chatRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <HeroSection 
          onChatClick={scrollToChat}
          onLearnMoreClick={scrollToServices}
        />
        
        <div ref={servicesRef}>
          <ServiceHighlights />
        </div>
        
        <div ref={chatRef}>
          <ChatInterface />
        </div>
        
        <ResearchTool />
        <SMETools />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
