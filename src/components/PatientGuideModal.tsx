import React from 'react';
import { X, CheckCircle2, AlertCircle, Phone, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface GuideContent {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  overview: string;
  keyPoints: string[];
  diagnosticSteps: string[];
  surgicalAdvancement: string;
  whenToConsult: string[];
}

export const CLINICAL_GUIDES: Record<string, GuideContent> = {
  'thyroid-nodules': {
    id: 'thyroid-nodules',
    title: 'Understanding Thyroid Nodules & TIRADS Classification',
    subtitle: 'From incidental findings to evidence-based surgical precision',
    category: 'Thyroid Care',
    overview: 'Thyroid nodules are solid or fluid-filled lumps that form within your thyroid gland. While greater than 90% of thyroid nodules are benign (non-cancerous), precise risk stratification using high-resolution ultrasound and EU-TIRADS / ACR-TIRADS scoring is vital to identify malignancies early and prevent unnecessary surgery.',
    keyPoints: [
      'High-resolution neck ultrasound evaluates nodule margins, echogenicity, microcalcifications, and vascularity.',
      'TIRADS 3, 4, or 5 categories dictate whether Fine Needle Aspiration Cytology (FNAC) is indicated.',
      'Benign nodules causing mechanical compression (difficulty swallowing, breathing) or cosmetic deformity can be safely excised.',
      'Malignant nodules (Papillary, Follicular, Medullary) require expert oncological thyroidectomy with central neck clearance.'
    ],
    diagnosticSteps: [
      'Serum TSH, Free T3, and Free T4 thyroid profile',
      'High-resolution Neck Ultrasound with TIRADS grading and cervical lymph node mapping',
      'Ultrasound-guided FNAC (Bethesda System reporting)',
      'Serum Calcitonin (if medullary thyroid carcinoma is suspected)'
    ],
    surgicalAdvancement: 'Dr. Aadarsh Raghavan employs intraoperative nerve monitoring (IONM) to safeguard the Recurrent Laryngeal Nerve and parathyroid preservation protocols, ensuring safe surgery with minimal post-operative discomfort.',
    whenToConsult: [
      'Visible swelling or lump at the front/base of the neck',
      'Unexplained hoarseness of voice or persistent throat tickle',
      'Difficulty swallowing (dysphagia) or feeling of fullness when lying flat',
      'Rapidly enlarging neck nodule or nodule with swollen neck lymph nodes'
    ]
  },
  'scarless-toetva': {
    id: 'scarless-toetva',
    title: 'Scarless Thyroid Surgery: TOETVA & BABA Approaches',
    subtitle: 'Advanced endoscopic techniques leaving absolutely zero visible neck scars',
    category: 'Minimally Invasive Surgery',
    overview: 'Traditional thyroid surgery requires a 4 to 8 cm collar incision across the lower front neck. Transoral Endoscopic Thyroidectomy Vestibular Approach (TOETVA) and Bilateral Axillo-Breast Approach (BABA) allow surgical extirpation of the thyroid gland without making any cut on the visible neck skin.',
    keyPoints: [
      'In TOETVA, three microscopic ports (one 10mm, two 5mm) are placed inside the lower oral vestibule behind the lower lip.',
      'Instruments traverse beneath the subplatysmal plane directly to the thyroid gland, guided by a high-definition 4K endoscope.',
      'The inner oral mucosal incisions heal completely within days without any visible scar on the body.',
      'Provides superior visualization and magnification of the recurrent laryngeal nerve and parathyroid glands.'
    ],
    diagnosticSteps: [
      'Pre-operative ultrasound evaluation of nodule size (ideally < 4-5 cm) and gland volume (< 30-40 ml)',
      'FNAC confirmation of benign nodule, follicular lesion, or early well-differentiated papillary thyroid microcarcinoma',
      'Assessment of oral hygiene and absence of neck irradiation history'
    ],
    surgicalAdvancement: 'Dr. Aadarsh Raghavan has specialized training in scarless endoscopic endocrine procedures, offering patients an optimal fusion of rigorous oncological safety and pristine cosmetic satisfaction.',
    whenToConsult: [
      'Patients seeking thyroid surgery without wanting a visible collar scar on the neck',
      'Professionals, young adults, and individuals prone to keloid/hypertrophic scarring',
      'Thyroid nodules measuring under 4–5 cm that require definitive surgical removal'
    ]
  },
  'hyperparathyroidism': {
    id: 'hyperparathyroidism',
    title: 'Primary & Secondary Hyperparathyroidism & Bone-Calcium Health',
    subtitle: 'Resolving hidden calcium imbalances, recurrent kidney stones & bone fragility',
    category: 'Parathyroid Care',
    overview: 'The four pea-sized parathyroid glands behind the thyroid regulate calcium and phosphate homeostasis. When one or more glands become overactive (usually an adenoma), excessive Parathyroid Hormone (PTH) leaches calcium from bones into the bloodstream, triggering kidney stones, severe osteoporosis, abdominal pain, and cognitive fatigue ("bones, stones, abdominal groans, and psychiatric moans").',
    keyPoints: [
      'Primary Hyperparathyroidism is overwhelmingly caused by a solitary benign parathyroid adenoma (85%).',
      'Secondary & Tertiary Hyperparathyroidism commonly develop in patients with chronic kidney disease (CKD) on dialysis.',
      'Minimally Invasive Parathyroidectomy (MIP) targets only the abnormal gland through a tiny 2 cm incision under precise localization.',
      'Cure rates exceed 98% in experienced endocrine surgical hands, with instant normalization of PTH levels.'
    ],
    diagnosticSteps: [
      'Simultaneous fasting Serum Calcium, Ionized Calcium, and intact PTH (iPTH)',
      '24-Hour Urinary Calcium excretion (to exclude Familial Hypocalciuric Hypercalcemia)',
      'Dual-phase 99mTc-Sestamibi SPECT-CT scan',
      'High-resolution 4D-CT of the neck / parathyroid ultrasound'
    ],
    surgicalAdvancement: 'Dr. Aadarsh Raghavan utilizes focused parathyroidectomy with intraoperative PTH monitoring and gamma probe localization, drastically minimizing operative time and tissue trauma.',
    whenToConsult: [
      'Routine blood checkup showing elevated Serum Calcium (> 10.2 mg/dL)',
      'Recurrent kidney stones (nephrolithiasis) or nephrocalcinosis',
      'Unexplained severe bone density loss (osteopenia/osteoporosis) or fragility fractures',
      'Persistent unexplained fatigue, joint aches, muscle weakness, and depression'
    ]
  },
  'nerve-safety': {
    id: 'nerve-safety',
    title: 'Vocal Cord Safety & Recurrent Laryngeal Nerve Protocol',
    subtitle: 'Protecting your voice and airway with Intraoperative Neuromonitoring (IONM)',
    category: 'Surgical Protocols',
    overview: 'The Recurrent Laryngeal Nerve (RLN) and the External Branch of the Superior Laryngeal Nerve (EBSLN) run in intimate proximity to the thyroid capsule and inferior thyroid artery. In specialized endocrine surgery, preservation of these nerves is non-negotiable to maintain voice quality, singing pitch, and normal breathing.',
    keyPoints: [
      'Visual identification is the gold standard: the surgeon dissects and traces the nerve along its entire cervical course.',
      'Intraoperative Neuromonitoring (IONM) provides real-time functional electromyographic verification of nerve conductibility.',
      'Loss of signal protocols prevent bilateral vocal cord palsy during simultaneous total thyroidectomy.',
      'Gentle capsular dissection prevents traction, thermal, or ischemic damage to nerve fibers.'
    ],
    diagnosticSteps: [
      'Pre-operative Indirect Laryngoscopy (IDL) or Video Laryngostroboscopy to document vocal cord baseline mobility',
      'Post-operative vocal assessment and fiberoptic laryngoscopy',
      'Dedicated neuromonitoring endotracheal tube placement with electrode sensors aligned to the vocal cords'
    ],
    surgicalAdvancement: 'At SIMS Hospital, Paterson Cancer Center, and Billroth Hospitals, Dr. Aadarsh Raghavan incorporates dedicated IONM technology for every complex, reoperative, and thyroid malignancy case to ensure maximum phonatory preservation.',
    whenToConsult: [
      'Singers, teachers, lecturers, and voice professionals undergoing thyroid surgery',
      'Patients with large goitres extending deep into the thoracic inlet (retrosternal goitre)',
      'Previous neck surgery or suspected invasive thyroid malignancy'
    ]
  },
  'breast-wellness': {
    id: 'breast-wellness',
    title: 'Breast Lump Assessment & Oncoplastic Breast Conservation',
    subtitle: 'Harmonizing oncological clearance with breast preservation and aesthetic harmony',
    category: 'Breast Surgery',
    overview: 'A breast lump should never be ignored, but finding one is not an automatic diagnosis of cancer. With standard Triple Assessment (Clinical Exam, Digital Mammography / Breast Ultrasound, and Core Needle Biopsy), an exact diagnosis is established promptly. When malignancy is present, modern Oncoplastic Breast Surgery allows tumors to be cleared while reshaping the natural breast.',
    keyPoints: [
      'Triple assessment provides 99% diagnostic accuracy before any therapeutic intervention.',
      'Breast Conservation Surgery (Lumpectomy / Wide Local Excision) combined with radiotherapy yields survival rates equal to total mastectomy.',
      'Oncoplastic surgery utilizes plastic surgery volume-displacement and replacement techniques to prevent post-lumpectomy deformities.',
      'Sentinel Lymph Node Biopsy (SLNB) eliminates complete armpit clearance in early-stage disease, avoiding lymphedema swelling.'
    ],
    diagnosticSteps: [
      'Clinical breast examination by an endocrine/breast surgeon',
      'Digital Bilateral Mammogram with 3D Tomosynthesis (age > 40) or Breast Ultrasound (age < 40)',
      'Ultrasound-guided Core Needle Biopsy (CNB) with receptor status (ER, PR, HER2-neu, Ki-67)'
    ],
    surgicalAdvancement: 'Dr. Aadarsh Raghavan specializes in level 1 and level 2 oncoplastic remodeling, nipple-sparing mastectomies, and scar-hidden incisions around the periareolar and inframammary margins.',
    whenToConsult: [
      'Any painless, firm, or new lump in either breast or underarm armpit',
      'Spontaneous blood-stained or clear watery nipple discharge',
      'Skin dimpling, puckering, or nipple retraction (turning inward)',
      'Strong family history of breast, ovarian, or endocrine tumors (BRCA testing consideration)'
    ]
  }
};

interface PatientGuideModalProps {
  guideId: string | null;
  onClose: () => void;
  onBookClick: () => void;
}

export default function PatientGuideModal({ guideId, onClose, onBookClick }: PatientGuideModalProps) {
  if (!guideId || !CLINICAL_GUIDES[guideId]) return null;
  const guide = CLINICAL_GUIDES[guideId];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col border border-gray-100"
        >
          {/* Header */}
          <div className="bg-[#0B2545] text-white p-6 sm:p-8 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <span className="inline-block px-3 py-1 bg-[#05668D] text-white text-[11px] font-bold uppercase tracking-wider rounded-full mb-3">
              {guide.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug pr-8">
              {guide.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 font-sans italic">
              {guide.subtitle}
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
            {/* Overview */}
            <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#05668D] mb-2">Clinical Overview</h4>
              <p className="text-slate-700">{guide.overview}</p>
            </div>

            {/* Key Clinical Points */}
            <div>
              <h4 className="text-sm font-bold text-[#0B2545] uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#05668D]" /> Key Medical Facts
              </h4>
              <ul className="space-y-2.5">
                {guide.keyPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 flex-shrink-0"></span>
                    <span className="text-slate-700">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Diagnostic Protocol */}
            <div className="bg-[#F0F7F9] p-5 rounded-2xl border border-[#05668D]/15">
              <h4 className="text-sm font-bold text-[#05668D] uppercase tracking-wider mb-3">
                Recommended Diagnostic Workup
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {guide.diagnosticSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-800 bg-white p-3 rounded-xl shadow-xs">
                    <span className="w-5 h-5 rounded-full bg-[#05668D]/10 text-[#05668D] font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Surgical Edge */}
            <div className="border-l-4 border-[#C5A059] pl-4 py-2 bg-[#FDF9F0] rounded-r-xl">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#0B2545] mb-1">
                Surgical Precision by Dr. Aadarsh Raghavan
              </h4>
              <p className="text-xs sm:text-sm text-slate-800 italic">
                {guide.surgicalAdvancement}
              </p>
            </div>

            {/* Warning Signs / When to Consult */}
            <div>
              <h4 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-600" /> When Should You Seek Immediate Evaluation?
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                {guide.whenToConsult.map((warn, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-slate-700">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              Have doubts regarding your ultrasound, FNAC, or scan report?
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="tel:+919840000000"
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-200 text-[#0B2545] font-bold text-xs flex items-center justify-center gap-2 hover:bg-white transition-colors"
              >
                <Phone size={14} /> Call Helpline
              </a>
              <button
                onClick={() => {
                  onClose();
                  onBookClick();
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#0B2545] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#13315C] transition-colors shadow-md"
              >
                <Calendar size={14} /> Schedule Consultation
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
