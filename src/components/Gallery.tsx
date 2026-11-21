import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Film, Lock, Award, Eye, X, ZoomIn, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaItem } from './AdminPanel';

interface DefaultCase {
  id: string;
  title: string;
  category: string;
  type: 'image' | 'video';
  imageUrl: string;
  tag: string;
  clinicalNote: string;
}

const DEFAULT_CLINICAL_CASES: DefaultCase[] = [
  {
    id: 'case-1',
    title: 'TOETVA Scarless Endoscopic Thyroidectomy',
    category: 'Scarless TOETVA',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    tag: 'Minimally Invasive',
    clinicalNote: 'Successful transoral endoscopic hemithyroidectomy for a 3.8 cm follicular neoplasm. Gland extracted through vestibular port with pristine cosmetic outcome and no visible neck scar.'
  },
  {
    id: 'case-2',
    title: 'Total Thyroidectomy with Central Neck Dissection',
    category: 'Thyroid & Parathyroid',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
    tag: 'Oncological Precision',
    clinicalNote: 'Total thyroidectomy with bilateral Level VI central compartment lymph node dissection for Papillary Thyroid Carcinoma. Continuous IONM confirmed 100% preservation of bilateral recurrent laryngeal nerves.'
  },
  {
    id: 'case-3',
    title: 'Focused Minimally Invasive Parathyroidectomy (MIP)',
    category: 'Thyroid & Parathyroid',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    tag: 'Targeted Gland Excision',
    clinicalNote: 'Targeted excision of a left inferior parathyroid adenoma guided by pre-operative 99mTc-Sestamibi SPECT-CT. Intraoperative PTH dropped by >80% at 10 minutes post-excision.'
  },
  {
    id: 'case-4',
    title: 'Retroperitoneoscopic Adrenalectomy for Pheochromocytoma',
    category: 'Adrenal Surgery',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    tag: 'Keyhole Adrenal',
    clinicalNote: 'Posterior retroperitoneoscopic resection of a 4.5 cm functional right adrenal pheochromocytoma. Stable intraoperative hemodynamics with minimal post-operative recovery time.'
  },
  {
    id: 'case-5',
    title: 'Oncoplastic Breast Conservation Surgery (BCS)',
    category: 'Breast Oncoplasty',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
    tag: 'Aesthetic Restoration',
    clinicalNote: 'Wide local excision with dual-pedicle oncoplastic volume displacement and sentinel lymph node biopsy for upper outer quadrant breast carcinoma, achieving negative margins and natural contour.'
  },
  {
    id: 'case-6',
    title: 'Japan Surgical Society (JSS) Best Paper Award',
    category: 'Academic & Awards',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    tag: 'International Honor',
    clinicalNote: 'Prestigious Travel Grant Award presented to Dr. Aadarsh Raghavan for peer-reviewed research presentation on advanced surgical techniques in endocrine tumors at the international congress.'
  }
];

interface GalleryProps {
  onOpenAdmin: () => void;
  refreshTrigger?: number;
}

export default function Gallery({ onOpenAdmin, refreshTrigger }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [serverMedia, setServerMedia] = useState<MediaItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    category: string;
    url: string;
    note: string;
  } | null>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setServerMedia(data);
      }
    } catch {
      // In offline mode, defaults render cleanly
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [refreshTrigger]);

  const categories = [
    'All',
    'Thyroid & Parathyroid',
    'Scarless TOETVA',
    'Adrenal Surgery',
    'Breast Oncoplasty',
    'Academic & Awards'
  ];

  // Combined cases
  const dynamicCases = serverMedia.map(m => ({
    id: `dyn-${m.id}`,
    title: m.title || m.filename,
    category: m.category || 'Clinical Gallery',
    type: (m.type.includes('video') ? 'video' : 'image') as 'image' | 'video',
    imageUrl: `/uploads/${m.filename}`,
    tag: 'Verified Case',
    clinicalNote: 'Clinical case documentation managed via the Dr. Aadarsh Raghavan Practice Portal.'
  }));

  const allCases = [...dynamicCases, ...DEFAULT_CLINICAL_CASES];

  const filteredCases = selectedCategory === 'All'
    ? allCases
    : allCases.filter(c => c.category.toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase().includes(c.category.toLowerCase()));

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[#FAF9F6] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#05668D] font-sans block mb-3">
              Clinical Excellence & Research
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0B2545] tracking-tight">
              Surgical & Academic Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl font-sans">
              Visual overview of advanced endocrine procedures, intraoperative neuromonitoring protocols, and academic contributions in Chennai.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2.5 rounded-xl border border-gray-300 hover:border-[#05668D] bg-white text-[#0B2545] font-bold text-xs flex items-center gap-2 shadow-xs hover:shadow-md transition-all group"
            >
              <Lock size={14} className="text-[#05668D] group-hover:rotate-12 transition-transform" />
              Practice Portal
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#0B2545] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCases.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              onClick={() =>
                setSelectedItem({
                  title: item.title,
                  category: item.category,
                  url: item.imageUrl,
                  note: item.clinicalNote
                })
              }
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 flex flex-col cursor-pointer group transition-all"
            >
              <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                  <span className="text-white text-xs font-bold flex items-center gap-1">
                    <ZoomIn size={16} /> View Clinical Case
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-[#0B2545] uppercase tracking-wider shadow-xs">
                    {item.tag}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#05668D] block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-serif font-bold text-[#0B2545] text-base group-hover:text-[#05668D] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {item.clinicalNote}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-[#05668D]">
                  <span>Read case note</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                aria-label="Close lightbox"
              >
                <X size={20} />
              </button>

              <div className="grid md:grid-cols-12 flex-1 overflow-y-auto">
                <div className="md:col-span-7 bg-black flex items-center justify-center min-h-[300px]">
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    className="max-h-[70vh] w-full object-contain"
                  />
                </div>
                <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-[#05668D]/10 text-[#05668D] text-xs font-bold uppercase tracking-wider inline-block mb-3">
                      {selectedItem.category}
                    </span>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#0B2545] leading-snug mb-4">
                      {selectedItem.title}
                    </h3>
                    <div className="border-l-4 border-[#C5A059] pl-4 py-1 mb-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                        Surgical Protocol / Clinical Insight
                      </p>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                        {selectedItem.note}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <p className="text-[11px] text-slate-400 mb-3 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#05668D]" />
                      Documented under strict clinical ethics protocols
                    </p>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="w-full py-3 rounded-xl bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Close Viewer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
