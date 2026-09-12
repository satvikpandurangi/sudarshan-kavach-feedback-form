import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  ShieldCheck,
  FileSpreadsheet,
  Flame,
  CheckCircle2,
  ExternalLink,
  Users,
  Copy,
  Check,
  Share2,
  AlertCircle,
  X,
  Mail,
  Lock,
} from 'lucide-react';
import { GoogleSheetsConfig } from '../types';
import {
  PRIMARY_ADMIN_EMAIL,
  isSuperAdmin,
  shareSpreadsheetWithEmail,
} from '../services/googleSheets';

interface AccessPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  accessToken: string | null;
  sheetsConfig: GoogleSheetsConfig | null;
  onUpdateSheetsConfig?: (config: GoogleSheetsConfig) => void;
}

export const AccessPermissionsModal: React.FC<AccessPermissionsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  accessToken,
  sheetsConfig,
  onUpdateSheetsConfig,
}) => {
  const [customEmail, setCustomEmail] = useState<string>('');
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [shareSuccessMessage, setShareSuccessMessage] = useState<string | null>(null);
  const [shareErrorMessage, setShareErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!isOpen) return null;

  const isUserSuperAdmin = isSuperAdmin(currentUser);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleShareWithAdmin = async (targetEmail: string = PRIMARY_ADMIN_EMAIL) => {
    if (!accessToken || !sheetsConfig) {
      setShareErrorMessage('Please sign in and link a Google Sheet first to grant Drive permissions.');
      return;
    }

    setIsSharing(true);
    setShareSuccessMessage(null);
    setShareErrorMessage(null);

    try {
      const result = await shareSpreadsheetWithEmail(
        accessToken,
        sheetsConfig.spreadsheetId,
        targetEmail,
        'writer'
      );

      if (result.success) {
        setShareSuccessMessage(`Successfully granted Editor access to ${targetEmail}!`);
        const updatedList = Array.from(new Set([...(sheetsConfig.sharedWith || []), targetEmail]));
        if (onUpdateSheetsConfig) {
          onUpdateSheetsConfig({
            ...sheetsConfig,
            sharedWith: updatedList,
          });
        }
      } else {
        setShareErrorMessage(
          result.message || `Could not share sheet with ${targetEmail}. Please check Drive permissions.`
        );
      }
    } catch (err: any) {
      setShareErrorMessage(err?.message || 'Error occurred while sharing spreadsheet.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) return;
    await handleShareWithAdmin(customEmail.trim());
    setCustomEmail('');
  };

  const firebaseConsoleUrl =
    'https://console.firebase.google.com/project/gen-lang-client-0695376368/settings/usersandpermissions';

  return (
    <div
      id="access-permissions-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="access-permissions-dialog"
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0d1322] to-slate-900 text-white p-6 border-b border-orange-500/20 relative">
          <button
            onClick={onClose}
            id="btn-close-access-modal"
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Access &amp; Permissions Management
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/30 text-orange-300 border border-orange-500/40">
                  Role: Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Grant and configure Google Sheets &amp; Firebase project access for Team Hayagreeva
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Notifications / Alerts */}
          {shareSuccessMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{shareSuccessMessage}</span>
            </div>
          )}

          {shareErrorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{shareErrorMessage}</span>
            </div>
          )}

          {/* SECTION 1: Designated Super Admin Account */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Primary Designated Administrator
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {PRIMARY_ADMIN_EMAIL}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Authorized Access
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Has full administrative control, unlimited sheet syncing, raw exports, and evaluation management.
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                {isUserSuperAdmin ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800 border border-orange-300">
                    👑 Signed in as Super Admin
                  </span>
                ) : currentUser ? (
                  <span className="text-xs text-slate-500 block">
                    Signed in as: <strong className="text-slate-700">{currentUser.email}</strong>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 block">Not currently signed in</span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: Google Sheets Permissions */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Google Sheets Access</h4>
                  <p className="text-xs text-slate-500">Live evaluation workbook editor permissions</p>
                </div>
              </div>

              {sheetsConfig ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Workbook Linked
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  No Sheet Connected
                </span>
              )}
            </div>

            {sheetsConfig ? (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Spreadsheet Name:</span>
                    <strong className="text-slate-800">{sheetsConfig.sheetTitle}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Spreadsheet ID:</span>
                    <span className="font-mono text-slate-700 truncate max-w-[240px]">
                      {sheetsConfig.spreadsheetId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500">Status for {PRIMARY_ADMIN_EMAIL}:</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Editor / Writer Granted
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleShareWithAdmin(PRIMARY_ADMIN_EMAIL)}
                    disabled={isSharing || !accessToken}
                    id="btn-grant-sheet-satvik"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                  >
                    <Share2 className={`w-3.5 h-3.5 ${isSharing ? 'animate-spin' : ''}`} />
                    <span>
                      {isSharing ? 'Sharing with Drive...' : `Grant / Re-verify Access for ${PRIMARY_ADMIN_EMAIL}`}
                    </span>
                  </button>

                  <a
                    href={sheetsConfig.spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors"
                  >
                    <span>Open Sheet</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>

                  <button
                    onClick={() => handleCopy(sheetsConfig.spreadsheetUrl, 'sheetUrl')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors"
                  >
                    {copiedLink === 'sheetUrl' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Custom Collaborator Sharing Form */}
                <form onSubmit={handleShareCustom} className="pt-2 flex gap-2">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="Invite additional evaluator or teammate email..."
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isSharing || !customEmail.trim() || !accessToken}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
                  >
                    Add Collaborator
                  </button>
                </form>
              </div>
            ) : (
              <p className="text-xs text-slate-600">
                Once you click <strong>Create Google Sheet</strong> in the top sync bar, the system will automatically create the live evaluation workbook and invite <strong>{PRIMARY_ADMIN_EMAIL}</strong> as an Editor.
              </p>
            )}
          </div>

          {/* SECTION 3: Firebase Project & IAM Access */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Firebase Console &amp; IAM Access</h4>
                  <p className="text-xs text-slate-500">
                    Project credentials, Authentication, &amp; Cloud Permissions
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Project Configured
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-2 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Firebase Project ID:</span>
                <span className="font-mono text-slate-800 font-semibold">gen-lang-client-0695376368</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Auth Domain:</span>
                <span className="font-mono text-slate-700">gen-lang-client-0695376368.firebaseapp.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">App-Level Super Admin:</span>
                <span className="font-mono text-emerald-700 font-bold">{PRIMARY_ADMIN_EMAIL}</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p>
                To grant direct Firebase Console management access (for checking database usage, API keys, or security rules):
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-1">
                <li>
                  Open the official{' '}
                  <a
                    href={firebaseConsoleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 font-semibold underline inline-flex items-center gap-1"
                  >
                    Firebase Console Users &amp; Permissions page
                    <ExternalLink className="w-3 h-3 inline" />
                  </a>
                </li>
                <li>Click <strong>&quot;Add member&quot;</strong> button</li>
                <li>Enter <strong>{PRIMARY_ADMIN_EMAIL}</strong></li>
                <li>Assign role: <strong>Editor</strong> or <strong>Owner</strong></li>
                <li>Click <strong>Done</strong> / <strong>Add member</strong></li>
              </ol>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={firebaseConsoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="link-open-firebase-console"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <span>Open Firebase Users &amp; Permissions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => handleCopy(firebaseConsoleUrl, 'fbConsole')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors"
              >
                {copiedLink === 'fbConsole' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Console Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Encrypted OAuth v2 &amp; Role-based access control</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
