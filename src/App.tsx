/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { HeroHeader } from './components/HeroHeader';
import { FeedbackForm } from './components/FeedbackForm';
import { QRCodeDisplay } from './components/QRCodeDisplay';
import { CameraScannerModal } from './components/CameraScannerModal';
import { SubmissionSuccessModal } from './components/SubmissionSuccessModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { INITIAL_SUBMISSIONS } from './data/initialData';
import { FeedbackSubmission, GoogleSheetsConfig } from './types';
import {
  initAuth,
  googleSignIn,
  googleSignOut,
  createFeedbackSpreadsheet,
  appendFeedbackRow,
  syncAllSubmissionsToSheet,
} from './services/googleSheets';
import {
  saveFeedbackToFirestore,
  subscribeToSubmissions,
  syncSubmissionsToFirestore,
} from './services/firebaseService';
import { exportToExcel } from './services/excelService';
import { ExternalLink, Lock } from 'lucide-react';

const STORAGE_KEY_SUBMISSIONS = 'sudarshan_kavach_submissions_v1';
const STORAGE_KEY_SHEETS = 'sudarshan_kavach_sheets_config_v1';

export default function App() {
  // Navigation tab state: Strictly public tabs ('form' or 'qr')
  const [activeTab, setActiveTab] = useState<'form' | 'qr'>('form');

  // Scanner modal state
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);

  // Admin Panel Modal state (protected with PIN / Google Auth)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Success modal state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [lastSubmitted, setLastSubmitted] = useState<FeedbackSubmission | null>(null);

  // Google Auth & Sheets state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  // Submissions state with persistent LocalStorage
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not parse saved submissions:', e);
    }
    return INITIAL_SUBMISSIONS;
  });

  // Sync to LocalStorage whenever submissions change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));
    } catch (e) {
      console.warn('Could not save submissions to localStorage:', e);
    }
  }, [submissions]);

  // Load saved Google Sheets Config and subscribe to Firestore
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY_SHEETS);
      if (savedConfig) {
        setSheetsConfig(JSON.parse(savedConfig));
      }
    } catch (e) {
      console.warn('Could not parse saved sheets config:', e);
    }

    // Check URL parameters for view
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'qr') {
      setActiveTab('qr');
    } else if (urlParams.get('admin') === 'true') {
      setIsAdminModalOpen(true);
    }

    // Listen to real-time submissions from Firebase Firestore
    const unsubscribeFirestore = subscribeToSubmissions((remoteSubmissions) => {
      if (remoteSubmissions && remoteSubmissions.length > 0) {
        setSubmissions(remoteSubmissions);
      } else {
        // If Firestore is empty on first run, seed with initial data
        syncSubmissionsToFirestore(INITIAL_SUBMISSIONS);
      }
    });

    // Initialize Google Identity Services
    initAuth((user, token) => {
      setCurrentUser(user);
      setAccessToken(token);
    });

    return () => {
      unsubscribeFirestore();
    };
  }, []);

  // Google Sign-In Trigger (used only inside Admin Panel)
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
      }
    } catch (err) {
      console.error('Google Sign-In failed:', err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Google Sign-Out Trigger
  const handleGoogleSignOut = async () => {
    try {
      await googleSignOut();
      setCurrentUser(null);
      setAccessToken(null);
    } catch (err) {
      console.error('Google Sign-Out failed:', err);
    }
  };

  // Create or Link Google Sheet (Admin Panel only)
  const handleCreateSheet = async () => {
    let currentToken = accessToken;
    if (!currentToken) {
      const authRes = await googleSignIn();
      if (authRes) {
        setCurrentUser(authRes.user);
        setAccessToken(authRes.accessToken);
        currentToken = authRes.accessToken;
      }
    }

    if (!currentToken) return;

    setIsGoogleLoading(true);
    try {
      const config = await createFeedbackSpreadsheet(
        currentToken,
        'Sudarshan Kavach - Exhibition Feedback (Team Hayagreeva)'
      );
      setSheetsConfig(config);
      localStorage.setItem(STORAGE_KEY_SHEETS, JSON.stringify(config));

      // Batch sync existing submissions
      if (submissions.length > 0) {
        await syncAllSubmissionsToSheet(currentToken, config.spreadsheetId, submissions);
        setSubmissions((prev) =>
          prev.map((item) => ({ ...item, syncedToGoogleSheets: true }))
        );
      }
    } catch (err) {
      console.warn('Failed to create sheet:', err);
      throw err;
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Sync pending submissions to Google Sheet
  const handleSyncPending = async () => {
    if (!accessToken || !sheetsConfig) return;
    setIsGoogleLoading(true);
    try {
      const pending = submissions.filter((s) => !s.syncedToGoogleSheets);
      if (pending.length > 0) {
        await syncAllSubmissionsToSheet(accessToken, sheetsConfig.spreadsheetId, pending);
        setSubmissions((prev) =>
          prev.map((item) => ({ ...item, syncedToGoogleSheets: true }))
        );
      }
    } catch (err) {
      console.error('Failed to sync rows:', err);
      throw err;
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Trigger Excel file download (.xlsx)
  const handleExportExcel = () => {
    exportToExcel(submissions);
  };

  // Handle Form Submission (NO AUTH REQUIRED for visitor)
  const handleSubmitFeedback = async (newSubmission: FeedbackSubmission) => {
    let synced = false;

    // Automatically export to Google Sheet in the background if admin configured it
    if (accessToken && sheetsConfig) {
      try {
        await appendFeedbackRow(accessToken, sheetsConfig.spreadsheetId, newSubmission);
        synced = true;
      } catch (err) {
        console.warn('Background auto-sync to Google Sheet failed:', err);
      }
    }

    const finalItem: FeedbackSubmission = {
      ...newSubmission,
      syncedToGoogleSheets: synced,
    };

    // Save permanently to Firebase Firestore in real-time
    try {
      await saveFeedbackToFirestore(finalItem);
    } catch (firebaseErr) {
      console.warn('Firestore write warning:', firebaseErr);
    }

    setSubmissions((prev) => [finalItem, ...prev]);
    setLastSubmitted(finalItem);
    setIsSuccessModalOpen(true);
  };

  // QR Code scanned successfully
  const handleScanSuccess = (data: string) => {
    console.log('QR Scanned:', data);
    setActiveTab('form');
  };

  const pendingCount = submissions.filter((s) => !s.syncedToGoogleSheets).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* 1. Header with Sudarshan Kavach & Team Hayagreeva full roster */}
      <HeroHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        isAdminSignedIn={!!currentUser}
      />

      {/* 2. Main Public Content Area (Exhibition Visitors) */}
      <main className="flex-1">
        {activeTab === 'form' && (
          <FeedbackForm onSubmitSuccess={handleSubmitFeedback} />
        )}

        {activeTab === 'qr' && (
          <QRCodeDisplay
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenForm={() => setActiveTab('form')}
          />
        )}
      </main>

      {/* 3. Scanner Modal */}
      <CameraScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      {/* 4. Submission Success Modal (Clean for Public Visitors) */}
      <SubmissionSuccessModal
        submission={lastSubmitted}
        onClose={() => setIsSuccessModalOpen(false)}
        onSubmitAnother={() => {
          setIsSuccessModalOpen(false);
          setActiveTab('form');
        }}
      />

      {/* 5. Restricted Admin Panel Modal (Passcode/Google Auth Protected, houses Responses, Sheets, Firebase & Excel) */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        currentUser={currentUser}
        accessToken={accessToken}
        sheetsConfig={sheetsConfig}
        pendingSyncCount={pendingCount}
        totalSubmissions={submissions.length}
        submissions={submissions}
        onSignIn={handleGoogleSignIn}
        onSignOut={handleGoogleSignOut}
        onCreateSheet={handleCreateSheet}
        onSyncPending={handleSyncPending}
        onExportExcel={handleExportExcel}
        isLoading={isGoogleLoading}
      />

      {/* 6. Professional Footer with Team Hayagreeva Credentials (Shown on form view; kiosk display has integrated branding) */}
      {activeTab !== 'qr' ? (
        <footer className="w-full bg-[#090d16] text-slate-400 text-xs border-t border-slate-800 mt-12 py-10 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800/80">
              {/* Column 1: Branding */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="/sudarshan-shield-emblem.png"
                    alt="Sudarshan Kavach Logo"
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-white font-extrabold text-sm tracking-wide">
                    SUDARSHAN KAVACH
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  AI-Powered Digital Safety Co-Pilot. Protecting citizens against phishing, UPI traps, APK malware, and financial cyber crime.
                </p>
                <div className="text-[11px] text-orange-400 font-semibold">
                  🔱 Sacred Invocation of the Sudarshan Chakra for Total Defense
                </div>
              </div>

              {/* Column 2: Exact Team Hayagreeva Roster - No individual highlight */}
              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">
                  Developed by Team Hayagreeva
                </h4>
                <p className="text-amber-300 font-semibold text-xs mb-2">
                  Mentor: A K Anand
                </p>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>Prateek Deshpande</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>Adithi D S</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>K Aasritha Vardhan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>Satvik Pandurangi</span>
                  </li>
                </ul>
                <div className="mt-3">
                  <a
                    href="https://sudarshan-kavach.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-orange-400 hover:text-orange-300 font-medium text-xs underline underline-offset-2"
                  >
                    Visit Sudarshan Kavach Live Application
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Column 3: Exhibition Information & Discreet Admin Lock */}
              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                  Exhibition Booth Station
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Welcome to our interactive booth station. Scan the QR code with your phone camera to submit instant evaluations and feedback.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAdminModalOpen(true)}
                    id="footer-btn-admin-panel"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-slate-300 font-medium text-xs border border-slate-800 transition-colors cursor-pointer"
                    title="Team Administrator Area"
                  >
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span>Team Admin</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
              <div>
                © 2026 Sudarshan Kavach AI • Team Hayagreeva • All Rights Reserved
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <span>Empowering Digital India with AI-Driven Cyber Defense</span>
              </div>
            </div>
          </div>
        </footer>
      ) : (
        /* Discreet minimalist footer for tablet kiosk mode */
        <footer className="w-full py-2 px-4 text-center text-[11px] text-slate-500 border-t border-slate-200/60 bg-white/50">
          <span>© 2026 Sudarshan Kavach • Team Hayagreeva • Exhibition Visitor Station</span>
        </footer>
      )}
    </div>
  );
}
