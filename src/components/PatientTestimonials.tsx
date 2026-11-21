import React, { useState } from 'react';
import { Star, ShieldCheck, Quote, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  procedure: string;
  stars: number;
  quote: string;
  story: string;
  date: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Mrs. K. Meenakshi',
    location: 'Anna Nagar, Chennai',
    procedure: 'Total Thyroidectomy & Central Neck Dissection',
    stars: 5,
    quote: 'My thyroid cancer was diagnosed early, and Dr. Adarsh preserved my voice completely.',
    story: 'I was terrified when my FNAC showed papillary cancer, especially because I am a school teacher and rely on my voice every single day. Dr. Adarsh Raghavan explained the nerve monitoring technique with immense patience. The surgery at SIMS Hospital went smoothly, my vocal cords were 100% fine the same evening, and my biopsy showed clear margins. God bless him.',
    date: 'February 2026'
  },
  {
    id: 't-2',
    name: 'Ms. Shruthi Raman',
    location: 'OMR, Chennai',
    procedure: 'Scarless TOETVA Thyroidectomy',
    stars: 5,
    quote: 'Zero cuts on my neck! Nobody can even tell I had thyroid surgery.',
    story: 'Being 26 years old, the thought of a visible collar scar across my throat made me very anxious. Dr. Adarsh told me about TOETVA surgery done through the mouth. The incisions healed inside my lip in just a few days. Now 3 months later, there is absolutely zero mark on my neck. Truly miraculous technology in Chennai.',
    date: 'January 2026'
  },
  {
    id: 't-3',
    name: 'Mr. R. Natarajan',
    location: 'Coimbatore, Tamil Nadu',
    procedure: 'Minimally Invasive Parathyroidectomy (MIP)',
    stars: 5,
    quote: 'My severe bone pain and recurring kidney stones vanished after this targeted surgery.',
    story: 'For 3 years, I suffered from severe body aches, high calcium, and multiple kidney stone hospitalizations. Dr. Adarsh correctly identified a solitary parathyroid adenoma on Sestamibi scan and removed it through a tiny 2 cm incision in Chennai. My calcium dropped from 11.4 to 9.2 immediately. I feel 10 years younger.',
    date: 'December 2025'
  },
  {
    id: 't-4',
    name: 'Dr. S. Gayathri (MD)',
    location: 'Vadapalani, Chennai',
    procedure: 'Oncoplastic Breast Conservation Surgery',
    stars: 5,
    quote: 'As a fellow doctor, I deeply respect his oncoplastic surgical precision.',
    story: 'When I discovered a firm breast lump, I consulted Dr. Adarsh. He performed a core biopsy and then a wide local excision with level-1 oncoplastic remodeling. He achieved tumor-free margins while preserving the natural shape and symmetry of my breast. His surgical judgment and bedside empathy are exemplary.',
    date: 'November 2025'
  }
];

export default function PatientTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? TESTIMONIALS.length - 1 : prevIndex - 1));
  };

  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex === TESTIMONIALS.length - 1 ? 0 : prevIndex + 1));
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-20 lg:py-28 bg-[#0B2545] text-white relative overflow-hidden">
      {/* Decorative background radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#05668D]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-3 font-sans">
              Patient Voices & Clinical Outcomes
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
              Words of Recovery & Trust
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-white bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-white bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Featured Testimonial Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16 relative"
          >
            <Quote size={64} className="text-[#C5A059]/20 absolute top-8 right-8 pointer-events-none" />

            <div className="flex items-center gap-1 mb-6 text-[#C5A059]">
              {[...Array(current.stars)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
              <span className="ml-3 text-xs font-bold text-white/80 uppercase tracking-widest">
                Verified Surgical Case
              </span>
            </div>

            <h3 className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-white leading-relaxed mb-6 max-w-4xl">
              "{current.quote}"
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-4xl mb-8">
              {current.story}
            </p>

            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h4 className="font-serif font-bold text-lg text-white">{current.name}</h4>
                <p className="text-xs text-slate-400">{current.location}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-[#05668D]/30 border border-[#05668D] text-xs font-bold text-teal-200">
                  {current.procedure}
                </span>
                <span className="text-[11px] text-slate-400">{current.date}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicator dots */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? 'w-8 bg-[#C5A059]' : 'w-2 bg-white/20'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
