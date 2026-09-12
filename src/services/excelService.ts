import * as XLSX from 'xlsx';
import { FeedbackSubmission, EvaluationStats } from '../types';

export const exportToExcel = (submissions: FeedbackSubmission[], filename?: string): void => {
  const wb = XLSX.utils.book_new();

  // 1. Raw Data Sheet
  const headers = [
    'Submission ID',
    'Date & Time',
    'Evaluator Name',
    'Role / Category',
    'Organization / Company',
    'Email Address',
    'Overall Rating (1-5)',
    'AI Threat Detection Score (1-5)',
    'UI / UX Design Score (1-5)',
    'Innovation & Impact (1-5)',
    'Feasibility & Readiness (1-5)',
    'Key Strengths Highlighted',
    'Detailed Feedback & Observations',
    'Recommendations / Next Steps',
    'Final Award Verdict',
    'Synced to Google Sheet',
  ];

  const rows = submissions.map((s) => [
    s.id,
    s.timestamp,
    s.evaluatorName,
    s.evaluatorRole,
    s.organization || 'N/A',
    s.email || 'N/A',
    s.overallRating,
    s.aiThreatRating,
    s.uiDesignRating,
    s.innovationRating,
    s.feasibilityRating,
    s.keyStrengths.join('; '),
    s.comments,
    s.suggestions || 'N/A',
    s.verdict,
    s.syncedToGoogleSheets ? 'Yes' : 'Pending',
  ]);

  const wsData = [headers, ...rows];
  const wsFeedback = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths for readability
  wsFeedback['!cols'] = [
    { wch: 16 }, // ID
    { wch: 20 }, // Timestamp
    { wch: 22 }, // Name
    { wch: 18 }, // Role
    { wch: 24 }, // Org
    { wch: 26 }, // Email
    { wch: 18 }, // Overall
    { wch: 22 }, // AI
    { wch: 20 }, // UI
    { wch: 22 }, // Innovation
    { wch: 24 }, // Feasibility
    { wch: 30 }, // Strengths
    { wch: 45 }, // Comments
    { wch: 35 }, // Suggestions
    { wch: 24 }, // Verdict
    { wch: 20 }, // Synced
  ];

  XLSX.utils.book_append_sheet(wb, wsFeedback, 'Feedback Submissions');

  // 2. Summary & Analytics Sheet
  const total = submissions.length;
  const avg = (fn: (s: FeedbackSubmission) => number) =>
    total > 0 ? (submissions.reduce((acc, s) => acc + fn(s), 0) / total).toFixed(2) : '0.00';

  const roleCount = (role: string) => submissions.filter((s) => s.evaluatorRole === role).length;
  const verdictCount = (verdict: string) => submissions.filter((s) => s.verdict === verdict).length;

  const summaryData: (string | number)[][] = [
    ['PROJECT EVALUATION EXECUTIVE SUMMARY', ''],
    ['Product Name', 'Sudarshan Kavach (AI-Powered Digital Safety Co-Pilot)'],
    ['Team Name', 'Team Hayagreeva'],
    ['Hackathon Event', 'National Cyber Defense & AI Innovation Hackathon'],
    ['Generated At', new Date().toLocaleString()],
    ['', ''],
    ['CORE METRICS', 'VALUE'],
    ['Total Feedback Responses', total],
    ['Average Overall Score', `${avg((s) => s.overallRating)} / 5.00`],
    ['Average AI Threat Detection Score', `${avg((s) => s.aiThreatRating)} / 5.00`],
    ['Average UI / UX Design Score', `${avg((s) => s.uiDesignRating)} / 5.00`],
    ['Average Innovation & Impact Score', `${avg((s) => s.innovationRating)} / 5.00`],
    ['Average Feasibility & Readiness Score', `${avg((s) => s.feasibilityRating)} / 5.00`],
    ['', ''],
    ['EVALUATOR BREAKDOWN', 'COUNT'],
    ['Hackathon Judges', roleCount('Judge')],
    ['Mentors & Industry Guides', roleCount('Mentor')],
    ['Cybersecurity Experts', roleCount('Cybersecurity Expert')],
    ['Fellow Hackers / Devs', roleCount('Hacker / Developer')],
    ['General Visitors & Students', roleCount('Visitor / Student')],
    ['', ''],
    ['VERDICT / AWARD ASSESSMENT', 'COUNT'],
    ['Top Contender / Winner', verdictCount('Top Contender / Winner')],
    ['Strong Finalist', verdictCount('Strong Finalist')],
    ['Promising Innovation', verdictCount('Promising Innovation')],
    ['Needs More Polish', verdictCount('Needs More Polish')],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary['!cols'] = [{ wch: 36 }, { wch: 45 }];

  XLSX.utils.book_append_sheet(wb, wsSummary, 'Executive Summary');

  // Trigger Excel File Download
  const outputFileName = filename || `Sudarshan_Kavach_Feedback_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, outputFileName);
};
