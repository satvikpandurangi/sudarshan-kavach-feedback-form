import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  PlusCircle,
  LogOut,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { GoogleSheetsConfig } from '../types';
import { AccessPermissionsModal } from './AccessPermissionsModal';
import { PRIMARY_ADMIN_EMAIL, isSuperAdmin } from '../services/googleSheets';

interface GoogleSheetsSyncBarProps {
  currentUser: User | null;
  accessToken: string | null;
  sheetsConfig: GoogleSheetsConfig | null;
  pendingSyncCount: number;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  onCreateSheet: () => Promise<void>;
  onSyncPending: () => Promise<void>;
  onUpdateSheetsConfig?: (config: GoogleSheetsConfig) => void;
  isLoading: boolean;
}

export const GoogleSheetsSyncBar: React.FC<GoogleSheetsSyncBarProps> = ({
  currentUser,
  accessToken,
  sheetsConfig,
  pendingSyncCount,
  onSignIn,
  onSignOut,
  onCreateSheet,
  onSyncPending,
  onUpdateSheetsConfig,
  isLoading,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState<boolean>(false);

  const isCurrentSuperAdmin = isSuperAdmin(currentUser);

  const handleSignIn = async () => {
    try {
      setErrorMsg(null);
      await onSignIn();
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.message?.includes('auth/popup-closed-by-user') ||
        err?.code === 'auth/cancelled-popup-request'
      ) {
        return;
      }
      setErrorMsg(err?.message || 'Failed to authenticate with Google');
    }
  };

  const handleCreate = async () => {
    try {
      setErrorMsg(null);
      await onCreateSheet();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to create spreadsheet');
    }
  };

  const handleSync = async () => {
    try {
      setErrorMsg(null);
      await onSyncPending();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to sync rows to Google Sheet');
    }
  };

  return (
    <>
      <div className="w-full bg-white border-b border-slate-200/90 shadow-sm py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left: Google Sheets Integration Status */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 text-emerald-600 shadow-sm">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-slate-800">
                  Google Sheets Real-Time Export
                </span>
                {sheetsConfig ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Auto-Sync Active
                  </span>
                ) : currentUser ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    Google Account Linked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Sign in to stream live data
                  </span>
                )}

                {/* Team Access Tag */}
                <button
                  onClick={() => setIsAccessModalOpen(true)}
                  id="btn-access-tag"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100 transition-colors"
                  title="Manage access for satvikpandurangi07@gmail.com & Team"
                >
                  <ShieldCheck className="w-3 h-3 text-orange-600" />
                  <span>Access: {PRIMARY_ADMIN_EMAIL.split('@')[0]}</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {sheetsConfig ? (
                  <span className="truncate inline-block max-w-sm sm:max-w-md align-bottom">
                    Linked to: <strong>{sheetsConfig.sheetTitle}</strong>
                  </span>
                ) : (
                  'Every QR code evaluation is saved locally and can automatically stream to Google Sheets'
                )}
              </p>
            </div>
          </div>

          {/* Right: Actions & Auth */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            {errorMsg && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="max-w-xs truncate">{errorMsg}</span>
              </div>
            )}

            {/* Access & Permissions button */}
            <button
              onClick={() => setIsAccessModalOpen(true)}
              id="btn-open-access-modal"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 shadow-sm transition-all"
              title="Configure Sheets & Firebase Access"
            >
              <Users className="w-3.5 h-3.5 text-orange-600" />
              <span>Permissions &amp; Access</span>
            </button>

            {!currentUser ? (
              /* Official Google Sign In Button */
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="gsi-material-button text-xs sm:text-sm"
                id="google-signin-btn"
              >
                <div className="gsi-material-button-icon">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    style={{ display: 'block', width: '18px', height: '18px' }}
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    ></path>
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    ></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="font-semibold text-slate-700">
                  {isLoading ? 'Connecting...' : 'Sign in with Google'}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                {/* If no sheet created yet, offer to create one */}
                {!sheetsConfig ? (
                  <button
                    onClick={handleCreate}
                    disabled={isLoading}
                    id="btn-create-google-sheet"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{isLoading ? 'Creating Sheet...' : 'Create Google Sheet'}</span>
                  </button>
                ) : (
                  <>
                    {/* Open in Google Sheets link */}
                    <a
                      href={sheetsConfig.spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      id="link-open-google-sheet"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors"
                    >
                      <span>Open in Google Sheets</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>

                    {/* Sync Pending if any */}
                    {pendingSyncCount > 0 && (
                      <button
                        onClick={handleSync}
                        disabled={isLoading}
                        id="btn-sync-pending-sheets"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Sync ({pendingSyncCount}) to Sheet</span>
                      </button>
                    )}
                  </>
                )}

                {/* User badge & Sign Out */}
                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-300">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-6 h-6 rounded-full object-cover border border-slate-300"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
                      {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-700 font-medium hidden lg:inline max-w-[120px] truncate">
                        {currentUser.displayName || currentUser.email}
                      </span>
                      {isCurrentSuperAdmin && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-300">
                          👑 Admin
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={onSignOut}
                    title="Sign out of Google"
                    id="btn-google-signout"
                    className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Access and Permissions Modal */}
      <AccessPermissionsModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        currentUser={currentUser}
        accessToken={accessToken}
        sheetsConfig={sheetsConfig}
        onUpdateSheetsConfig={onUpdateSheetsConfig}
      />
    </>
  );
};
