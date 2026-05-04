export interface ContributorData {
  fullName: string;
  email: string;
  whatsappNumber: string;
  pinCode: string;
  preferredLanguage: 'en' | 'mr' | 'hi';
  intents: string[];
  createdAt: string;
}

export interface PledgeCategory {
  id: string;
  titleEn: string;
  titleMr: string;
  titleHi: string;
  statementEn: string;
  statementMr: string;
  statementHi: string;
}

export interface PledgeAnalytics {
  category: string;
  count: number;
  lastPledgedAt: string;
}
