import React, { useState } from 'react';
import {
  Search,
  Star,
  CheckCircle2,
  Clock,
  Award,
  Users,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { FeedbackSubmission } from '../types';

interface AnalyticsDashboardProps {
  submissions: FeedbackSubmission[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  submissions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [selectedSubmission, setSelectedSubmission] = useState<FeedbackSubmission | null>(null);

  // Compute metrics
  const total = submissions.length;
  const avg = (fn: (s: FeedbackSubmission) => number) =>
    total > 0 ? (submissions.reduce((acc, s) => acc + fn(s), 0) / total).toFixed(1) : '0.0';

  const avgOverall = avg((s) => s.overallRating);
  const avgAi = avg((s) => s.aiThreatRating);
  const avgUi = avg((s) => s.uiDesignRating);
  const avgInnovation = avg((s) => s.innovationRating);
  const avgFeasibility = avg((s) => s.feasibilityRating);

  const winnerCount = submissions.filter(
    (s) => s.verdict === 'Top Contender / Winner' || s.verdict === 'Strong Finalist'
  ).length;
  const recommendationRate = total > 0 ? Math.round((winnerCount / total) * 100) : 0;

  // Filtered rows
  const filteredSubmissions = submissions.filter((item) => {
    const matchesRole = roleFilter === 'All' || item.evaluatorRole === roleFilter;
    const matchesSearch =
      item.evaluatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comments.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800">
              Live Evaluation Feed
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-700">Team Hayagreeva</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Exhibition Responses &amp; Live Evaluation Scores
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated visitor impressions, feature highlights, and feedback analytics.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
            Total Responses: <strong>{total}</strong>
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Submissions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Visitors</span>
            <Users className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{total}</div>
          <p className="text-xs text-slate-500 mt-1">
            Active evaluation station
          </p>
        </div>

        {/* Average Overall Rating */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-baseline gap-1">
            <span>{avgOverall}</span>
            <span className="text-sm font-medium text-slate-400">/ 5.0</span>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            Top tier approval
          </p>
        </div>

        {/* Recommendation / Podium Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Positive Rating</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {recommendationRate}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {winnerCount} rated Winner / Finalist
          </p>
        </div>

        {/* AI Threat Defense Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">AI Threat Defense</span>
            <ShieldAlert className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-baseline gap-1">
            <span>{avgAi}</span>
            <span className="text-sm font-medium text-slate-400">/ 5.0</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Scam &amp; UPI Co-pilot Score
          </p>
        </div>
      </div>

      {/* Pillars Breakdown Chart & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Pillars Visual Bars */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
            <span>Evaluation Pillars Breakdown</span>
          </h3>

          <div className="space-y-4">
            {/* AI Cyber Threat Detection */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>AI Cyber Threat &amp; Phishing Detection</span>
                <span className="text-orange-600">{avgAi} / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(parseFloat(avgAi) / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* UI / UX & Sacred Kavach Aesthetic */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>UI / UX &amp; Sacred Kavach Aesthetic</span>
                <span className="text-orange-600">{avgUi} / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(parseFloat(avgUi) / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Innovation & 1930 Fraud Protocol */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Innovation &amp; 1930 / UPI Scam Defense</span>
                <span className="text-orange-600">{avgInnovation} / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-600 to-red-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(parseFloat(avgInnovation) / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Feasibility & Production Readiness */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Feasibility &amp; Practical Utility</span>
                <span className="text-orange-600">{avgFeasibility} / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(parseFloat(avgFeasibility) / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Verdict Distribution Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 mb-4">
            Recommendations Distribution
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Top Contender / Winner', icon: '🏆', color: 'bg-amber-500' },
              { label: 'Strong Finalist', icon: '🥈', color: 'bg-slate-400' },
              { label: 'Promising Innovation', icon: '💡', color: 'bg-orange-500' },
              { label: 'Needs More Polish', icon: '🛠️', color: 'bg-slate-300' },
            ].map((item) => {
              const count = submissions.filter((s) => s.verdict === item.label).length;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    <span>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${item.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Evaluator Feedback Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by visitor or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Role Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {['All', 'Expo Visitor', 'Judge', 'Mentor', 'Cybersecurity Expert', 'Student / Developer'].map(
              (role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    roleFilter === role
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {role}
                </button>
              )
            )}
          </div>
        </div>

        {/* Responses Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Visitor / Evaluator</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4">Key Strengths</th>
                <th className="py-3 px-4">Verdict</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Evaluator */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{sub.evaluatorName}</div>
                      <div className="text-[11px] font-normal text-slate-500">
                        {sub.organization || 'Visitor'}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          sub.evaluatorRole === 'Judge'
                            ? 'bg-purple-100 text-purple-800'
                            : sub.evaluatorRole === 'Mentor'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {sub.evaluatorRole}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span>{sub.overallRating}.0</span>
                      </div>
                    </td>

                    {/* Strengths */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="truncate text-slate-600">
                        {sub.keyStrengths.slice(0, 2).join(', ')}
                        {sub.keyStrengths.length > 2 && ` +${sub.keyStrengths.length - 2} more`}
                      </div>
                    </td>

                    {/* Verdict */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 text-[11px]">
                        {sub.verdict}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                      >
                        View Full
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No evaluations match your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Modal Drawer if an item is selected */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                  {selectedSubmission.evaluatorRole} Evaluation
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedSubmission.evaluatorName}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedSubmission.organization} • {selectedSubmission.timestamp}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-800">Overall Rating</span>
                <span className="font-extrabold text-base text-amber-600 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {selectedSubmission.overallRating} / 5.0
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block">AI Threat Detection</span>
                  <span className="font-bold text-slate-800">{selectedSubmission.aiThreatRating} / 5</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block">UI / UX Design</span>
                  <span className="font-bold text-slate-800">{selectedSubmission.uiDesignRating} / 5</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block">Innovation &amp; 1930</span>
                  <span className="font-bold text-slate-800">{selectedSubmission.innovationRating} / 5</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block">Feasibility</span>
                  <span className="font-bold text-slate-800">{selectedSubmission.feasibilityRating} / 5</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Key Strengths</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSubmission.keyStrengths.map((str) => (
                    <span
                      key={str}
                      className="px-2.5 py-1 rounded-md bg-orange-50 text-orange-800 border border-orange-200 text-xs font-semibold"
                    >
                      {str}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Visitor Observations</span>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedSubmission.comments}
                </p>
              </div>

              {selectedSubmission.suggestions && (
                <div>
                  <span className="font-bold text-slate-800 block mb-1">
                    Recommendations &amp; Suggestions
                  </span>
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                    {selectedSubmission.suggestions}
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Recommendation Given:</span>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-200">
                  {selectedSubmission.verdict}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
