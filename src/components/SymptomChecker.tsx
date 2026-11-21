import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, ChevronRight, RotateCcw, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuestionOption {
  label: string;
  category: string;
  recommendation: string;
}

const CONCERNS: QuestionOption[] = [
  {
    label: 'Neck swelling, thyroid lump or swallowing fullness',
    category: 'Thyroid Evaluation',
    recommendation: 'A high-resolution neck ultrasound with TIRADS classification and thyroid function tests (TSH, FT4) are strongly indicated. If nodules exceed 1-1.5cm with suspicious features, USG-guided FNAC is recommended.'
  },
  {
    label: 'Need thyroid surgery but worried about neck scar (TOETVA)',
    category: 'Scarless TOETVA Suitability',
    recommendation: 'You may be an ideal candidate for TOETVA (Transoral Endoscopic Thyroidectomy). In nodules < 4-5cm and benign or early microcarcinomas, surgery can be done via the inner lower lip with zero visible skin scars.'
  },
  {
    label: 'High blood calcium, severe bone pain or kidney stones',
    category: 'Parathyroid Workup',
    recommendation: 'Serum Calcium and intact PTH (iPTH) levels must be analyzed simultaneously to rule out Primary Hyperparathyroidism. Pre-operative Sestamibi SPECT-CT can localize the offending adenoma for a 20-minute targeted MIP procedure.'
  },
  {
    label: 'Palpitations, sweating spells, or erratic high BP',
    category: 'Adrenal Evaluation',
    recommendation: 'Plasma free metanephrines and 24-hr urinary metanephrines are indicated to evaluate for Pheochromocytoma. Minimally invasive retroperitoneoscopic adrenalectomy is the gold-standard treatment.'
  },
  {
    label: 'New breast lump, localized thickening, or discharge',
    category: 'Breast Triple Assessment',
    recommendation: 'Clinical breast examination followed by Bilateral Mammography / Breast Ultrasound and Ultrasound-guided core biopsy (if palpable) ensures definitive diagnosis. Breast conservation with oncoplastic remodeling is prioritized.'
  }
];

export default function SymptomChecker({ onBookClick }: { onBookClick: (specialty: string) => void }) {
  const [selectedConcern, setSelectedConcern] = useState<QuestionOption | null>(null);
  const [duration, setDuration] = useState<string>('');
  const [hasReports, setHasReports] = useState<string>('');
  const [showResult, setShowResult] = useState(false);

  const reset = () => {
    setSelectedConcern(null);
    setDuration('');
    setHasReports('');
    setShowResult(false);
  };

  const handleComplete = () => {
    if (!selectedConcern) return;
    setShowResult(true);
  };

  return (
    <section className="py-20 lg:py-28 bg-[#FAF9F6] border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-12 lg:p-14 shadow-xl border border-gray-200">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="px-3.5 py-1 rounded-full bg-[#05668D]/10 text-[#05668D] text-xs font-bold uppercase tracking-wider inline-block mb-3">
              Interactive Clinical Triage
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#0B2545]">
              Should You Seek an Endocrine Surgical Evaluation?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-sans">
              Select your symptom or diagnosis to receive tailored clinical guidance and next recommended steps.
            </p>
          </div>

          {!showResult ? (
            <div className="space-y-8">
              {/* Step 1: Select Concern */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2545] mb-3">
                  1. What is your primary symptom or diagnostic finding?
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {CONCERNS.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedConcern(c)}
                      className={`p-4 rounded-2xl text-left border text-xs sm:text-sm font-semibold transition-all ${
                        selectedConcern?.label === c.label
                          ? 'border-[#05668D] bg-[#F0F7F9] text-[#0B2545] shadow-xs'
                          : 'border-gray-200 bg-white hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-[#05668D] uppercase tracking-wider">
                          {c.category}
                        </span>
                        {selectedConcern?.label === c.label && (
                          <CheckCircle2 size={16} className="text-[#05668D]" />
                        )}
                      </div>
                      <p className="font-sans font-medium text-slate-800">{c.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Duration */}
              {selectedConcern && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2545] mb-3">
                    2. How long have you noticed this condition?
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {['Under 1 Month', '1 to 6 Months', 'More than 6 Months', 'Incidental on Routine Health Checkup'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          duration === d
                            ? 'border-[#0B2545] bg-[#0B2545] text-white'
                            : 'border-gray-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Prior Reports */}
              {duration && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2545] mb-3">
                    3. Do you have existing ultrasound, scan, or biopsy reports?
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {['Yes, have Ultrasound / Scans', 'Yes, have FNAC / Biopsy', 'Blood tests only', 'No tests done yet'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setHasReports(r)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          hasReports === r
                            ? 'border-[#0B2545] bg-[#0B2545] text-white'
                            : 'border-gray-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Submit Evaluation */}
              {hasReports && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                  <button
                    onClick={handleComplete}
                    className="w-full py-4 rounded-2xl bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    View Tailored Medical Recommendation <ChevronRight size={16} />
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            /* Result Summary */
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#F0F7F9] border border-[#05668D]/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 rounded-full bg-[#05668D] text-white text-xs font-bold uppercase tracking-wider">
                    {selectedConcern?.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Duration: {duration}</span>
                </div>

                <h3 className="font-serif font-bold text-xl text-[#0B2545] mb-3">
                  Clinical Action Protocol Recommended
                </h3>

                <p className="text-sm text-slate-700 leading-relaxed mb-6 font-sans">
                  {selectedConcern?.recommendation}
                </p>

                <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-center gap-3 text-xs text-slate-600">
                  <ShieldCheck size={20} className="text-[#05668D] flex-shrink-0" />
                  <span>
                    Bring all prior scans and blood investigations to your consultation at Paterson Cancer Center, SIMS Hospital, or Billroth Hospitals (R.A. Puram). Dr. Aadarsh Raghavan will personally review your films.
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  onClick={reset}
                  className="px-5 py-3 rounded-xl border border-gray-300 text-slate-600 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw size={14} /> Restart Triage
                </button>

                <button
                  onClick={() => onBookClick(selectedConcern?.category || 'Thyroid')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Calendar size={14} /> Book OPD Consultation For This Condition
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
