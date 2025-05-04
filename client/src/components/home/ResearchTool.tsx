import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Search,
  ArrowRight,
  Bot,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchLegalDocuments, generateDocumentSummary } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";

interface LegalDocument {
  id: number;
  title: string;
  content: string;
  type: string;
  summary?: string;
  tags: string[];
  lastUpdated: string;
  citation?: string;
  showSummary?: boolean;
}

export default function ResearchTool() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [documentType, setDocumentType] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchResults, setSearchResults] = useState<LegalDocument[]>([]);

  // Popular search terms
  const popularSearches = [
    "Constitution of Kenya",
    "Land Registration Act",
    "Employment Act",
    "Companies Act"
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      const results = await searchLegalDocuments({
        query: searchQuery,
        documentType: documentType === "all" ? undefined : documentType
      });
      
      setSearchResults(results.map(result => ({
        ...result,
        showSummary: false
      })));
      setSearchPerformed(true);
    } catch (error) {
      console.error("Error searching legal documents:", error);
      toast({
        title: t("common.error"),
        description: "Failed to search legal documents",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    // Trigger search form submission
    const form = document.getElementById("research-form") as HTMLFormElement;
    if (form) form.requestSubmit();
  };

  const toggleSummary = async (index: number) => {
    const document = searchResults[index];
    
    // Create a copy of the results array
    const updatedResults = [...searchResults];
    updatedResults[index] = {
      ...document,
      showSummary: !document.showSummary
    };
    
    // If summary doesn't exist and we're expanding, fetch it
    if (!document.summary && !document.showSummary) {
      try {
        const summary = await generateDocumentSummary({
          documentId: document.id,
          language: i18n.language
        });
        
        updatedResults[index].summary = summary;
      } catch (error) {
        console.error("Error generating document summary:", error);
        toast({
          title: t("common.error"),
          description: "Failed to generate document summary",
          variant: "destructive"
        });
      }
    }
    
    setSearchResults(updatedResults);
  };

  return (
    <section id="research" className="mb-10">
      <h3 className="font-heading text-xl md:text-2xl font-semibold mb-6 text-gray-800">
        {t("research.title")}
      </h3>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <form 
            id="research-form" 
            className="flex flex-col md:flex-row gap-3"
            onSubmit={handleSearch}
          >
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg py-3 px-4 pr-10 focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  placeholder={t("research.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isSearching}
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="md:w-48">
              <Select
                value={documentType}
                onValueChange={setDocumentType}
                disabled={isSearching}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("research.allDocumentTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("research.allDocumentTypes")}</SelectItem>
                  <SelectItem value="laws">{t("research.laws")}</SelectItem>
                  <SelectItem value="cases">{t("research.cases")}</SelectItem>
                  <SelectItem value="regulations">{t("research.regulations")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              type="submit"
              disabled={isSearching}
              className="bg-secondary-600 hover:bg-secondary-700 text-white"
            >
              {t("research.search")}
            </Button>
          </form>
        </div>
        
        <div className="mb-4 bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-700 mb-2 text-sm uppercase">
            {t("research.popularSearches")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term, index) => (
              <Button
                key={index}
                variant="outline"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={() => handlePopularSearch(term)}
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-6">
          <h4 className="font-medium text-gray-800 mb-4">
            {t("research.searchResults")}
          </h4>
          
          {/* If no search performed yet */}
          {!searchPerformed && (
            <div className="text-center py-8 text-gray-500">
              <Search className="mx-auto h-12 w-12 mb-2 text-gray-300" />
              <p>{t("research.noSearchYet")}</p>
            </div>
          )}
          
          {/* If search performed but no results */}
          {searchPerformed && searchResults.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No results found for "{searchQuery}"</p>
            </div>
          )}
          
          {/* If search performed with results */}
          {searchPerformed && searchResults.length > 0 && (
            <div>
              {searchResults.map((result, index) => (
                <div 
                  key={index}
                  className="border border-gray-100 rounded-lg p-4 mb-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 mb-1">{result.title}</h5>
                      <p className="text-gray-600 text-sm mb-2">
                        {result.content.substring(0, 150)}...
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {result.tags.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{t("research.lastUpdated")}: {result.lastUpdated}</span>
                        {result.citation && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{t("research.citation")}: {result.citation}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-shrink-0">
                      <Button
                        variant="link"
                        className="text-secondary-600 hover:text-secondary-700 text-sm font-medium flex items-center"
                      >
                        {t("research.view")} <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* AI Summary (Expandable) */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      className="flex items-center text-sm text-gray-700 mb-2 p-0 h-auto"
                      onClick={() => toggleSummary(index)}
                    >
                      <Bot className="mr-1 h-4 w-4" />
                      <span>{t("research.aiSummary")}</span>
                      {result.showSummary ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </Button>
                    
                    {result.showSummary && (
                      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                        {result.summary ? (
                          <div dangerouslySetInnerHTML={{ __html: result.summary.replace(/\n/g, '<br>') }} />
                        ) : (
                          <div className="flex justify-center py-2">
                            <div className="w-6 h-6 border-2 border-secondary-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
