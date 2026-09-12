import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  ShieldCheck,
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  Lock,
  LogOut,
  Database,
  Users,
  CheckCircle2,
  AlertTriangle,
  Mail,
  X,
  Share2,
  KeyRound,
  Eye,
  EyeOff,
  BarChart3,
  Star,
  Search,
} from 'lucide-react';
import { GoogleSheetsConfig, FeedbackSubmission } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  accessToken: string | null;
  sheetsConfig: GoogleSheetsConfig | null;
  pendingSyncCount: number;
  totalSubmissions: number;
  submissions: FeedbackSubmission[];
  onSignIn: () => void;
  onSignOut: () => void;
  onCreateSheet: () => void;
  onSyncPending: () => void;
  onExportExcel: () => void;
  isLoading: boolean;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  accessToken,
  sheetsConfig,
  pendingSyncCount,
  totalSubmissions,
  submissions,
  onSignIn,
  onSignOut,
  onCreateSheet,
  onSyncPending,
  onExportExcel,
  isLoading,
}) => {
  // Passcode gate state: Only authenticated admin or PIN unlock can view/manage
  const [pinInput, setPinInput] = useState('');
  const [isPinUnlocked, setIsPinUnlocked] = useState(false);
  const [pinError, setPinError] = useState('');
  const [adminTab, setAdminTab] = useState<'overview' | 'responses' | 'sync'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedSubmission, setSelectedSubmission] = useState<FeedbackSubmission | null>(null);

  if (!isOpen) return null;

  // The admin is authorized if signed in with Google or if PIN (1930 or hayagreeva) is entered
  const isGoogleAuthorized =
    currentUser?.email?.toLowerCase() === 'satvikpandurangi07@gmail.com';

  const isUnlocked = isGoogleAuthorized || isPinUnlocked;

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim().toLowerCase();
    // 1930 is the National Cyber Crime Helpline / project PIN, or 'hayagreeva', or 'admin1930'
    if (cleanPin === '1930' || cleanPin === 'hayagreeva' || cleanPin === 'kavach2026') {
      setIsPinUnlocked(true);
      setPinError('');
    } else {
      setPinError('Incorrect security key. Please try again or sign in with Google.');
    }
  };

  // Filtered submissions for admin view
  const filteredSubmissions = submissions.filter((item) => {
    const matchesRole = roleFilter === 'All' || item.evaluatorRole === roleFilter;
    const matchesSearch =
      item.evaluatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comments.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0b1120] text-white rounded-3xl max-w-4xl w-full border border-slate-700/80 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-[#111c34] to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Restricted Access
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">Team Hayagreeva</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                Admin Portal &amp; Responses Hub
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Locked, show Security Gate */}
        {!isUnlocked ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 flex-1 overflow-y-auto">
            <div className="w-16 h-16 rounded-3xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-inner">
              <KeyRound className="w-8 h-8" />
            </div>

            <div className="max-w-md">
              <h4 className="text-xl font-bold text-white">Admin Authentication Required</h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                This portal and all submitted visitor responses are strictly restricted to team administrators. Public exhibition attendees cannot view feedback data.
              </p>
            </div>

            {/* Option A: Admin PIN Form */}
            <form onSubmit={handleUnlockPin} className="w-full max-w-sm space-y-3">
              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Enter Admin Passkey (Helpline PIN 1930)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter PIN..."
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      if (pinError) setPinError('');
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Unlock
                  </button>
                </div>
                {pinError && <p className="text-xs text-red-400 mt-1.5">{pinError}</p>}
              </div>
            </form>

            <div className="flex items-center gap-3 w-full max-w-sm">
              <div className="h-px bg-slate-800 flex-1" />
              <span className="text-xs text-slate-500 uppercase tracking-wider">or</span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            {/* Option B: Google Sign In */}
            <div>
              <button
                onClick={onSignIn}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-orange-400" />
                <span>{isLoading ? 'Authenticating...' : 'Sign in with Google'}</span>
              </button>
              <p className="text-[11px] text-slate-500 mt-2">
                Authorized: satvikpandurangi07@gmail.com
              </p>
            </div>
          </div>
        ) : (
          /* Unlocked Admin Dashboard */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Sub-Nav Tabs for Admin */}
            <div className="px-6 pt-3 pb-0 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAdminTab('overview')}
                  className={`px-3.5 py-2 rounded-t-xl text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    adminTab === 'overview'
                      ? 'text-orange-400 border-orange-500 bg-slate-800/60'
                      : 'text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  Sync &amp; Integrations
                </button>

                <button
                  onClick={() => setAdminTab('responses')}
                  className={`px-3.5 py-2 rounded-t-xl text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    adminTab === 'responses'
                      ? 'text-orange-400 border-orange-500 bg-slate-800/60'
                      : 'text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Visitor Responses ({totalSubmissions})</span>
                </button>
              </div>

              <div className="flex items-center gap-2 pb-2">
                <span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Admin Authenticated
                </span>
                {currentUser && (
                  <button
                    onClick={onSignOut}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm text-slate-300">
              {/* TAB 1: OVERVIEW & INTEGRATIONS */}
              {adminTab === 'overview' && (
                <div className="space-y-6">
                  {/* Google Sheets Sync Card */}
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white text-sm">Google Sheets Live Synchronization</span>
                      </div>

                      {sheetsConfig && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 font-semibold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Connected &amp; Live
                        </span>
                      )}
                    </div>

                    {sheetsConfig ? (
                      <div className="space-y-3">
                        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs flex items-center justify-between gap-3">
                          <div className="truncate">
                            <span className="text-slate-400 block text-[11px]">Active Evaluation Spreadsheet</span>
                            <span className="font-semibold text-white truncate block">
                              {sheetsConfig.sheetTitle}
                            </span>
                          </div>
                          <a
                            href={sheetsConfig.spreadsheetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex-shrink-0 cursor-pointer"
                          >
                            <span>Open Google Sheet</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="text-xs text-slate-400">
                            Pending rows to sync: <strong className="text-white">{pendingSyncCount}</strong>
                          </div>

                          <button
                            onClick={onSyncPending}
                            disabled={isLoading || !accessToken || pendingSyncCount === 0}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-all disabled:opacity-40 cursor-pointer"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                            <span>Sync All Submissions Now</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-3">
                        <p className="text-slate-300">
                          Create a dedicated Google Sheet to record all visitor ratings and comments in real-time.
                        </p>
                        <button
                          onClick={onCreateSheet}
                          disabled={isLoading}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>{isLoading ? 'Creating...' : 'Create / Connect Google Sheet'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Excel Export Card */}
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white text-sm">Offline Excel Spreadsheet (.xlsx)</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Export all {totalSubmissions} visitor records with ratings breakdown for offline analysis or jury presentation.
                      </p>
                    </div>

                    <button
                      onClick={onExportExcel}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex-shrink-0 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
                      <span>Download .xlsx File</span>
                    </button>
                  </div>

                  {/* Firebase Firestore Status Card */}
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-orange-400" />
                        <span className="font-bold text-white text-sm">Firebase Cloud Database</span>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Cloud Real-Time Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700">
                        <span className="text-slate-400 block text-[11px]">Database Instance</span>
                        <span className="font-bold text-white">Cloud Firestore Live</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700">
                        <span className="text-slate-400 block text-[11px]">Database Security</span>
                        <span className="font-bold text-emerald-400">Public Form Writes • Admin Reads</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RESPONSES LIST (RESTRICTED TO ADMIN) */}
              {adminTab === 'responses' && (
                <div className="space-y-4">
                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search responses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                      {['All', 'Expo Visitor', 'Judge', 'Mentor', 'Cybersecurity Expert', 'Student / Developer'].map(
                        (role) => (
                          <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              roleFilter === role
                                ? 'bg-orange-600 text-white'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {role}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Submissions Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-800/80 border-b border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          <th className="py-3 px-4">Visitor / Organization</th>
                          <th className="py-3 px-4">Role</th>
                          <th className="py-3 px-4">Score</th>
                          <th className="py-3 px-4">Verdict</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {filteredSubmissions.length > 0 ? (
                          filteredSubmissions.map((sub) => (
                            <tr key={sub.id} className="hover:bg-slate-800/50 transition-colors">
                              <td className="py-3 px-4 font-semibold text-white">
                                <div>{sub.evaluatorName}</div>
                                <div className="text-[11px] font-normal text-slate-400">
                                  {sub.organization || 'Visitor'} {sub.email && `• ${sub.email}`}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-orange-300 border border-slate-700">
                                  {sub.evaluatorRole}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1 font-bold text-amber-400">
                                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                                  <span>{sub.overallRating}.0</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-slate-300 font-medium">
                                {sub.verdict}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => setSelectedSubmission(sub)}
                                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-orange-400 hover:bg-orange-500/10 transition-colors cursor-pointer"
                                >
                                  View Full
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                              No responses matching your filter.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Detail Modal if row selected */}
            {selectedSubmission && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-xs text-slate-300 space-y-3 max-h-[85vh] overflow-y-auto">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {selectedSubmission.evaluatorName}
                      </h4>
                      <p className="text-slate-400">
                        {selectedSubmission.evaluatorRole} • {selectedSubmission.organization}
                      </p>
                      {selectedSubmission.email && (
                        <p className="text-orange-400 mt-0.5">{selectedSubmission.email}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedSubmission(null)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded-lg bg-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">Overall</span>
                      <span className="font-bold text-amber-400 text-sm">
                        {selectedSubmission.overallRating} / 5
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">AI Threat Defense</span>
                      <span className="font-bold text-white text-sm">
                        {selectedSubmission.aiThreatRating} / 5
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">UI Design</span>
                      <span className="font-bold text-white text-sm">
                        {selectedSubmission.uiDesignRating} / 5
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">Innovation</span>
                      <span className="font-bold text-white text-sm">
                        {selectedSubmission.innovationRating} / 5
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-white block mb-1">Observations:</span>
                    <p className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200">
                      {selectedSubmission.comments}
                    </p>
                  </div>

                  {selectedSubmission.suggestions && (
                    <div>
                      <span className="font-bold text-white block mb-1">Suggestions:</span>
                      <p className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200">
                        {selectedSubmission.suggestions}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedSubmission(null)}
                      className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Sudarshan Kavach Admin Engine</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
