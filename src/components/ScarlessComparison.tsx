import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ChevronRight, ShieldCheck, Eye, Sparkle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ScarlessComparison({ onBookClick }: { onBookClick: () => void }) {
  const [selectedMethod, setSelectedMethod] = useState<'toetva' | 'traditional'>('toetva');

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-gray-200 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#05668D]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#05668D] block mb-3 font-sans">
            Aesthetic Innovation in Thyroid Surgery
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0B2545] tracking-tight">
            Scarless TOETVA vs Traditional Surgery
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-3 font-sans max-w-xl mx-auto">
            Compare the transformative benefits of Transoral Endoscopic Thyroidectomy Vestibular Approach (TOETVA) pioneered by Dr. Adarsh Raghavan in Chennai.
          </p>

          {/* Toggle Switch */}
          <div className="inline-flex p-1.5 rounded-full bg-slate-100 border border-gray-200 mt-8 shadow-inner">
            <button
              onClick={() => setSelectedMethod('toetva')}
              className={`px-6 sm:px-8 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                selectedMethod === 'toetva'
                  ? 'bg-[#0B2545] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#0B2545]'
              }`}
            >
              <Sparkles size={14} className={selectedMethod === 'toetva' ? 'text-[#C5A059]' : ''} />
              Scarless TOETVA (Recommended)
            </button>
            <button
              onClick={() => setSelectedMethod('traditional')}
              className={`px-6 sm:px-8 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                selectedMethod === 'traditional'
                  ? 'bg-[#0B2545] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#0B2545]'
              }`}
            >
              Traditional Open Surgery
            </button>
          </div>
        </div>

        {/* Comparison Showcase Card */}
        <div className="grid lg:grid-cols-12 gap-8 items-center bg-[#FAF9F6] p-6 sm:p-10 lg:p-12 rounded-3xl border border-gray-200 card-shadow">
          {/* Left Details */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {selectedMethod === 'toetva' ? (
                <motion.div
                  key="toetva-content"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-full bg-teal-100 text-[#05668D] text-xs font-bold uppercase tracking-wider">
                      Zero Visible Neck Scars
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">• Transoral Vestibular Approach</span>
                  </div>

                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#0B2545]">
                    Natural Beauty Preserved with Magnified 4K Safety
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-sans">
                    Three micro-punctures are placed completely inside the mouth behind the lower lip. The instruments access the thyroid gland beneath the muscles, leaving the visible skin of your throat untouched.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-[#05668D] mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs text-[#0B2545] uppercase tracking-wide">0cm Visible Neck Scar</h4>
                        <p className="text-xs text-slate-500 mt-1">Oral mucosal incisions heal rapidly without external scarring.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-[#05668D] mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs text-[#0B2545] uppercase tracking-wide">High-Definition View</h4>
                        <p className="text-xs text-slate-500 mt-1">Magnifies recurrent laryngeal nerve and parathyroids for maximum preservation.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-[#05668D] mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs text-[#0B2545] uppercase tracking-wide">Rapid Normal Diet</h4>
                        <p className="text-xs text-slate-500 mt-1">Patients resume soft food within hours of surgery.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-[#05668D] mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs text-[#0B2545] uppercase tracking-wide">No Keloid Risk</h4>
                        <p className="text-xs text-slate-500 mt-1">Ideal for young adults, professionals, and keloid-prone individuals.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="traditional-content"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
                      Standard Open Incision
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">• Collar Neck Cut</span>
                  </div>

                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#0B2545]">
                    Traditional Open Collar Incision
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-sans">
                    The conventional surgical approach involves a 5 to 8 cm horizontal cut across the anterior lower neck. While safe and effective, it leaves a permanent linear scar across the throat.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-start gap-3">
                      <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs text-[#0B2545] uppercase tracking-wide">5 to 8 cm Permanent Scar</h4>
                        <p className="text-xs text-slate-500 mt-1">Collar incision across the exposed neckline.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-start gap-3">
                      <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs text-[#0B2545] uppercase tracking-wide">Hypertrophic Risk</h4>
                        <p className="text-xs text-slate-500 mt-1">Possibility of raised, dark, or thickened scars in prone skin types.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs text-[#0B2545] uppercase tracking-wide">Large Goitres</h4>
                        <p className="text-xs text-slate-500 mt-1">Necessary for massive retrosternal goitres or widely invasive cancers.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs text-[#0B2545] uppercase tracking-wide">Established Technique</h4>
                        <p className="text-xs text-slate-500 mt-1">Historically the standard surgical route for all thyroid disease.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onBookClick}
                className="px-6 py-3 rounded-full bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
              >
                Am I Eligible for TOETVA? Check With Dr. Adarsh <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Visual Comparison Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-gray-200 shadow-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#05668D]/10 text-[#05668D] flex items-center justify-center mb-4">
              <ShieldCheck size={32} />
            </div>

            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
              Endocrine Super-Specialty Protocol
            </span>
            <h4 className="font-serif font-bold text-xl text-[#0B2545] mb-2">
              Zero Compromise on Cancer Safety
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mb-6">
              TOETVA is not just cosmetic—it follows the exact same stringent oncological principles, lymph node clearance, and recurrent laryngeal nerve preservation protocols as traditional surgery.
            </p>

            <div className="w-full p-4 rounded-2xl bg-[#FAF9F6] border border-gray-100 text-left space-y-2.5 text-xs text-slate-700 font-medium">
              <div className="flex items-center justify-between">
                <span>Incision Location</span>
                <span className="font-bold text-[#05668D]">{selectedMethod === 'toetva' ? 'Behind Lower Lip' : 'Lower Front Neck'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Visible Neck Mark</span>
                <span className="font-bold text-[#05668D]">{selectedMethod === 'toetva' ? '0 cm (None)' : '5 - 8 cm Scar'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Visual Magnification</span>
                <span className="font-bold text-[#05668D]">{selectedMethod === 'toetva' ? '4K 10x Endoscope' : 'Direct / Loupes'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Hospital Stay</span>
                <span className="font-bold text-[#05668D]">24 – 48 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
