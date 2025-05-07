import OpenAI from "openai";
import { log } from "./vite";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Interface for chat message
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Generate a response from OpenAI
export async function generateChatResponse(messages: ChatMessage[], language: string = "en"): Promise<string> {
  try {
    // Log the request (without sensitive content)
    log(`OpenAI request: ${messages.length} messages, language: ${language}`, "openai");
    
    // System message to set the context based on language
    const systemMessage: ChatMessage = {
      role: "system",
      content: language === "sw" 
        ? "Wewe ni msaidizi wa kisheria uliyefunzwa kujibu maswali yanayohusiana na sheria za Kenya kwa lugha ya Kiswahili. Toa majibu sahihi, fupi na yenye manufaa kwa watumiaji."
        : "You are a legal assistant trained to answer questions related to Kenyan law. Provide accurate, concise, and helpful responses to users."
    };
    
    // Add the system message at the beginning if not present
    const hasSystemMessage = messages.some(msg => msg.role === "system");
    const completeMessages = hasSystemMessage ? messages : [systemMessage, ...messages];
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: completeMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    return response.choices[0].message.content || "No response generated.";
  } catch (error: any) {
    // Log the error
    console.error("Error generating OpenAI response:", error);
    
    // Return a user-friendly error message
    throw new Error(`OpenAI API error: ${error.message || "Unknown error"}`);
  }
}

// Generate a summary of a legal document
export async function generateDocumentSummary(documentContent: string, language: string = "en"): Promise<string> {
  try {
    const prompt = language === "sw"
      ? `Fanya muhtasari wa waraka huu wa kisheria kwa lugha rahisi ya Kiswahili, ukitoa hoja muhimu na maana yake kwa watu wasio na elimu ya kisheria: \n\n${documentContent}`
      : `Summarize this legal document in plain English, highlighting the key points and what they mean for non-legal audiences: \n\n${documentContent}`;
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 800,
    });
    
    return response.choices[0].message.content || "No summary generated.";
  } catch (error: any) {
    console.error("Error generating document summary:", error);
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
}

// Generate a contract based on specified parameters
export async function generateContract(
  contractType: string,
  details: Record<string, any>,
  language: string = "en"
): Promise<string> {
  try {
    const contractTypePrompt = language === "sw"
      ? `Tengeneza mkataba wa ${contractType} kwa lugha ya Kiswahili ukitumia maelezo yafuatayo:`
      : `Generate a ${contractType} contract using the following details:`;
    
    const detailsText = Object.entries(details)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: language === "sw"
            ? "Wewe ni wakili mtaalamu katika kuandika mikataba ya kisheria inayotii sheria za Kenya."
            : "You are a legal expert specializing in drafting legally compliant contracts under Kenyan law."
        },
        {
          role: "user",
          content: `${contractTypePrompt}\n\n${detailsText}`
        }
      ],
      temperature: 0.2,
      max_tokens: 2000,
    });
    
    return response.choices[0].message.content || "No contract generated.";
  } catch (error: any) {
    console.error("Error generating contract:", error);
    throw new Error(`Failed to generate contract: ${error.message}`);
  }
}

// Check business compliance 
export async function checkBusinessCompliance(
  industry: string,
  businessDetails?: Record<string, any>,
  language: string = "en"
): Promise<string> {
  try {
    const industryPrompt = language === "sw"
      ? `Kagua mahitaji ya kisheria na uzingatiaji wa biashara katika sekta ya ${industry} nchini Kenya. Toa orodha ya mahitaji ya kisheria, leseni, na vibali vinavyohitajika.`
      : `Check the legal requirements and compliance needs for a business in the ${industry} industry in Kenya. Provide a list of legal requirements, licenses, and permits needed.`;
    
    let detailsText = "";
    if (businessDetails && Object.keys(businessDetails).length > 0) {
      detailsText = language === "sw"
        ? "\n\nHapa kuna maelezo zaidi kuhusu biashara:\n"
        : "\n\nHere are additional details about the business:\n";
      
      detailsText += Object.entries(businessDetails)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
    }
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: language === "sw"
            ? "Wewe ni mtaalamu wa uzingatiaji wa sheria za biashara nchini Kenya."
            : "You are a business compliance expert in Kenya."
        },
        {
          role: "user",
          content: `${industryPrompt}${detailsText}`
        }
      ],
      temperature: 0.4,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });
    
    return response.choices[0].message.content || "No compliance information generated.";
  } catch (error: any) {
    console.error("Error checking business compliance:", error);
    throw new Error(`Failed to check business compliance: ${error.message}`);
  }
}