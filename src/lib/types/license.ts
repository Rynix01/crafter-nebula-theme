export interface License {
  id: string;
  key: string;
  type: 'trial' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'expired' | 'suspended' | 'revoked';
  websiteId: string;
  userId: string;
  issuedAt: string;
  expiresAt: string;
  features: string[];
  maxUsers?: number;
  maxWebsites?: number;
  isUnlimited?: boolean;
}
