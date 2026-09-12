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
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Intro section */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200 mb-3">
          <QrCode className="w-3.5 h-3.5 text-orange-600" />
          Interactive Exhibition Booth Station
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Scan to Share Your Feedback
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Scan this QR code with any smartphone camera to open the Sudarshan Kavach feedback form. No login or password needed.
        </p>
      </div>

      {/* Main QR Card Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: QR Code Display Area */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white border-b lg:border-b-0 lg:border-r border-slate-200">
          <div className="relative p-5 bg-white rounded-2xl border-2 border-orange-500/30 shadow-2xl shadow-orange-950/10 flex items-center justify-center group">
            {/* Spinning background glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* QR Image */}
            {qrDataUrl ? (
              <div className="relative">
                <img
                  src={qrDataUrl}
                  alt="Sudarshan Kavach Feedback QR Code"
                  className="w-64 h-64 sm:w-72 sm:h-72 object-contain rounded-xl"
                />
                {/* Center Badge with Sudarshan Shield */}
                <div className="absolute inset-0 m-auto w-16 h-16 rounded-2xl bg-white p-1.5 shadow-lg border border-orange-500 flex items-center justify-center">
                  <img
                    src="/sudarshan-shield-emblem.png"
                    alt="Sudarshan Shield"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center text-slate-400 text-sm">
                Generating QR Code...
              </div>
            )}
          </div>

          {/* Prompt below QR */}
          <div className="mt-6 flex items-center gap-2 text-slate-700 text-xs sm:text-sm font-semibold">
            <Smartphone className="w-4 h-4 text-orange-600" />
            <span>Point phone camera at QR code to open form</span>
          </div>

          {/* Quick buttons under QR */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center w-full">
            <button
              onClick={handleCopy}
              id="btn-copy-qr-url"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleDownloadFlyer}
              id="btn-download-flyer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-orange-600" />
              <span>Download Printable Booth Poster</span>
            </button>
          </div>
        </div>

        {/* Right Column: Exhibition Information */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-600 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Sudarshan Kavach</h3>
                <p className="text-xs font-semibold text-orange-600">
                  Developed by Team Hayagreeva
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-sm text-slate-600">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">
                  1. Scan with Any Smartphone
                </div>
                <p className="text-xs text-slate-600">
                  Open your default camera app on iOS or Android and tap the detected link.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">
                  2. Rate &amp; Share Thoughts
                </div>
                <p className="text-xs text-slate-600">
                  Rate cyber safety features, AI speed, usability, and leave encouragement or recommendations.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">
                  3. Instant Submission
                </div>
                <p className="text-xs text-slate-600">
                  No sign-in, login, or password required. Your feedback immediately reaches Team Hayagreeva.
                </p>
              </div>
            </div>

            {/* Team Credits Box */}
            <div className="mt-5 p-3 rounded-xl bg-orange-50/70 border border-orange-200 text-xs">
              <span className="font-bold text-orange-950 block mb-1">
                Team Hayagreeva:
              </span>
              <p className="text-orange-900 font-medium">Mentor: A K Anand</p>
              <p className="text-orange-900/90 mt-0.5">
                Prateek Deshpande • Adithi D S • K Aasritha Vardhan • Satvik Pandurangi
              </p>
            </div>
          </div>

          {/* Action Callouts */}
          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onOpenForm}
              id="btn-open-form-direct"
              className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-orange-600/25 transition-all active:scale-95 cursor-pointer"
            >
              <span>Open Feedback Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenScanner}
              id="btn-open-scanner-modal"
              className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-orange-400" />
              <span>Use Camera Scanner</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
