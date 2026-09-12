import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  Copy,
  Check,
  Camera,
  ArrowRight,
  Smartphone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface QRCodeDisplayProps {
  onOpenScanner: () => void;
  onOpenForm: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  onOpenScanner,
  onOpenForm,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // The evaluation form URL to encode in the QR code
  const formUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?view=form&src=expo_booth`
    : 'https://sudarshan-kavach.vercel.app/';

  useEffect(() => {
    // Generate QR code onto a data URL
    const generateQr = async () => {
      try {
        const url = await QRCode.toDataURL(formUrl, {
          width: 380,
          margin: 2,
          color: {
            dark: '#090d16',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };
    generateQr();
  }, [formUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleDownloadFlyer = () => {
    // Create a high-res printable poster canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 1600);
    bgGradient.addColorStop(0, '#090d16');
    bgGradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 1600);

    // Decorative top border
    const topBar = ctx.createLinearGradient(0, 0, 1200, 0);
    topBar.addColorStop(0, '#f97316');
    topBar.addColorStop(1, '#ea580c');
    ctx.fillStyle = topBar;
    ctx.fillRect(0, 0, 1200, 24);

    // Title text
    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EXHIBITION VISITOR & JUDGE FEEDBACK', 600, 130);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 72px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SUDARSHAN KAVACH', 600, 220);

    ctx.fillStyle = '#fb923c';
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Developed by Team Hayagreeva', 600, 280);

    ctx.fillStyle = '#fdba74';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Mentor: A K Anand', 600, 320);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Prateek Deshpande • Adithi D S • K Aasritha Vardhan • Satvik Pandurangi', 600, 365);

    // White QR card background
    ctx.fillStyle = '#ffffff';
    ctx.roundRect ? ctx.roundRect(250, 430, 700, 780, 40) : ctx.fillRect(250, 430, 700, 780);
    ctx.fill();

    // Draw QR code image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = qrDataUrl;
    img.onload = () => {
      ctx.drawImage(img, 310, 480, 580, 580);

      // Card bottom instruction inside white box
      ctx.fillStyle = '#090d16';
      ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('SCAN WITH YOUR MOBILE PHONE', 600, 1120);
      ctx.fillStyle = '#64748b';
      ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('No login required • Instant 1-minute feedback', 600, 1160);

      // Footer
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('AI Cyber Safety Co-Pilot • Real-Time Threat Intelligence', 600, 1340);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '400 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Product live at: https://sudarshan-kavach.vercel.app/', 600, 1420);

      // Trigger download
      const link = document.createElement('a');
      link.download = 'Sudarshan_Kavach_Expo_Flyer.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-3 sm:py-5 px-3 sm:px-6 flex flex-col justify-center">
      {/* Main Tablet-Optimized Kiosk Card: Brand & Team on LEFT, QR Code on RIGHT */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-950/5 overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
        
        {/* LEFT COLUMN: Brand Identity & Team Hayagreeva */}
        <div className="md:col-span-7 lg:col-span-7 p-5 sm:p-7 lg:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200/80 bg-white">
          <div>
            {/* Top Exhibition Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100/90 text-orange-900 border border-orange-200/90 mb-3 w-fit">
              <QrCode className="w-3.5 h-3.5 text-orange-600" />
              <span>Exhibition Booth Visitor Evaluation Station</span>
            </div>

            {/* Brand Identity: Logo + Sudarshan Kavach */}
            <div className="flex items-center gap-3 sm:gap-4 mb-3">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#1a2030] to-[#0d1322] border border-orange-500/40 p-1.5 flex items-center justify-center shadow-lg shadow-orange-950/40 relative group">
                  <img
                    src="/sudarshan-chakra-gold.png"
                    alt="Chakra"
                    className="absolute inset-0.5 w-[90%] h-[90%] object-contain opacity-35 animate-chakra pointer-events-none"
                  />
                  <img
                    src="/sudarshan-shield-emblem.png"
                    alt="Sudarshan Kavach Emblem"
                    className="w-10 h-10 sm:w-11 sm:h-11 object-contain relative z-10 drop-shadow-[0_2px_8px_rgba(249,115,22,0.4)]"
                  />
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-500/10 text-orange-700 border border-orange-500/20 mb-1">
                  <ShieldCheck className="w-3 h-3 text-orange-600" />
                  AI-Powered Digital Safety Co-Pilot
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                  Sudarshan Kavach
                </h2>
                <p className="mt-1 text-xs text-slate-500 font-medium line-clamp-1 sm:line-clamp-none">
                  Real-time cyber safety, phishing defense &amp; UPI fraud protection
                </p>
              </div>
            </div>

            {/* Team Hayagreeva Credentials - Equal styling for all members */}
            <div className="mt-3 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-orange-50/90 via-amber-50/60 to-orange-50/80 border border-orange-200/90 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-orange-200/70">
                <span className="font-extrabold text-orange-950 text-xs tracking-wide">
                  Developed by Team Hayagreeva
                </span>
                <span className="font-bold text-amber-900 bg-white/90 px-2.5 py-0.5 rounded-full border border-amber-200 text-[11px] shadow-2xs">
                  Mentor: A K Anand
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-semibold text-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <span className="truncate">Prateek Deshpande</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <span className="truncate">Adithi D S</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <span className="truncate">K Aasritha Vardhan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <span className="truncate">Satvik Pandurangi</span>
                </div>
              </div>
            </div>

            {/* Concise 3-Step Visitor Instruction Pills */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
                  1. Point Camera
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Scan QR on right
                </div>
              </div>

              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
                  2. Rate Project
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  1 to 5 star scores
                </div>
              </div>

              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
                  3. Direct Submit
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  No login required
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons on Left Column */}
          <div className="mt-4 pt-3.5 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenForm}
              id="btn-open-form-direct"
              className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/25 transition-all active:scale-95 cursor-pointer"
            >
              <span>Open Feedback Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopy}
              id="btn-copy-qr-url"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleDownloadFlyer}
              id="btn-download-flyer"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 transition-all active:scale-95 cursor-pointer"
              title="Download printable booth poster"
            >
              <Download className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden sm:inline">Print Poster</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: High-Contrast QR Code Display Area */}
        <div className="md:col-span-5 lg:col-span-5 p-5 sm:p-7 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-orange-50/20 to-slate-50">
          {/* QR Code Container */}
          <div className="relative p-4 sm:p-4.5 bg-white rounded-2xl border-2 border-orange-500/30 shadow-xl shadow-orange-950/10 flex items-center justify-center group">
            {/* Ambient amber glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/15 to-amber-500/15 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* QR Image */}
            {qrDataUrl ? (
              <div className="relative">
                <img
                  src={qrDataUrl}
                  alt="Sudarshan Kavach Feedback QR Code"
                  className="w-52 h-52 sm:w-60 sm:h-60 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain rounded-xl"
                />
                {/* Center Badge with Sudarshan Shield */}
                <div className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-1.5 shadow-lg border border-orange-500 flex items-center justify-center">
                  <img
                    src="/sudarshan-shield-emblem.png"
                    alt="Sudarshan Shield"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="w-52 h-52 sm:w-60 sm:h-60 md:w-56 md:h-56 lg:w-64 lg:h-64 flex items-center justify-center text-slate-400 text-sm">
                Generating QR Code...
              </div>
            )}
          </div>

          {/* Prompt below QR */}
          <div className="mt-3.5 flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Point phone camera at QR code</span>
          </div>

          <p className="mt-1 text-[11px] text-slate-500 text-center">
            Scans with iOS Camera, Google Lens, or any QR app
          </p>

          {/* Quick In-App Camera Scanner Fallback Button */}
          <button
            onClick={onOpenScanner}
            id="btn-open-scanner-modal"
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-orange-400" />
            <span>Use Camera Scanner</span>
          </button>
        </div>
      </div>
    </div>
  );
};
