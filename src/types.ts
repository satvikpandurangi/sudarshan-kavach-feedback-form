export interface FeedbackSubmission {
  id: string;
  timestamp: string;
  evaluatorName: string;
  evaluatorRole:
    | 'Expo Visitor'
    | 'Judge'
    | 'Mentor'
    | 'Cybersecurity Expert'
    | 'Student / Developer'
    | 'Hacker / Developer'
    | 'Visitor / Student';
  organization: string;
  email: string;
  overallRating: number; // 1 - 5
  aiThreatRating: number; // 1 - 5
  uiDesignRating: number; // 1 - 5
  innovationRating: number; // 1 - 5
  feasibilityRating: number; // 1 - 5
  keyStrengths: string[];
  comments: string;
  suggestions: string;
  verdict: 'Top Contender / Winner' | 'Strong Finalist' | 'Promising Innovation' | 'Needs More Polish';
  syncedToGoogleSheets?: boolean;
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  spreadsheetUrl: string;
  sheetTitle: string;
  lastSyncedAt?: string;
  sharedWith?: string[];
}

export interface EvaluationStats {
  totalCount: number;
  avgOverall: number;
  avgAiThreat: number;
  avgUiDesign: number;
  avgInnovation: number;
  avgFeasibility: number;
  judgeCount: number;
  npsScore: number;
}
