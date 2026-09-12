import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, X, Upload, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (data: string) => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Stop camera stream safely
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Start live webcam scanner
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    setScannedResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS
        await videoRef.current.play();
        setIsScanning(true);
        scanFrame();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        'Unable to access camera. Please allow camera permissions or upload an image file of the QR code.'
      );
      setActiveTab('upload');
    }
  };

  // Process frames with jsQR
  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          handleSuccess(code.data);
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  const handleSuccess = (data: string) => {
    stopCamera();
    setScannedResult(data);
    setTimeout(() => {
      onScanSuccess(data);
      onClose();
    }, 900);
  };

  // Handle uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          handleSuccess(code.data);
        } else {
          setCameraError('No valid QR code found in this image. Please try another image.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#090d16] border border-orange-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Scan Feedback QR Code</h3>
              <p className="text-xs text-slate-400">Sudarshan Kavach Hackathon Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 pt-2">
          <button
            onClick={() => setActiveTab('camera')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'camera'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {scannedResult ? (
            <div className="p-8 text-center bg-emerald-950/40 border border-emerald-500/40 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
              <h4 className="text-lg font-bold text-white mb-1">QR Code Verified!</h4>
              <p className="text-xs text-slate-300">Redirecting to evaluation form now...</p>
            </div>
          ) : activeTab === 'camera' ? (
            <div>
              {cameraError ? (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 mb-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{cameraError}</span>
                </div>
              ) : null}

              {/* Viewfinder Frame */}
              <div className="relative w-full aspect-square max-w-xs mx-auto bg-black rounded-2xl overflow-hidden border-2 border-orange-500/50 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Laser scan animation line */}
                {isScanning && (
                  <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse top-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                )}

                {/* Framing corners */}
                <div className="absolute inset-4 pointer-events-none border border-white/20 rounded-xl">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-orange-500 rounded-tl-md" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-orange-500 rounded-tr-md" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-orange-500 rounded-bl-md" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-orange-500 rounded-br-md" />
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-slate-400">
                  Align the Sudarshan Kavach QR code inside the box to scan
                </p>
                <button
                  onClick={startCamera}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restart Camera</span>
                </button>
              </div>
            </div>
          ) : (
            /* Upload Image Tab */
            <div className="text-center py-6">
              <label
                htmlFor="qr-file-upload"
                className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-orange-500/60 rounded-2xl p-8 flex flex-col items-center justify-center transition-colors bg-slate-900/40"
              >
                <Upload className="w-10 h-10 text-orange-400 mb-3" />
                <span className="text-sm font-semibold text-white mb-1">
                  Choose a QR code image
                </span>
                <span className="text-xs text-slate-400">
                  PNG, JPG, or screenshot of the QR code
                </span>
                <input
                  id="qr-file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {cameraError && (
                <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2 justify-center">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>
          )}

          {/* Fallback button to directly open form */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Want to test without camera?</span>
            <button
              onClick={() => {
                onScanSuccess('manual_trigger');
                onClose();
              }}
              className="text-orange-400 hover:text-orange-300 font-semibold"
            >
              Simulate Scan &amp; Open Form →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
