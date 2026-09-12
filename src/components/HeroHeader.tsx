import React from 'react';
import { QrCode, ShieldCheck, Camera, Sparkles, Lock } from 'lucide-react';

interface HeroHeaderProps {
  activeTab: 'form' | 'qr';
  setActiveTab: (tab: 'form' | 'qr') => void;
  onOpenScanner: () => void;
  onOpenAdminModal: () => void;
  isAdminSignedIn: boolean;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenScanner,
  onOpenAdminModal,
  isAdminSignedIn,
}) => {
  return (
    <header className="w-full bg-[#090d16] text-white border-b border-orange-500/20 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      {/* Top Banner with Clean Exhibition Message and Discreet Admin Trigger */}
      <div className="w-full bg-gradient-to-r from-orange-600/25 via-amber-500/20 to-orange-600/25 border-b border-orange-500/30 px-3 sm:px-4 py-1 text-[11px] sm:text-xs text-orange-200 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold tracking-wide">
            Official Exhibition Feedback &amp; Visitor Evaluation Portal
          </span>
          <span className="hidden sm:inline text-orange-400/80">•</span>
          <span className="hidden sm:inline text-orange-300/80">Team Hayagreeva Exhibition Booth</span>
        </div>

        {/* Discreet Admin Lock Button for Team Organizers Only */}
        <button
          onClick={onOpenAdminModal}
          id="btn-admin-panel-trigger"
          className="p-1 rounded-md text-orange-300/60 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          title="Team Admin Area"
          aria-label="Admin Access"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* When on QR Tab: Sleek, compact kiosk header so the QR display fits tablet screen */}
      {activeTab === 'qr' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#131a29] border border-orange-500/40 p-1 flex items-center justify-center flex-shrink-0 relative">
                <img
                  src="/sudarshan-chakra-gold.png"
                  alt="Chakra"
                  className="absolute inset-0.5 w-[90%] h-[90%] object-contain opacity-30 animate-chakra pointer-events-none"
                />
                <img
                  src="/sudarshan-shield-emblem.png"
                  alt="Sudarshan Kavach Logo"
                  className="w-7 h-7 object-contain relative z-10"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                    Sudarshan Kavach
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    Booth Display
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Team Hayagreeva • Exhibition Visitor Feedback Station
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('form')}
                id="nav-tab-form"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Feedback Form</span>
              </button>

              <button
                onClick={() => setActiveTab('qr')}
                id="nav-tab-qr"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-900/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Expo QR Display</span>
              </button>
            </nav>

            {/* Quick Camera Scanner Button */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onOpenScanner}
                id="header-btn-scan-camera"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan QR</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* When on Form Tab: Full Hero Header with Product and Team Context */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left: Product Logo & Team Hayagreeva info */}
            <div className="flex items-center gap-5 text-center lg:text-left">
              {/* Logo Emblem Container with Chakra */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-[#1a2030] to-[#0d1322] border border-orange-500/40 p-2 flex items-center justify-center shadow-xl shadow-orange-950/50 relative group">
                  {/* Spinning Chakra background */}
                  <img
                    src="/sudarshan-chakra-gold.png"
                    alt="Sacred Sudarshan Chakra"
                    className="absolute inset-1 w-[90%] h-[90%] object-contain opacity-40 animate-chakra pointer-events-none"
                  />
                  {/* Foreground Shield Emblem */}
                  <img
                    src="/sudarshan-shield-emblem.png"
                    alt="Sudarshan Kavach Logo"
                    className="w-14 h-14 object-contain relative z-10 drop-shadow-[0_4px_12px_rgba(249,115,22,0.4)]"
                  />
                </div>
              </div>

              {/* Title & Team Credentials */}
              <div>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                    AI-Powered Digital Safety Co-Pilot
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-500/30">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Team Hayagreeva
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center lg:justify-start gap-2">
                  <span>Sudarshan Kavach</span>
                </h1>

                <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
                  Cyber threat detection, phishing defense &amp; UPI safety co-pilot. We warmly invite our exhibition visitors to share your feedback.
                </p>

                {/* Exact Team Hayagreeva Details with Mentor - Equal styling for all members */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 max-w-2xl text-left">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
                    <span className="font-bold text-orange-400">Developed by Team Hayagreeva:</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-amber-300 font-semibold">Mentor: A K Anand</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-slate-200">
                    <span className="font-medium">• Prateek Deshpande</span>
                    <span className="font-medium">• Adithi D S</span>
                    <span className="font-medium">• K Aasritha Vardhan</span>
                    <span className="font-medium">• Satvik Pandurangi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Public Visitor Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setActiveTab('qr')}
                id="header-btn-qr"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white text-sm font-semibold border border-slate-700 hover:border-orange-500/50 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-orange-400" />
                <span>Booth QR Code</span>
              </button>

              <button
                onClick={onOpenScanner}
                id="header-btn-scan-camera"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold shadow-lg shadow-orange-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Scan QR Code</span>
              </button>
            </div>
          </div>

          {/* Public Navigation Tabs Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-3.5 gap-3">
            <nav className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('form')}
                id="nav-tab-form"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'form'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Feedback Form</span>
              </button>

              <button
                onClick={() => setActiveTab('qr')}
                id="nav-tab-qr"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'qr'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Expo QR Display</span>
              </button>
            </nav>

            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium bg-slate-900/80 text-slate-300 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Visitor Evaluation Station
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
