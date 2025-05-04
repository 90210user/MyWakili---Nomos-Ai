import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Scale, RefreshCcw, Info, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateLegalAdvice } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  source?: string;
}

export default function ChatInterface() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: t("chat.welcomeMessage"),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    try {
      // Include all previous messages for context
      const currentLanguage = i18n.language || "en";
      const response = await generateLegalAdvice(
        [...messages, userMessage],
        currentLanguage
      );
      
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: response.text,
          source: response.source
        }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: t("common.error"),
        description: "Failed to get response from AI assistant",
        variant: "destructive"
      });
      
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "I'm sorry, I couldn't process your request at this time. Please try again later."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([
      { role: "assistant", content: t("chat.welcomeMessage") }
    ]);
  };

  return (
    <section id="chat" className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground">
          {t("chat.title")}
        </h3>
        <div className="bg-muted rounded-full px-3 py-1 text-xs flex items-center text-muted-foreground">
          <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
          <span>{t("chat.aiPowered")}</span>
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="border-b border-border p-4">
          <div className="flex items-center">
            <div className="flex-1">
              <h4 className="font-medium text-card-foreground">{t("chat.title")}</h4>
              <p className="text-muted-foreground text-xs">{t("chat.subtitle")}</p>
            </div>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={startNewChat}
                className="text-muted-foreground hover:text-foreground"
                aria-label={t("chat.newChat")}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div 
          className="h-96 overflow-y-auto p-4 bg-background/50"
          ref={chatContainerRef}
        >
          {messages.map((message, index) => (
            message.role === "user" ? (
              // User message
              <div className="flex justify-end mb-4" key={index}>
                <div className="bg-primary p-3 rounded-lg shadow-sm max-w-md text-primary-foreground chat-bubble-user">
                  <p>{message.content}</p>
                </div>
              </div>
            ) : (
              // AI message
              <div className="flex mb-4" key={index}>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0 mr-3">
                  <Scale className="h-4 w-4" />
                </div>
                <div className="bg-card p-3 rounded-lg shadow-sm max-w-md chat-bubble-ai">
                  <div className="text-card-foreground whitespace-pre-wrap">
                    {message.content}
                  </div>
                  
                  {message.source && (
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <span>{t("chat.source")}: {message.source}</span>
                      <Button variant="ghost" size="icon" className="ml-2 text-primary hover:text-primary/90 h-5 w-5 p-0">
                        <Info className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  {index === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">{t("chat.disclaimer")}</p>
                  )}
                </div>
              </div>
            )
          ))}
          
          {isLoading && (
            <div className="flex mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0 mr-3">
                <Scale className="h-4 w-4" />
              </div>
              <div className="bg-card p-3 rounded-lg shadow-sm chat-bubble-ai">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-border">
          <form className="flex items-center" onSubmit={handleSendMessage}>
            <Input
              type="text"
              className="flex-1 border-border rounded-l-lg focus-visible:ring-primary"
              placeholder={t("chat.inputPlaceholder")}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-r-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-xs text-muted-foreground mt-2 flex items-center">
            <Info className="h-3 w-3 mr-1" />
            <span>{t("chat.disclaimer")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
