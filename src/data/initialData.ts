import { FeedbackSubmission } from '../types';

export const INITIAL_SUBMISSIONS: FeedbackSubmission[] = [
  {
    id: 'SK-2026-001',
    timestamp: '2026-09-12 09:15 AM',
    evaluatorName: 'Dr. Rajesh Nair',
    evaluatorRole: 'Judge',
    organization: 'National Cyber Security Council',
    email: 'dr.rajesh.nair@ncsc.gov.in',
    overallRating: 5,
    aiThreatRating: 5,
    uiDesignRating: 5,
    innovationRating: 5,
    feasibilityRating: 5,
    keyStrengths: [
      'Sacred Kavach Theme & Branding',
      'Groq AI Threat Analysis Speed',
      '1930 Cyber Crime Helpline Golden Hour Integration',
      'UPI Fraud Dispute Guide',
    ],
    comments:
      'Outstanding work by Team Hayagreeva. The blending of Indian cultural ethos with cutting-edge real-time scam and phishing detection is both inspiring and deeply effective. The heuristic checks on suspicious SMS and APKs are top-tier.',
    suggestions:
      'Consider adding multi-language regional voice alerts for rural citizens in Tier-2/3 cities.',
    verdict: 'Top Contender / Winner',
    syncedToGoogleSheets: true,
  },
  {
    id: 'SK-2026-002',
    timestamp: '2026-09-12 10:40 AM',
    evaluatorName: 'Ananya Sharma',
    evaluatorRole: 'Mentor',
    organization: 'FinTech Innovation Lab',
    email: 'ananya.s@fintechlab.io',
    overallRating: 4,
    aiThreatRating: 5,
    uiDesignRating: 5,
    innovationRating: 4,
    feasibilityRating: 4,
    keyStrengths: [
      'UPI & QR Code Traps Detection',
      'Clean Mobile-First Responsive Design',
      'Zero-Log Data Privacy Architecture',
    ],
    comments:
      'The UI feels remarkably polished and authentic to the Sudarshan Kavach identity. The immediate risk score gauge and clear action steps give citizens confidence.',
    suggestions:
      'Add browser extension export or Android companion shortcut for instant background verification.',
    verdict: 'Strong Finalist',
    syncedToGoogleSheets: true,
  },
  {
    id: 'SK-2026-003',
    timestamp: '2026-09-12 11:25 AM',
    evaluatorName: 'Vikramaditya Rao',
    evaluatorRole: 'Cybersecurity Expert',
    organization: 'Sentinel Cyber Defense Lab',
    email: 'v.rao@sentinel-labs.com',
    overallRating: 5,
    aiThreatRating: 5,
    uiDesignRating: 4,
    innovationRating: 5,
    feasibilityRating: 4,
    keyStrengths: [
      'Reverse APK Infection Heuristics',
      'Real-time Threat Intelligence Feed',
      'Golden Hour Recovery Checklist',
    ],
    comments:
      'Team Hayagreeva has addressed the exact pain points Indian consumers face with digital arrests and fake electricity KYC scams. Very high potential for real deployment with police cyber cells.',
    suggestions:
      'Integrate automated submission to the National Cybercrime Reporting Portal via API.',
    verdict: 'Top Contender / Winner',
    syncedToGoogleSheets: false,
  },
];
