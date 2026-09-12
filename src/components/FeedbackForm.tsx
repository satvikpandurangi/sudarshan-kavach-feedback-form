import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Send,
  Sparkles,
  AlertCircle,
  User,
} from 'lucide-react';
import { FeedbackSubmission } from '../types';

interface FeedbackFormProps {
  onSubmitSuccess: (submission: FeedbackSubmission) => void;
}

const STRENGTH_OPTIONS = [
  'Sacred Kavach Theme & Cultural Identity',
  'Fast AI Threat & Scam Analysis',
  '1930 Cyber Crime Golden Hour Protocol',
  'UPI Fraud & QR Trap Protection',
  'APK Malware & SMS Scam Warning',
  'Citizen Privacy & Zero-Log Architecture',
  'Clean & Intuitive User Experience',
  'Clear Action Steps for Victims',
];

const VERDICTS = [
  { label: 'Top Contender / Winner', icon: '🏆', desc: 'Outstanding cyber safety innovation' },
  { label: 'Strong Finalist', icon: '🥈', desc: 'Highly practical & impressive execution' },
  { label: 'Promising Innovation', icon: '💡', desc: 'Valuable concept with high potential' },
  { label: 'Needs More Polish', icon: '🛠️', desc: 'Valuable idea needing more refinement' },
] as const;

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmitSuccess }) => {
  const [evaluatorName, setEvaluatorName] = useState('');
  const [evaluatorRole, setEvaluatorRole] = useState<FeedbackSubmission['evaluatorRole']>('Expo Visitor');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');

  // 1-5 Star Ratings
  const [overallRating, setOverallRating] = useState(5);
  const [aiThreatRating, setAiThreatRating] = useState(5);
  const [uiDesignRating, setUiDesignRating] = useState(5);
  const [innovationRating, setInnovationRating] = useState(5);

  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([
    'Sacred Kavach Theme & Cultural Identity',
    'Fast AI Threat & Scam Analysis',
    'UPI Fraud & QR Trap Protection',
  ]);

  const [comments, setComments] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [verdict, setVerdict] = useState<FeedbackSubmission['verdict']>('Top Contender / Winner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const toggleStrength = (tag: string) => {
    setSelectedStrengths((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatorName.trim()) {
      setValidationError('Please enter your name to submit feedback.');
      return;
    }
    setValidationError('');
    setIsSubmitting(true);

    const newSubmission: FeedbackSubmission = {
      id: `SK-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      evaluatorName: evaluatorName.trim(),
      evaluatorRole,
      organization: organization.trim() || 'Exhibition Visitor',
      email: email.trim(),
      overallRating,
      aiThreatRating,
      uiDesignRating,
      innovationRating,
      feasibilityRating: overallRating,
      keyStrengths: selectedStrengths,
      comments: comments.trim() || 'Evaluated during expo booth visit.',
      suggestions: suggestions.trim(),
      verdict,
      syncedToGoogleSheets: false,
    };

    setTimeout(() => {
      onSubmitSuccess(newSubmission);
      setIsSubmitting(false);
      // Reset form fields
      setEvaluatorName('');
      setOrganization('');
      setEmail('');
      setComments('');
      setSuggestions('');
    }, 350);
  };

  // Interactive Star Rating Component with high-contrast clickable targets
  const renderStarInput = (
    value: number,
    onChange: (val: number) => void,
    label: string,
    description: string,
    groupId: string
  ) => {
    return (
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-orange-300 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <span className="text-sm font-bold text-slate-800 block">{label}</span>
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                id={`rate-${groupId}-${star}`}
                key={star}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(star);
                }}
                className="p-1 rounded-lg hover:bg-orange-50 active:scale-90 transition-transform focus:outline-none cursor-pointer group"
                aria-label={`Rate ${star} out of 5 stars for ${label}`}
              >
                <Star
                  className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                    star <= value
                      ? 'text-amber-500 fill-amber-400 drop-shadow-sm'
                      : 'text-slate-300 hover:text-amber-300'
                  }`}
                />
              </button>
            ))}

            <span className="ml-2 text-xs font-extrabold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-200/80">
              {value} / 5
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 sm:px-6">
      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#131b2e] to-slate-900 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 p-2 border border-orange-500/40 flex items-center justify-center flex-shrink-0 backdrop-blur-md">
              <img
                src="/sudarshan-shield-emblem.png"
                alt="Sudarshan Kavach Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/30 text-orange-300 border border-orange-500/40">
                  Visitor Feedback
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  Team Hayagreeva
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Share Your Experience &amp; Rating
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Quick 1-minute evaluation for our exhibition visitors. Tap stars below to rate!
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7">
          {validationError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Section 1: Visitor Information */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-orange-600 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>01. Your Information</span>
              <span className="h-px bg-orange-200 flex-1" />
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={evaluatorName}
                  onChange={(e) => setEvaluatorName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Role / Profile
                </label>
                <select
                  value={evaluatorRole}
                  onChange={(e) =>
                    setEvaluatorRole(e.target.value as FeedbackSubmission['evaluatorRole'])
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm text-slate-900 bg-white"
                >
                  <option value="Expo Visitor">Expo Visitor / Attendee</option>
                  <option value="Judge">Hackathon Judge</option>
                  <option value="Mentor">Technical Mentor</option>
                  <option value="Cybersecurity Expert">Cybersecurity Specialist</option>
                  <option value="Student / Developer">Student / Developer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Organization / College / Company <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Infosys, IIT, Tech Enthusiast"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-slate-400 font-normal">(Optional for updates)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm text-slate-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Core Scoring Ratings (Interactive Clickable Stars) */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-orange-600 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>02. Evaluation Ratings (Click to Rate 1 to 5 Stars)</span>
              <span className="h-px bg-orange-200 flex-1" />
            </h3>

            <div className="space-y-3">
              {renderStarInput(
                overallRating,
                setOverallRating,
                'Overall Impression & Value',
                'General practical effectiveness of Sudarshan Kavach for Indian citizens',
                'overall'
              )}

              {renderStarInput(
                aiThreatRating,
                setAiThreatRating,
                'Scam & Threat Detection Precision',
                'Accuracy in detecting phishing links, UPI scam traps, and fake APKs',
                'threat'
              )}

              {renderStarInput(
                uiDesignRating,
                setUiDesignRating,
                'Design, Speed & Ease of Use',
                'Clarity of dashboard, responsive layout, and sacred aesthetic',
                'design'
              )}

              {renderStarInput(
                innovationRating,
                setInnovationRating,
                'Innovation & Novelty',
                'Creativity in combining 1930 Golden Hour guidance with proactive defense',
                'innovation'
              )}
            </div>
          </div>

          {/* Section 3: Highlighted Strengths */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-orange-600 mb-3 flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              <span>03. What did you like most?</span>
              <span className="h-px bg-orange-200 flex-1" />
            </h3>

            <div className="flex flex-wrap gap-2">
              {STRENGTH_OPTIONS.map((tag) => {
                const isSelected = selectedStrengths.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleStrength(tag)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25 ring-2 ring-orange-400'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Qualitative Feedback */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-orange-600 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>04. Your Comments &amp; Suggestions</span>
              <span className="h-px bg-orange-200 flex-1" />
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Comments or Feedback
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="What impressed you? Any specific feedback on our defense approach or booth demo?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Suggestions for Next Version <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  placeholder="Suggestions on new features, language support, or future improvements..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm text-slate-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Verdict */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-orange-600 mb-3 flex items-center gap-2">
              <span>05. Overall Recommendation</span>
              <span className="h-px bg-orange-200 flex-1" />
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VERDICTS.map((item) => {
                const isSelected = verdict === item.label;
                return (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => setVerdict(item.label)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5 text-center sm:text-left">
              <Sparkles className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span>
                Thank you for supporting Team Hayagreeva at the exhibition booth!
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              id="btn-submit-feedback"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
