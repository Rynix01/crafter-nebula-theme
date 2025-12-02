export interface HelpCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HelpItem {
  id: string;
  title: string;
  content: Record<string, any>; // Lexical rich text JSON data {root: xxx}
  categoryId: string;
  order: number;
  isActive: boolean;
  views: number;
  isFAQ: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    description?: string;
    icon: string;
  };
}

export interface HelpFAQ {
  id: string;
  question: Record<string, any>; // Lexical rich text JSON data {root: xxx}
  answer: Record<string, any>; // Lexical rich text JSON data {root: xxx}
  order: number;
  isActive: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface HelpData {
  categories: HelpCategory[];
  items: HelpItem[];
  faqs: HelpFAQ[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface GetHelpDto {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  activeOnly?: boolean;
  faqOnly?: boolean;
  sortBy?: string;
  sortOrder?: string;
}
