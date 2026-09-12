import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { FeedbackSubmission, GoogleSheetsConfig } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
// Workspace Scopes requested by user & approved in OAuth UI
export const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

SCOPES.forEach((scope) => provider.addScope(scope));

// In-memory token cache (Do NOT store in localStorage per security requirements)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token was cleared or page was refreshed
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No access token returned from Google Auth');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    // Gracefully handle normal user actions: user closed popup or cancelled
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.message?.includes('auth/popup-closed-by-user') ||
      error?.message?.includes('auth/cancelled-popup-request')
    ) {
      console.info('Google sign-in popup was dismissed by the user.');
      return null;
    }

    // Popup blocked by browser or iframe policy
    if (
      error?.code === 'auth/popup-blocked' ||
      error?.message?.includes('auth/popup-blocked')
    ) {
      console.warn('Google sign-in popup was blocked by the browser.');
      throw new Error(
        'The sign-in popup was blocked. Please allow popups for this site or open the app in a new tab.'
      );
    }

    console.warn('Google Sign In failed:', error?.message || error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const googleSignOut = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

// Authorized Administrators with Full Firebase & Sheets Access
export const PRIMARY_ADMIN_EMAIL = 'satvikpandurangi07@gmail.com';

export const isSuperAdmin = (user?: User | null): boolean => {
  if (!user || !user.email) return false;
  return user.email.trim().toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();
};

/**
 * Grants access to a Google Sheet / Drive File using Google Drive Permissions API v3
 */
export const shareSpreadsheetWithEmail = async (
  accessToken: string,
  spreadsheetId: string,
  emailAddress: string,
  role: 'writer' | 'reader' | 'commenter' = 'writer'
): Promise<{ success: boolean; message?: string }> => {
  try {
    const url = `https://www.googleapis.com/drive/v3/files/${spreadsheetId}/permissions?sendNotificationEmail=true`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role,
        type: 'user',
        emailAddress,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Drive permission call (${response.status}):`, errText);
      return { success: false, message: errText };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Failed to share spreadsheet with user:', err);
    return { success: false, message: err?.message || String(err) };
  }
};

/**
 * Creates a dedicated Google Sheet with pre-formatted columns and frozen header
 */
export const createFeedbackSpreadsheet = async (
  accessToken: string,
  customTitle?: string
): Promise<GoogleSheetsConfig> => {
  const title = customTitle || `Sudarshan Kavach - Hackathon Evaluation (Team Hayagreeva)`;

  const requestBody = {
    properties: {
      title: title,
    },
    sheets: [
      {
        properties: {
          title: 'Feedback Responses',
          gridProperties: {
            frozenRowCount: 1,
          },
        },
      },
    ],
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to create Google Sheet: ${errText}`);
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write the initial styled header row
  const headers = [
    [
      'ID',
      'Timestamp',
      'Evaluator Name',
      'Role / Category',
      'Organization',
      'Email',
      'Overall Rating (1-5)',
      'AI Threat Detection (1-5)',
      'UI / UX Design (1-5)',
      'Innovation & Impact (1-5)',
      'Feasibility & Readiness (1-5)',
      'Key Strengths',
      'Constructive Feedback / Comments',
      'Improvement Suggestions',
      'Verdict / Award Assessment',
    ],
  ];

  await appendRows(accessToken, spreadsheetId, headers);

  // Automatically grant Writer/Editor access to satvikpandurangi07@gmail.com
  const sharedWith: string[] = [PRIMARY_ADMIN_EMAIL];
  try {
    await shareSpreadsheetWithEmail(accessToken, spreadsheetId, PRIMARY_ADMIN_EMAIL, 'writer');
  } catch (shareErr) {
    console.info('Auto-share status note:', shareErr);
  }

  return {
    spreadsheetId,
    spreadsheetUrl,
    sheetTitle: title,
    lastSyncedAt: new Date().toISOString(),
    sharedWith,
  };
};

/**
 * Helper to append 2D array of rows to a sheet
 */
export const appendRows = async (
  accessToken: string,
  spreadsheetId: string,
  rows: (string | number)[][]
): Promise<boolean> => {
  const range = 'Feedback Responses!A1';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    range
  )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: rows,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to append rows to Google Sheet: ${err}`);
  }

  return true;
};

/**
 * Transforms a FeedbackSubmission object into a row for Google Sheets
 */
export const submissionToRow = (sub: FeedbackSubmission): (string | number)[] => {
  return [
    sub.id,
    sub.timestamp,
    sub.evaluatorName,
    sub.evaluatorRole,
    sub.organization || 'N/A',
    sub.email || 'N/A',
    sub.overallRating,
    sub.aiThreatRating,
    sub.uiDesignRating,
    sub.innovationRating,
    sub.feasibilityRating,
    sub.keyStrengths.join(', '),
    sub.comments,
    sub.suggestions || 'N/A',
    sub.verdict,
  ];
};

/**
 * Appends a single feedback submission into the Google Sheet
 */
export const appendFeedbackRow = async (
  accessToken: string,
  spreadsheetId: string,
  sub: FeedbackSubmission
): Promise<boolean> => {
  const row = submissionToRow(sub);
  return appendRows(accessToken, spreadsheetId, [row]);
};

/**
 * Batch appends multiple submissions to the Google Sheet
 */
export const syncAllSubmissionsToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  subs: FeedbackSubmission[]
): Promise<boolean> => {
  if (subs.length === 0) return true;
  const rows = subs.map(submissionToRow);
  return appendRows(accessToken, spreadsheetId, rows);
};
