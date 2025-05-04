import { 
  users, 
  chats, 
  messages, 
  legalDocuments, 
  payments,
  type User, 
  type InsertUser, 
  type Chat, 
  type InsertChat, 
  type Message, 
  type InsertMessage,
  type LegalDocument,
  type InsertLegalDocument,
  type Payment,
  type InsertPayment
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;

  // Chat operations
  getChat(id: number): Promise<Chat | undefined>;
  getUserChats(userId: number): Promise<Chat[]>;
  createChat(chat: InsertChat): Promise<Chat>;
  
  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getChatMessages(chatId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Legal document operations
  getLegalDocumentById(id: number): Promise<LegalDocument | undefined>;
  searchLegalDocuments(query: string, type?: string, limit?: number): Promise<LegalDocument[]>;
  createLegalDocument(document: InsertLegalDocument): Promise<LegalDocument>;
  
  // Payment operations
  getPayment(id: number): Promise<Payment | undefined>;
  getUserPayments(userId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: number, status: string, transactionId?: string): Promise<Payment | undefined>;
}

// Memory storage implementation for development/testing
export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private chatsData: Map<number, Chat>;
  private messagesData: Map<number, Message>;
  private legalDocumentsData: Map<number, LegalDocument>;
  private paymentsData: Map<number, Payment>;
  
  private currentUserId: number;
  private currentChatId: number;
  private currentMessageId: number;
  private currentDocumentId: number;
  private currentPaymentId: number;

  constructor() {
    this.usersData = new Map();
    this.chatsData = new Map();
    this.messagesData = new Map();
    this.legalDocumentsData = new Map();
    this.paymentsData = new Map();
    
    this.currentUserId = 1;
    this.currentChatId = 1;
    this.currentMessageId = 1;
    this.currentDocumentId = 1;
    this.currentPaymentId = 1;
    
    // Initialize with some sample legal documents for testing
    this.initializeLegalDocuments();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      lastLoginAt: now
    };
    this.usersData.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }

  // Chat methods
  async getChat(id: number): Promise<Chat | undefined> {
    return this.chatsData.get(id);
  }

  async getUserChats(userId: number): Promise<Chat[]> {
    return Array.from(this.chatsData.values()).filter(
      (chat) => chat.userId === userId
    );
  }

  async createChat(insertChat: InsertChat): Promise<Chat> {
    const id = this.currentChatId++;
    const now = new Date();
    const chat: Chat = { 
      ...insertChat, 
      id, 
      createdAt: now
    };
    this.chatsData.set(id, chat);
    return chat;
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messagesData.get(id);
  }

  async getChatMessages(chatId: number): Promise<Message[]> {
    return Array.from(this.messagesData.values())
      .filter((message) => message.chatId === chatId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const now = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: now
    };
    this.messagesData.set(id, message);
    return message;
  }

  // Legal document methods
  async getLegalDocumentById(id: number): Promise<LegalDocument | undefined> {
    return this.legalDocumentsData.get(id);
  }

  async searchLegalDocuments(query: string, type?: string, limit: number = 10): Promise<LegalDocument[]> {
    // Simple in-memory search implementation
    const queryLower = query.toLowerCase();
    
    const results = Array.from(this.legalDocumentsData.values())
      .filter((doc) => {
        // Filter by type if specified
        if (type && type !== "all" && doc.type !== type) {
          return false;
        }
        
        // Search in title and content
        return (
          doc.title.toLowerCase().includes(queryLower) ||
          doc.content.toLowerCase().includes(queryLower) ||
          (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(queryLower)))
        );
      })
      .slice(0, limit);
    
    return results;
  }

  async createLegalDocument(insertDocument: InsertLegalDocument): Promise<LegalDocument> {
    const id = this.currentDocumentId++;
    const now = new Date();
    const document: LegalDocument = { 
      ...insertDocument, 
      id, 
      lastUpdated: now,
      tags: insertDocument.tags || []
    };
    this.legalDocumentsData.set(id, document);
    return document;
  }

  // Payment methods
  async getPayment(id: number): Promise<Payment | undefined> {
    return this.paymentsData.get(id);
  }

  async getUserPayments(userId: number): Promise<Payment[]> {
    return Array.from(this.paymentsData.values()).filter(
      (payment) => payment.userId === userId
    );
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const now = new Date();
    const payment: Payment = { 
      ...insertPayment, 
      id, 
      createdAt: now,
      transactionId: undefined
    };
    this.paymentsData.set(id, payment);
    return payment;
  }

  async updatePaymentStatus(id: number, status: string, transactionId?: string): Promise<Payment | undefined> {
    const payment = await this.getPayment(id);
    if (!payment) return undefined;
    
    const updatedPayment = { 
      ...payment, 
      status,
      ...(transactionId ? { transactionId } : {})
    };
    this.paymentsData.set(id, updatedPayment);
    return updatedPayment;
  }

  // Initialize some sample legal documents for testing
  private initializeLegalDocuments() {
    const documents = [
      {
        title: "Constitution of Kenya",
        content: "The Constitution of Kenya is the supreme law of the Republic of Kenya. It establishes the structure of the Kenyan government, and defines the relationship between the government and the citizens of Kenya.",
        type: "laws",
        summary: "The supreme law of Kenya establishing the structure of government and fundamental rights.",
        tags: ["Constitution", "Fundamental Law", "Kenya"],
        citation: "Constitution of Kenya, 2010",
        lastUpdated: new Date("2010-08-27")
      },
      {
        title: "Companies Act",
        content: "An Act of Parliament to consolidate and reform the law relating to the incorporation, registration, operation, management and regulation of companies; to provide for the appointment and functions of auditors; to make provision for the efficient management of insolvency; to provide for related companies, to provide for foreign companies and to provide for related matters.",
        type: "laws",
        summary: "Legal framework for formation and operation of companies in Kenya.",
        tags: ["Business Law", "Companies", "Corporate"],
        citation: "Cap. 486",
        lastUpdated: new Date("2015-09-11")
      },
      {
        title: "Employment Act",
        content: "An Act of Parliament to repeal the Employment Act, declare and define the fundamental rights of employees, to provide basic conditions of employment of employees, to regulate employment of children, and to provide for matters connected with the foregoing.",
        type: "laws",
        summary: "Defines fundamental rights of employees and basic employment conditions.",
        tags: ["Employment", "Labor", "Workers Rights"],
        citation: "Cap. 226",
        lastUpdated: new Date("2007-10-26")
      },
      {
        title: "Land Registration Act",
        content: "An Act of Parliament to revise, consolidate and rationalize the registration of titles to land, to give effect to the principles and objects of devolved government in land registration, and for connected purposes.",
        type: "laws",
        summary: "Provisions for registration of land titles and property rights.",
        tags: ["Land", "Property", "Registration"],
        citation: "No. 3 of 2012",
        lastUpdated: new Date("2012-05-02")
      },
      {
        title: "John Doe v Republic",
        content: "Criminal Appeal No. 123 of 2019. Appeal against conviction on charges of robbery with violence. The appellant contended that the identification evidence was weak and unreliable.",
        type: "cases",
        summary: "Appeal case examining reliability of identification evidence in robbery case.",
        tags: ["Criminal Law", "Identification Evidence", "Appeal"],
        citation: "Criminal Appeal No. 123 of 2019",
        lastUpdated: new Date("2019-07-15")
      }
    ];

    documents.forEach(doc => {
      this.createLegalDocument(doc as InsertLegalDocument);
    });
  }
}

export const storage = new MemStorage();
