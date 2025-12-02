export interface TicketMessage {
  senderId: string;
  content: Record<string, any>; // Lexical rich text JSON data {root: xxx}
  sender?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface Ticket {
  id: string;
  title: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
  messages: TicketMessage[];
  status: "CLOSED" | "REPLIED" | "OPEN" | "ON_OPERATE";
  assignedUserIds: string[];
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  createdByUser?: {
    id: string;
    username: string;
    email: string;
  };
  assignedUsers?: Array<{
    id: string;
    username: string;
    email: string;
  }>;
}

export interface TicketCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketDto {
  title: string;
  categoryId: string;
  message: Record<string, any>; // Lexical JSON {root: ...}
}

export interface ReplyTicketDto {
  message: Record<string, any>; // Lexical JSON {root: ...}
}
