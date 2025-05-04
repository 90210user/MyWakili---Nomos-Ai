import { apiRequest } from "./queryClient";

// Interface for chat message
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Interface for legal document search
export interface LegalDocumentSearchParams {
  query: string;
  documentType?: string;
  limit?: number;
}

// Interface for legal document summary
export interface LegalDocumentSummaryParams {
  documentId: number;
  language?: string;
}

// Generate legal advice
export const generateLegalAdvice = async (
  messages: ChatMessage[],
  language: string = "en"
): Promise<{ text: string; source?: string }> => {
  try {
    const response = await apiRequest("POST", "/api/chat", {
      messages,
      language
    });
    
    return await response.json();
  } catch (error: any) {
    console.error("Error generating legal advice:", error);
    throw new Error(error.message || "Failed to generate legal advice");
  }
};

// Search for legal documents
export const searchLegalDocuments = async (
  params: LegalDocumentSearchParams
): Promise<any[]> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("query", params.query);
    
    if (params.documentType && params.documentType !== "all") {
      queryParams.append("type", params.documentType);
    }
    
    if (params.limit) {
      queryParams.append("limit", params.limit.toString());
    }
    
    const response = await apiRequest(
      "GET", 
      `/api/legal-documents/search?${queryParams.toString()}`,
      undefined
    );
    
    return await response.json();
  } catch (error: any) {
    console.error("Error searching legal documents:", error);
    throw new Error(error.message || "Failed to search legal documents");
  }
};

// Generate document summary
export const generateDocumentSummary = async (
  params: LegalDocumentSummaryParams
): Promise<string> => {
  try {
    const response = await apiRequest(
      "GET", 
      `/api/legal-documents/${params.documentId}/summary?language=${params.language || "en"}`,
      undefined
    );
    
    return await response.json();
  } catch (error: any) {
    console.error("Error generating document summary:", error);
    throw new Error(error.message || "Failed to generate document summary");
  }
};

// Generate contract based on specified parameters
export interface ContractGenerationParams {
  contractType: string;
  details: Record<string, any>;
  language?: string;
}

export const generateContract = async (
  params: ContractGenerationParams
): Promise<string> => {
  try {
    const response = await apiRequest(
      "POST", 
      "/api/contracts/generate", 
      params
    );
    
    return await response.json();
  } catch (error: any) {
    console.error("Error generating contract:", error);
    throw new Error(error.message || "Failed to generate contract");
  }
};

// Check business compliance
export interface ComplianceCheckParams {
  industry: string;
  businessDetails?: Record<string, any>;
  language?: string;
}

export const checkBusinessCompliance = async (
  params: ComplianceCheckParams
): Promise<any> => {
  try {
    const response = await apiRequest(
      "POST", 
      "/api/compliance/check", 
      params
    );
    
    return await response.json();
  } catch (error: any) {
    console.error("Error checking compliance:", error);
    throw new Error(error.message || "Failed to check compliance");
  }
};
