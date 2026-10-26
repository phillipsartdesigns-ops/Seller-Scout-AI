import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Lightbulb, 
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Video,
  ExternalLink
} from 'lucide-react';
import { DEFAULT_LAUNCH_STEPS } from '../data/plans';
import { LaunchStep } from '../types';

interface LaunchChecklistTabProps {
  onNavigateTab: (tab: 'scout' | 'listing' | 'flip' | 'pricing') => void;
}

export const LaunchChecklistTab: React.FC<LaunchChecklistTabProps> = ({
  onNavigateTab,
}) => {
  const [steps, setSteps] = useState<LaunchStep[]>(() => {
    try {
      const saved = localStorage.getItem('seller_scout_launch_steps');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_LAUNCH_STEPS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('seller_scout_launch_steps', JSON.stringify(steps));
    } catch {}
  }, [steps]);

  const toggleStep = (id: number) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, completed: !step.completed } : step
      )
    );
  };

  const resetAll = () => {
    setSteps(DEFAULT_LAUNCH_STEPS.map((s) => ({ ...s, completed: s.id <= 2 })));
  };

  const completedCount = steps.filter((s) => s.completed).length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  const phases = [
    'Phase 1: Validation & Sourcing',
    'Phase 2: Branding & Listing',
    'Phase 3: Launch & Scale',
  ] as const;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
              <Layers className="w-3.5 h-3.5" />
              Interactive E-Commerce Launch Playbook
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Follow these 12 steps from idea to your next winning product.
            </h1>
            <p className="text-slate-300 text-sm">
              Your progress saves automatically in real-time. Follow the proven blueprint to eliminate risk, integrate Stripe recurring payments, and secure your first 100 sales.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl min-w-[240px] w-full md:w-auto space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Launch Readiness</span>
              <span className="font-extrabold text-emerald-400 text-base">{percentage}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>{completedCount} of {steps.length} Steps Completed</span>
              <button
                onClick={resetAll}
                className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                title="Reset progress"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step Phases */}
      <div className="space-y-8">
        {phases.map((phase, pIdx) => {
          const phaseSteps = steps.filter((s) => s.phase === phase);
          const phaseCompleted = phaseSteps.filter((s) => s.completed).length;

          return (
            <div key={pIdx} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30">
                    {pIdx + 1}
                  </span>
                  <span>{phase}</span>
                </h2>
                <span className="text-xs text-slate-400">
                  {phaseCompleted} / {phaseSteps.length} Complete
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phaseSteps.map((step) => (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`rounded-2xl p-5 border transition-all cursor-pointer select-none group flex flex-col justify-between ${
                      step.completed
                        ? 'bg-slate-900/60 border-emerald-500/40 opacity-90'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          className="mt-0.5 shrink-0 text-emerald-400 group-hover:scale-110 transition-transform"
                        >
                          {step.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-600 group-hover:text-slate-400" />
                          )}
                        </button>
                        <div>
                          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-0.5">
                            Step #{step.id}
                          </div>
                          <h3 className={`text-sm font-bold ${step.completed ? 'text-slate-300 line-through' : 'text-white'}`}>
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 pl-8 leading-relaxed">
                        {step.description}
                      </p>

                      <div className="pl-8 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                        <strong className="text-emerald-300">Action Item: </strong>
                        <span className="text-slate-300">{step.actionItem}</span>
                      </div>

                      {step.proTip && (
                        <div className="pl-8 text-[11px] text-amber-300/90 flex items-start gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>Pro Tip: </strong>
                            {step.proTip}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quick navigation helpers */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 pl-8 flex items-center justify-between text-xs">
                      {step.id === 2 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateTab('scout');
                          }}
                          className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                        >
                          <span>Open Product Scout</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                      {step.id === 6 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateTab('listing');
                          }}
                          className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                        >
                          <span>Open Listing Builder</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                      {step.id === 8 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateTab('pricing');
                          }}
                          className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>View Subscription Plans & Trials</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                      {step.id === 9 && (
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateTab('listing');
                            }}
                            className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                          >
                            <span>View TikTok Scripts</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          <a
                            href="https://www.tiktok.com/tiktokstudio"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2.5 py-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-semibold flex items-center gap-1 transition-all"
                          >
                            <Video className="w-3 h-3" />
                            <span>Open TikTok Studio</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      )}
                      {!([2, 6, 8, 9].includes(step.id)) && (
                        <span className="text-[11px] text-slate-500">
                          {step.completed ? 'Completed' : 'Click card to check off'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
