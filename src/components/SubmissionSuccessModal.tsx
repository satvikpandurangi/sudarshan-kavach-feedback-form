import React from 'react';
import {
  CheckCircle2,
  Sparkles,
  PlusCircle,
  QrCode,
} from 'lucide-react';
import { FeedbackSubmission } from '../types';

interface SubmissionSuccessModalProps {
  submission: FeedbackSubmission | null;
  onClose: () => void;
  onSubmitAnother: () => void;
  onViewQR?: () => void;
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  submission,
  onClose,
  onSubmitAnother,
  onViewQR,
}) => {
  if (!submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Success Icon Badge */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-lg shadow-emerald-600/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Team Hayagreeva • Sudarshan Kavach</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Thank You for Your Feedback!
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
          Dear <strong>{submission.evaluatorName}</strong>, your response has been securely recorded. Team Hayagreeva appreciates your valuable time and encouragement!
        </p>

        {/* Visitor summary card */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Overall Rating:</span>
            <span className="font-bold text-amber-600">
              {'★'.repeat(submission.overallRating)} ({submission.overallRating}/5)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Verdict Given:</span>
            <span className="font-bold text-slate-800">{submission.verdict}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
            <span className="text-slate-500">Recorded At:</span>
            <span className="text-slate-600 font-medium">{submission.timestamp}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={onSubmitAnother}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/25 transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Another Feedback</span>
          </button>

          <button
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-300 transition-colors cursor-pointer"
          >
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
