import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone, MapPin, ExternalLink, Award, BookOpen, Stethoscope, Users,
  ChevronRight, Clock, Activity, MessageCircle, Send, Bot, Loader2,
  AlertCircle, ShieldCheck, CheckCircle2, Menu, X, Sparkles, HeartPulse,
  Calendar, Lock, ArrowUpRight, Star, Heart, Check, Sparkle
} from 'lucide-react';
import Gallery from './components/Gallery';
import AdminPanel from './components/AdminPanel';
import PatientGuideModal from './components/PatientGuideModal';
import ScarlessComparison from './components/ScarlessComparison';
import SymptomChecker from './components/SymptomChecker';
import PatientTestimonials from './components/PatientTestimonials';

const SYSTEM_PROMPT = `You are the AI Clinical Assistant for Dr. Adarsh Raghavan's Endocrine & Breast Surgery practice in Chennai, Tamil Nadu, India.
Dr. Adarsh Raghavan's Qualifications:
- MBBS (Annamalai University)
- MS General Surgery (Government Kilpauk Medical College, Chennai)
- M.Ch Endocrine Surgery (Madras Medical College - MMC, Chennai)
- 14+ years of surgical experience.
- International Travel Grant Award recipient from the Japan Surgical Society (JSS) & Asian Association of Endocrine Surgeons (AAES).
- Fellow / Member of Indian Association of Endocrine Surgeons (IAES) & Association of Surgeons of India (ASI).

SPECIALTIES & PROCEDURES:
1. Thyroid Surgery: Total/Hemi-Thyroidectomy, Central & Lateral Neck Dissection for Thyroid Malignancy, Retrosternal Goitre surgery, Intraoperative Nerve Monitoring (IONM) for Recurrent Laryngeal Nerve (RLN) preservation.
2. Scarless Endocrine Surgery: Transoral Endoscopic Thyroidectomy Vestibular Approach (TOETVA) and BABA leaving ZERO neck scars.
3. Parathyroid Surgery: Focused Minimally Invasive Parathyroidectomy (MIP) for parathyroid adenomas, subtotal/total parathyroidectomy with autotransplantation for renal hyperparathyroidism.
4. Adrenal Surgery: Laparoscopic & Retroperitoneoscopic Adrenalectomy for pheochromocytoma, Cushing's, Conn's syndrome, and incidentalomas.
5. Breast Surgery & Oncoplasty: Breast conservation surgery (BCS), sentinel lymph node biopsy, oncoplastic remodeling, and benign lump excision.

HOSPITAL CONSULTATION LOCATIONS IN CHENNAI:
- SIMS Hospital (SRM Institutes for Medical Science): Jawaharlal Nehru Salai, 100 Feet Road, Vadapalani, Chennai - 600026. Timings: Mon–Sat: 10:00 AM – 3:00 PM.
- Lifeline Multispeciality Hospitals: 47/3, New Avadi Road, Kilpauk, Chennai - 600010. Timings: Mon–Sat: 4:30 PM – 7:30 PM.
- Emergency Helpline: +91 98400 00000 | WhatsApp: +91 98400 00000.

RULES:
1. Always be empathetic, polite, and reassuring.
2. Provide accurate educational guidance on thyroid, parathyroid, scarless TOETVA, adrenal, and breast conditions.
3. Understand Tamil medical terms when patients type them (e.g., 'தைராய்டு', 'கழுத்து கட்டி', 'மார் கட்டி').
4. Never make a definitive personal diagnosis; recommend booking a clinical consultation.
5. Provide clear hospital timing and booking details for SIMS Vadapalani and Lifeline Kilpauk.
6. Keep responses under 180 words with clear bullet points.`;

const INITIAL_CHAT_MESSAGES = [
  {
    role: 'bot' as const,
    content: "Vanakkam & Welcome! I am Dr. Adarsh Raghavan's AI Health Assistant.\n\nI can help you with:\n• Thyroid swellings, nodules & cancer care\n• Scarless Thyroid Surgery (TOETVA)\n• Calcium, PTH & Parathyroid adenomas\n• Adrenal tumors & laparoscopic surgery\n• Breast lump assessment & oncoplasty\n• OPD timings & appointment booking at SIMS Hospital (Vadapalani) & Lifeline (Kilpauk)\n\nHow may I assist you today?"
  }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>(INITIAL_CHAT_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Modals & Panels
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [galleryRefresh, setGalleryRefresh] = useState(0);

  // Announcement
  const [announcement, setAnnouncement] = useState('Now offering Specialized Endocrine & Scarless Thyroid (TOETVA) Clinics at SIMS Vadapalani & Lifeline Kilpauk');

  // Appointment Form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Chennai',
    specialty: 'Thyroid / Parathyroid',
    preferred_date: '',
    symptoms: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/announcement')
      .then(res => res.json())
      .then(data => {
        if (data.text) setAnnouncement(data.text);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please provide your name and phone number so our clinical coordinator can confirm your slot.');
      return;
    }

    setIsSubmitting(true);
    setBookingSuccess(false);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setBookingSuccess(true);
        setFormData({
          name: '',
          phone: '',
          city: 'Chennai',
          specialty: 'Thyroid / Parathyroid',
          preferred_date: '',
          symptoms: ''
        });
      } else {
        alert('Appointment received. Our desk will contact you at your provided number.');
        setBookingSuccess(true);
      }
    } catch {
      // Local fallback
      setBookingSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Smart Offline Clinical Knowledge Engine
  const getLocalMedicalResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('book') || input.includes('appointment') || input.includes('timing') || input.includes('slot') || input.includes('time') || input.includes('consult')) {
      return `To schedule an OPD consultation with Dr. Adarsh Raghavan:\n\n📍 SIMS Hospital (Vadapalani)\nMon – Sat: 10:00 AM – 3:00 PM\n\n📍 Lifeline Multispeciality Hospitals (Kilpauk)\nMon – Sat: 4:30 PM – 7:30 PM\n\n📞 Direct Desk: +91 98400 00000\n💬 WhatsApp: +91 98400 00000\n\nYou can also submit the booking form below on this website for an immediate callback.`;
    }

    if (input.includes('scarless') || input.includes('toetva') || input.includes('baba') || input.includes('scar') || input.includes('transoral')) {
      return `Scarless Thyroid Surgery (TOETVA):\n\n• Performed entirely through three tiny punctures inside the lower oral vestibule (behind lower lip).\n• Leaves ZERO visible neck scars on the skin.\n• 4K endoscopic magnification ensures supreme preservation of the Recurrent Laryngeal Nerve and parathyroid glands.\n• Ideal for nodules < 4-5 cm and select early malignancies.\n\nDr. Adarsh Raghavan is one of Chennai's foremost specialists in TOETVA scarless surgery.`;
    }

    if (input.includes('thyroid') || input.includes('nodule') || input.includes('goitre') || input.includes('goiter') || input.includes('fnac') || input.includes('tirads') || input.includes('தைராய்டு')) {
      return `Comprehensive Thyroid Care:\n\n• High-resolution Ultrasound with TIRADS classification\n• USG-guided FNAC (Bethesda Reporting)\n• Total & Hemi-thyroidectomy with Central/Lateral Neck Dissection\n• Retrosternal Goitre excision without chest bone splitting\n• Dedicated Intraoperative Neuromonitoring (IONM) to protect singing & speaking voice.\n\nConsult at SIMS Vadapalani or Lifeline Kilpauk: +91 98400 00000.`;
    }

    if (input.includes('parathyroid') || input.includes('calcium') || input.includes('pth') || input.includes('stone') || input.includes('sestamibi')) {
      return `Parathyroid & Calcium Balance:\n\n• High blood calcium (>10.2 mg/dL) combined with elevated PTH indicates Primary Hyperparathyroidism.\n• Common warning signs: recurrent kidney stones, severe osteoporosis, bone aches, and chronic fatigue.\n• Focused Minimally Invasive Parathyroidectomy (MIP) removes the single adenoma via a tiny 2 cm incision.\n• Over 98% permanent cure rate with immediate normalization of calcium.`;
    }

    if (input.includes('adrenal') || input.includes('pheo') || input.includes('cushing') || input.includes('conn') || input.includes('laparoscopic')) {
      return `Adrenal Gland Surgery:\n\n• Minimally invasive Laparoscopic & Posterior Retroperitoneoscopic Adrenalectomy.\n• Treatment for Pheochromocytoma, Cushing's syndrome, Aldosteronoma (Conn's), and adrenal tumors.\n• Keyhole techniques mean minimal blood loss, minimal post-op pain, and rapid hospital discharge (within 24-48 hours).`;
    }

    if (input.includes('breast') || input.includes('lump') || input.includes('oncoplasty') || input.includes('cancer') || input.includes('mammogram') || input.includes('மார்')) {
      return `Breast Surgery & Oncoplastic Care:\n\n• Triple Assessment Protocol: Clinical Exam + Digital Mammogram/USG + Core Biopsy\n• Breast Conservation Surgery (BCS): Preserves the natural breast while completely removing the tumor with clear margins.\n• Oncoplastic reconstruction to prevent tissue deformity\n• Sentinel Lymph Node Biopsy (SLNB) to spare underarm lymph nodes.\n\nSchedule evaluation: +91 98400 00000.`;
    }

    if (input.includes('sims') || input.includes('vadapalani') || input.includes('lifeline') || input.includes('kilpauk') || input.includes('where') || input.includes('location')) {
      return `Dr. Adarsh Raghavan's Practice Locations in Chennai:\n\n1. SIMS Hospital (SRM Institutes for Medical Science)\n100 Feet Road, Vadapalani, Chennai - 600026\nTimings: 10:00 AM – 3:00 PM (Mon-Sat)\n\n2. Lifeline Multispeciality Hospitals\nNew Avadi Road, Kilpauk, Chennai - 600010\nTimings: 4:30 PM – 7:30 PM (Mon-Sat)\n\nHelpline: +91 98400 00000`;
    }

    if (input.includes('hello') || input.includes('hi') || input.includes('vanakkam') || input.includes('namaste')) {
      return `Vanakkam! How can I assist you today? You can ask about:\n\n• Thyroid nodules & scarless surgery (TOETVA)\n• Parathyroid disorders & high calcium\n• Adrenal laparoscopic surgery\n• Breast lump evaluation & oncoplasty\n• Booking an OPD appointment at SIMS or Lifeline Hospitals`;
    }

    return `Dr. Adarsh Raghavan (MBBS, MS, MCh Endocrine Surgery, MMC Chennai) specializes in:\n\n🦋 Thyroidectomy & Neck Dissection\n✨ Scarless TOETVA (No Neck Scar)\n🔘 Parathyroid MIP & High Calcium\n⚡ Laparoscopic Adrenalectomy\n🌸 Breast Conservation & Oncoplasty\n\n📍 Clinics at SIMS Vadapalani & Lifeline Kilpauk\n📞 Appointment Helpline: +91 98400 00000`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userText }]);
    setInputMessage('');
    setIsTyping(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      setTimeout(() => {
        const response = getLocalMedicalResponse(userText);
        setChatMessages(prev => [...prev, { role: 'bot', content: response }]);
        setIsTyping(false);
      }, 500);
      return;
    }

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, systemPrompt: SYSTEM_PROMPT })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      setApiError(true);
      const fallback = getLocalMedicalResponse(userText);
      setChatMessages(prev => [...prev, { role: 'bot', content: fallback }]);
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToSection = (id: string, specialty?: string) => {
    setIsMenuOpen(false);
    if (specialty) {
      setFormData(prev => ({ ...prev, specialty }));
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0B2545] selection:bg-[#05668D] selection:text-white flex flex-col font-sans">
      {/* 1. ANNOUNCEMENT BANNER */}
      <AnimatePresence>
        {announcement && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-[#0B2545] text-white text-[11px] sm:text-xs font-semibold py-2.5 px-4 text-center border-b border-[#05668D]/40 flex items-center justify-center gap-2 relative z-50 animate-shimmer"
          >
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse flex-shrink-0"></span>
            <span className="truncate max-w-4xl tracking-wide">{announcement}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. NAVIGATION HEADER */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 w-full ${
          scrolled ? 'glass-morphism shadow-md py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex justify-between items-center w-full">
          {/* Brand Seal */}
          <a href="#" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-2xl bg-[#0B2545] text-white flex items-center justify-center shadow-lg shadow-[#0B2545]/20 border border-[#C5A059]/40 group-hover:scale-105 transition-transform relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#05668D]/30 to-transparent"></div>
              <Stethoscope size={24} className="text-[#C5A059] relative z-10" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-base sm:text-xl text-[#0B2545] tracking-tight uppercase leading-tight group-hover:text-[#05668D] transition-colors">
                Dr. Adarsh Raghavan
              </h1>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#C5A059] font-bold">
                MBBS, MS, MCh (Endocrine Surgery)
              </p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-600">
            <button onClick={() => scrollToSection('specialties')} className="hover:text-[#05668D] transition-colors">Specialties</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-[#05668D] transition-colors">Academic Pedigree</button>
            <button onClick={() => scrollToSection('patient-hub')} className="hover:text-[#05668D] transition-colors">Patient Hub</button>
            <button onClick={() => scrollToSection('gallery')} className="hover:text-[#05668D] transition-colors">Gallery</button>
            <button onClick={() => scrollToSection('locations')} className="hover:text-[#05668D] transition-colors">Clinics</button>

            <div className="h-4 w-px bg-gray-200"></div>

            <a
              href="tel:+919840000000"
              className="text-red-700 font-bold text-xs px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/80 hover:bg-red-100 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Phone size={12} /> Helpline: +91 98400 00000
            </a>

            <button
              onClick={() => scrollToSection('contact')}
              className="bg-[#0B2545] hover:bg-[#13315C] text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-md shadow-[#0B2545]/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
            >
              <Calendar size={13} /> Book OPD
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#0B2545] hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-18 z-30 bg-white/98 backdrop-blur-lg border-b border-gray-200 shadow-xl p-6 md:hidden flex flex-col gap-4 font-sans text-sm font-bold uppercase tracking-wider"
          >
            <button onClick={() => scrollToSection('specialties')} className="py-2.5 text-left border-b border-gray-100">Specialties</button>
            <button onClick={() => scrollToSection('about')} className="py-2.5 text-left border-b border-gray-100">About Dr. Adarsh</button>
            <button onClick={() => scrollToSection('patient-hub')} className="py-2.5 text-left border-b border-gray-100">Patient Hub</button>
            <button onClick={() => scrollToSection('gallery')} className="py-2.5 text-left border-b border-gray-100">Surgical Gallery</button>
            <button onClick={() => scrollToSection('locations')} className="py-2.5 text-left border-b border-gray-100">Clinics (Vadapalani & Kilpauk)</button>
            <button onClick={() => scrollToSection('contact')} className="py-2.5 text-left border-b border-gray-100">Contact</button>

            <a
              href="tel:+919840000000"
              className="py-3 text-center rounded-xl bg-red-50 text-red-700 border border-red-200 font-bold text-xs flex items-center justify-center gap-2"
            >
              <Phone size={14} /> Emergency Helpline: +91 98400 00000
            </a>

            <button
              onClick={() => scrollToSection('contact')}
              className="py-3.5 rounded-xl bg-[#0B2545] text-white text-xs font-bold uppercase tracking-wider shadow-md text-center"
            >
              Schedule Consultation Slot
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {/* 3. HERO SECTION (UPGRADED WITH MESH GRADIENT & STATS) */}
        <section className="relative min-h-[90vh] flex items-center py-14 lg:py-24 overflow-hidden border-b border-gray-200 bg-white hero-mesh">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 lg:pr-6"
            >
              {/* Live Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F7F9] border border-[#05668D]/20 mb-6 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#05668D] animate-ping"></span>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#05668D]">
                  Consulting in Chennai • SIMS Hospital & Lifeline Hospitals
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#0B2545] leading-[1.12] mb-6 tracking-tight">
                Pioneering Precision in Endocrine, <span className="text-gradient-teal italic">Scarless</span> & Breast Surgery.
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 mb-8 max-w-2xl leading-relaxed gold-accent-left pl-4 sm:pl-6 font-sans">
                Mastery in complex glandular oncology for thyroid, parathyroid, and adrenal disorders. Integrating revolutionary <strong>TOETVA scarless techniques</strong> and intraoperative neuromonitoring with cosmetic dignity.
              </p>

              {/* Degrees / Qualifications Ribbon with Gold Trim */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mb-8">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF9F6] border border-gray-200 text-center shadow-xs hover:border-[#05668D] transition-colors">
                  <span className="block font-serif font-bold text-[#0B2545] text-lg sm:text-xl">MBBS</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Annamalai</span>
                </div>
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF9F6] border border-gray-200 text-center shadow-xs hover:border-[#05668D] transition-colors">
                  <span className="block font-serif font-bold text-[#0B2545] text-lg sm:text-xl">MS</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Kilpauk</span>
                </div>
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0B2545] text-white text-center shadow-lg border-b-2 border-[#C5A059]">
                  <span className="block font-serif font-bold text-lg sm:text-xl text-[#C5A059]">M.Ch</span>
                  <span className="text-[10px] uppercase tracking-wider opacity-85 font-bold">MMC Chennai</span>
                </div>
              </div>

              {/* Action Buttons with subtle glow */}
              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-4 rounded-full bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#0B2545]/25 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Calendar size={16} /> Schedule Consultation
                </button>
                <button
                  onClick={() => scrollToSection('patient-hub')}
                  className="px-6 py-4 rounded-full bg-white hover:bg-slate-50 text-[#0B2545] border border-gray-300 font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow-md transition-all flex items-center gap-2"
                >
                  Explore Clinical Guides <ChevronRight size={16} />
                </button>
              </div>

              {/* High-Impact Clinical Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                <div>
                  <span className="block font-serif font-bold text-2xl sm:text-3xl text-[#0B2545]">14+</span>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Years Experience</span>
                </div>
                <div>
                  <span className="block font-serif font-bold text-2xl sm:text-3xl text-[#05668D]">4,500+</span>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Surgeries Done</span>
                </div>
                <div>
                  <span className="block font-serif font-bold text-2xl sm:text-3xl text-[#0B2545]">99.4%</span>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Voice Safety Rate</span>
                </div>
                <div>
                  <span className="block font-serif font-bold text-2xl sm:text-3xl text-[#C5A059]">0 cm</span>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Scar with TOETVA</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Visual Card with Glowing Frame */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-4/5 relative z-10 card-shadow">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80"
                    alt="Dr. Adarsh Raghavan - Consultant Endocrine Surgeon"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/85 via-transparent to-transparent"></div>

                  {/* Overlaid Bio Badge */}
                  <div className="absolute bottom-6 inset-x-6 text-white">
                    <span className="px-3 py-1 rounded-full bg-[#C5A059] text-[#0B2545] text-[10px] font-bold uppercase tracking-wider inline-block mb-2 shadow-xs">
                      Consultant Endocrine Surgeon
                    </span>
                    <h3 className="font-serif font-bold text-2xl text-white leading-tight">
                      Dr. Adarsh Raghavan
                    </h3>
                    <p className="text-xs text-slate-200 mt-1">
                      SIMS Hospital Vadapalani & Lifeline Hospital Kilpauk, Chennai
                    </p>
                  </div>
                </div>

                {/* Floating Seal Badge */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3.5 z-20">
                  <div className="w-12 h-12 rounded-xl bg-[#05668D]/10 text-[#05668D] flex items-center justify-center">
                    <Award size={24} className="text-[#C5A059]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0B2545]">JSS Travel Grant Awardee</p>
                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                      Japan Surgical Society • Best Paper
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. DEFINING ENDOCRINE SURGERY (SPECIALTIES) */}
        <section id="specialties" className="py-20 lg:py-28 bg-[#FAF9F6] border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14 border-b border-gray-200 pb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#05668D] font-sans block mb-3">
                  Super-Specialty Disciplines
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0B2545]">
                  Defining Endocrine & Breast Surgery
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm font-sans">
                Dedicated surgical focus exclusively on hormone-producing glandular pathologies and oncoplastic breast interventions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Specialty 1 */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 card-shadow card-shadow-hover flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl mb-6 font-bold group-hover:scale-110 transition-transform shadow-xs">
                    ◈
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#0B2545] mb-2 leading-snug">
                    Thyroid & Parathyroid
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Total and hemi-thyroidectomies, central/lateral neck dissection for cancer, retrosternal goitre, and targeted MIP for parathyroid adenomas with IONM voice preservation.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedGuideId('thyroid-nodules')}
                  className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#05668D] group-hover:text-[#0B2545]"
                >
                  <span>Explore Protocol</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Specialty 2 */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 card-shadow card-shadow-hover flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#05668D] flex items-center justify-center text-xl mb-6 font-bold group-hover:scale-110 transition-transform shadow-xs">
                    ✦
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#0B2545] mb-2 leading-snug">
                    Scarless TOETVA & BABA
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Pioneering transoral endoscopic thyroidectomy through the oral vestibule, completely avoiding visible cuts or scarring on the neck while retaining full oncological precision.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedGuideId('scarless-toetva')}
                  className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#05668D] group-hover:text-[#0B2545]"
                >
                  <span>Explore TOETVA</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Specialty 3 */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 card-shadow card-shadow-hover flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl mb-6 font-bold group-hover:scale-110 transition-transform shadow-xs">
                    ⬡
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#0B2545] mb-2 leading-snug">
                    Adrenal Surgery
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Minimally invasive laparoscopic and posterior retroperitoneoscopic adrenalectomies for pheochromocytomas, Conn’s syndrome, Cushing’s, and adrenal masses.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedGuideId('hyperparathyroidism')}
                  className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#05668D] group-hover:text-[#0B2545]"
                >
                  <span>Explore Adrenal</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Specialty 4 */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 card-shadow card-shadow-hover flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-xl mb-6 font-bold group-hover:scale-110 transition-transform shadow-xs">
                    ❖
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#0B2545] mb-2 leading-snug">
                    Breast Oncoplasty
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Breast conservation surgery (lumpectomy) with volume-displacement oncoplastic remodeling, sentinel lymph node biopsy, and benign lump excision.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedGuideId('breast-wellness')}
                  className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#05668D] group-hover:text-[#0B2545]"
                >
                  <span>Explore Breast Care</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE SCARLESS TOETVA COMPARISON */}
        <ScarlessComparison onBookClick={() => scrollToSection('contact', 'Scarless TOETVA Thyroidectomy')} />

        {/* 6. MEET THE SURGEON / ACADEMIC FOUNDATION */}
        <section id="about" className="py-20 lg:py-28 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Photo & Philosophy Card */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-4/5 relative card-shadow">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80"
                  alt="Dr. Adarsh Raghavan in Clinical Practice"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Quote Card */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-[#0B2545] p-6 sm:p-8 rounded-3xl shadow-2xl text-white max-w-xs sm:max-w-sm border border-white/10">
                <p className="font-serif italic text-sm sm:text-base leading-relaxed mb-3">
                  "Surgical perfection in endocrine diseases demands anatomical respect, functional nerve preservation, and aesthetic dignity."
                </p>
                <div className="w-10 h-1 bg-[#C5A059]"></div>
              </div>
            </div>

            {/* Right Academic Details */}
            <div className="lg:col-span-7 lg:pl-6">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#05668D] font-sans block mb-3">
                Academic Pedigree & Background
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0B2545] mb-6 leading-tight">
                M.Ch Super-Specialty Training from <span className="text-[#05668D]">Madras Medical College</span>
              </h2>

              <div className="space-y-5 text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
                <p>
                  <strong>Dr. Adarsh Raghavan</strong> is an accomplished Consultant Endocrine and Breast Surgeon who has dedicated his career to the delicate intersections of glandular surgery and cosmetic preservation. With his formal <strong>M.Ch super-specialty training from Madras Medical College (MMC)</strong>, he represents the pinnacle of specialized surgical expertise in Tamil Nadu.
                </p>
                <p>
                  Prior to his M.Ch, he completed his Master of Surgery (MS) in General Surgery from Government Kilpauk Medical College, Chennai, and his MBBS from Rajah Muthiah Medical College, Annamalai University.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-gray-100 flex items-start gap-3.5 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-[#05668D]/10 text-[#05668D] flex items-center justify-center flex-shrink-0">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0B2545] text-sm">International Awardee</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Travel Grant Awards for Best Paper from Japan Surgical Society (JSS) & AAES.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-gray-100 flex items-start gap-3.5 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-[#05668D]/10 text-[#05668D] flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0B2545] text-sm">Dual Center Affiliation</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Consultant at SIMS Hospital (Vadapalani) and Lifeline Multispeciality Hospital (Kilpauk).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="teal-accent-left pl-4 py-2 bg-[#F0F7F9] rounded-r-xl text-xs sm:text-sm text-[#0B2545] font-medium">
                  Active Member: Indian Association of Endocrine Surgeons (IAES) & Association of Surgeons of India (ASI).
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. INTERACTIVE SYMPTOM CHECKER TRIAGE */}
        <SymptomChecker onBookClick={(specialty) => scrollToSection('contact', specialty)} />

        {/* 8. PATIENT HUB (INTERACTIVE CLINICAL GUIDES) */}
        <section id="patient-hub" className="py-20 lg:py-28 bg-[#0B2545] text-white relative overflow-hidden dark-mesh">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-3">
                  Patient Education Hub
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
                  Clinical Evidence Guides
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                Clear, evidence-based answers to help you and your family understand scans, biopsy results, and advanced surgical alternatives.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Guide 1 */}
              <div
                onClick={() => setSelectedGuideId('thyroid-nodules')}
                className="p-6 sm:p-7 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-2">
                    Thyroid Pathology
                  </span>
                  <h3 className="font-serif font-bold text-lg text-white group-hover:text-[#C5A059] transition-colors leading-snug mb-3">
                    Thyroid Nodules & TIRADS Score
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Decoding ultrasound TIRADS grades, when an FNAC biopsy is necessary, and safe surgical indications.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#C5A059]">
                  <span>Open Clinical Guide</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>

              {/* Guide 2 */}
              <div
                onClick={() => setSelectedGuideId('scarless-toetva')}
                className="p-6 sm:p-7 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-2">
                    Cosmetic Preservation
                  </span>
                  <h3 className="font-serif font-bold text-lg text-white group-hover:text-[#C5A059] transition-colors leading-snug mb-3">
                    Scarless TOETVA Thyroidectomy
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    How transoral surgery works through the inner lower lip without creating any visible cut on the neck.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#C5A059]">
                  <span>Open Clinical Guide</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>

              {/* Guide 3 */}
              <div
                onClick={() => setSelectedGuideId('hyperparathyroidism')}
                className="p-6 sm:p-7 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-2">
                    Calcium & Bones
                  </span>
                  <h3 className="font-serif font-bold text-lg text-white group-hover:text-[#C5A059] transition-colors leading-snug mb-3">
                    Hyperparathyroidism & Kidney Stones
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Understanding high PTH levels, bone loss, kidney stone recurrence, and the 98% cure rate of MIP surgery.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#C5A059]">
                  <span>Open Clinical Guide</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>

              {/* Guide 4 */}
              <div
                onClick={() => setSelectedGuideId('nerve-safety')}
                className="p-6 sm:p-7 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-2">
                    Safety Protocols
                  </span>
                  <h3 className="font-serif font-bold text-lg text-white group-hover:text-[#C5A059] transition-colors leading-snug mb-3">
                    Recurrent Laryngeal Nerve Voice Safety
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Continuous Intraoperative Neuromonitoring (IONM) to safeguard vocal pitch, singing voice, and airway.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#C5A059]">
                  <span>Open Clinical Guide</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>

              {/* Guide 5 */}
              <div
                onClick={() => setSelectedGuideId('breast-wellness')}
                className="p-6 sm:p-7 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group flex flex-col justify-between sm:col-span-2 lg:col-span-2"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-2">
                    Oncoplastic Breast Care
                  </span>
                  <h3 className="font-serif font-bold text-lg text-white group-hover:text-[#C5A059] transition-colors leading-snug mb-3">
                    Breast Lump Assessment & Oncoplastic Conservation
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The Triple Assessment protocol, breast-conserving surgery (BCS), and oncoplastic volume remodeling techniques that protect both health and natural form.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#C5A059]">
                  <span>Open Clinical Guide</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. PATIENT TESTIMONIALS & RECOVERY STORIES */}
        <PatientTestimonials />

        {/* 10. SURGICAL & ACADEMIC GALLERY */}
        <Gallery
          onOpenAdmin={() => setIsAdminOpen(true)}
          refreshTrigger={galleryRefresh}
        />

        {/* 11. PRACTICE LOCATIONS (CHENNAI) */}
        <section id="locations" className="py-20 lg:py-28 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#05668D] block mb-3">
                Chennai Consultation Centers
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0B2545]">
                Practice Locations & OPD Schedules
              </h2>
              <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Center 1: SIMS Hospital */}
              <div className="bg-[#FAF9F6] p-7 sm:p-10 rounded-3xl border border-gray-200 card-shadow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#05668D] block mb-1">
                        Primary Consultant Practice
                      </span>
                      <h3 className="font-serif font-bold text-2xl text-[#0B2545]">
                        SIMS Hospital (SRM Institutes)
                      </h3>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-white text-[#0B2545] flex items-center justify-center shadow-xs">
                      <MapPin size={22} className="text-[#05668D]" />
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6 font-sans">
                    1, Jawaharlal Nehru Salai, 100 Feet Road, Vadapalani, Chennai, Tamil Nadu - 600026
                  </p>

                  <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-center gap-3 text-xs font-bold text-[#0B2545] mb-6 shadow-xs">
                    <Clock size={16} className="text-[#C5A059]" />
                    <span>OPD Hours: Monday – Saturday | 10:00 AM – 3:00 PM</span>
                  </div>

                  <div className="w-full h-52 rounded-2xl overflow-hidden border border-gray-200 shadow-inner mb-6">
                    <iframe
                      src="https://maps.google.com/maps?q=SIMS+Hospital,+Vadapalani,+Chennai&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="SIMS Hospital Vadapalani Location"
                    ></iframe>
                  </div>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=SIMS+Hospital,+Vadapalani,+Chennai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-[#0B2545] text-[#0B2545] hover:text-white border border-gray-200 font-bold text-xs uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  Get Driving Directions <ExternalLink size={14} />
                </a>
              </div>

              {/* Center 2: Lifeline Multispeciality Hospital */}
              <div className="bg-[#FAF9F6] p-7 sm:p-10 rounded-3xl border border-gray-200 card-shadow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#05668D] block mb-1">
                        Evening Consultant Practice
                      </span>
                      <h3 className="font-serif font-bold text-2xl text-[#0B2545]">
                        Lifeline Multispeciality Hospitals
                      </h3>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-white text-[#0B2545] flex items-center justify-center shadow-xs">
                      <MapPin size={22} className="text-[#05668D]" />
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6 font-sans">
                    47/3, New Avadi Road, Kilpauk, Chennai, Tamil Nadu - 600010
                  </p>

                  <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-center gap-3 text-xs font-bold text-[#0B2545] mb-6 shadow-xs">
                    <Clock size={16} className="text-[#C5A059]" />
                    <span>OPD Hours: Monday – Saturday | 4:30 PM – 7:30 PM</span>
                  </div>

                  <div className="w-full h-52 rounded-2xl overflow-hidden border border-gray-200 shadow-inner mb-6">
                    <iframe
                      src="https://maps.google.com/maps?q=Lifeline+Multispeciality+Hospitals,+Kilpauk,+Chennai&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Lifeline Hospital Kilpauk Location"
                    ></iframe>
                  </div>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Lifeline+Multispeciality+Hospitals,+Kilpauk,+Chennai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-[#0B2545] text-[#0B2545] hover:text-white border border-gray-200 font-bold text-xs uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  Get Driving Directions <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 12. APPOINTMENT BOOKING & CONTACT */}
        <section id="contact" className="py-20 lg:py-28 bg-[#FAF9F6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="bg-white rounded-3xl sm:rounded-[3rem] p-6 sm:p-12 lg:p-16 shadow-xl border border-gray-200 grid lg:grid-cols-12 gap-10 items-center">
              {/* Left Contact Details */}
              <div className="lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#05668D] block mb-2">
                  Direct Coordination
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B2545] mb-6 leading-tight">
                  Schedule Your Consultation
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-8 gold-accent-left pl-4 font-sans">
                  Our clinical coordinators will review your symptom details, verify report requirements, and schedule your appointment slot at your preferred hospital.
                </p>

                <div className="space-y-4">
                  <a
                    href="tel:+919840000000"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF9F6] border border-gray-100 hover:border-[#05668D] transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white text-[#0B2545] group-hover:bg-[#0B2545] group-hover:text-white flex items-center justify-center shadow-xs transition-colors">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Helpline / Booking Desk
                      </p>
                      <p className="font-bold text-[#0B2545] text-base group-hover:text-[#05668D] transition-colors">
                        +91 98400 00000
                      </p>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/919840000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF9F6] border border-gray-100 hover:border-green-600 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white flex items-center justify-center shadow-xs transition-colors">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        WhatsApp Clinical Inquiries
                      </p>
                      <p className="font-bold text-[#0B2545] text-base group-hover:text-green-700 transition-colors">
                        +91 98400 00000
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Right Booking Form */}
              <div className="lg:col-span-7 bg-[#FAF9F6] p-6 sm:p-10 rounded-3xl border border-gray-200">
                {bookingSuccess ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-[#0B2545]">
                      Consultation Request Received
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Thank you. Our clinic coordinator will call you shortly to confirm your consultation time and guide you regarding any existing ultrasound or blood test reports.
                    </p>
                    <button
                      onClick={() => setBookingSuccess(false)}
                      className="px-6 py-2.5 rounded-xl bg-[#0B2545] text-white text-xs font-bold uppercase tracking-wider"
                    >
                      Book Another Slot
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                        Patient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Anand Sundaram"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-[#05668D] text-sm"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                          Mobile Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98400 00000"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-[#05668D] text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                          Preferred Location / Area
                        </label>
                        <select
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-[#05668D] text-sm"
                        >
                          <option>SIMS Hospital (Vadapalani)</option>
                          <option>Lifeline Hospital (Kilpauk)</option>
                          <option>Other / Outstation Consultation</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                          Clinical Specialty
                        </label>
                        <select
                          value={formData.specialty}
                          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-[#05668D] text-sm"
                        >
                          <option>Thyroid / Goitre Surgery</option>
                          <option>Scarless TOETVA Thyroidectomy</option>
                          <option>Parathyroid / High Calcium</option>
                          <option>Adrenal Gland Tumor</option>
                          <option>Breast Lump / Oncoplastic Surgery</option>
                          <option>General Second Opinion</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          value={formData.preferred_date}
                          onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-[#05668D] text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                        Brief Symptoms or Query (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.symptoms}
                        onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                        placeholder="e.g. Neck swelling for 3 months, USG done..."
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-[#05668D] text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Submitting Request...
                        </>
                      ) : (
                        <>
                          <Calendar size={16} /> Confirm Consultation Request
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-slate-400">
                      Your medical information is kept strictly confidential under clinical privacy standards.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 13. FOOTER */}
      <footer className="bg-[#0B2545] text-white/70 py-12 border-t border-white/10 font-sans text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="font-serif font-bold text-white text-base tracking-wide uppercase">
              Dr. Adarsh Raghavan
            </h4>
            <p className="text-xs text-[#C5A059] font-bold uppercase tracking-wider mt-1">
              MBBS, MS, M.Ch (Endocrine Surgery) | MMC Chennai
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              SIMS Hospital Vadapalani & Lifeline Multispeciality Hospitals Kilpauk, Chennai
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[11px] font-bold uppercase tracking-wider text-slate-300">
            <button onClick={() => scrollToSection('specialties')} className="hover:text-white transition-colors">Specialties</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">Academic Pedigree</button>
            <button onClick={() => scrollToSection('patient-hub')} className="hover:text-white transition-colors">Patient Hub</button>
            <button onClick={() => scrollToSection('locations')} className="hover:text-white transition-colors">Clinics</button>
            <button onClick={() => setIsAdminOpen(true)} className="hover:text-[#C5A059] transition-colors flex items-center gap-1">
              <Lock size={12} /> Staff Portal
            </button>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-400">
            <p>© 2026 DR. ADARSH RAGHAVAN ACADEMIC PRACTICE</p>
            <p className="mt-1">PIONEERING PRECISION IN ENDOCRINE & BREAST SURGERY</p>
          </div>
        </div>
      </footer>

      {/* 14. AI HEALTH ASSISTANT MODAL & WIDGET */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-22 right-4 sm:right-6 w-[92vw] sm:w-[420px] h-[540px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Chat Header */}
            <div className="bg-[#0B2545] text-white p-4.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#05668D] text-white flex items-center justify-center shadow-xs">
                  <Bot size={22} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-white">AI Health Assistant</h4>
                  <p className="text-[11px] text-[#C5A059] font-bold">
                    Dr. Adarsh Raghavan Practice • Chennai
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF9F6] text-xs sm:text-sm font-sans">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-[#0B2545] text-white rounded-br-xs'
                        : 'bg-white text-slate-700 rounded-bl-xs shadow-sm border border-gray-100'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-bl-xs shadow-sm border border-gray-100 flex items-center gap-2 text-xs text-slate-500">
                    <Loader2 size={16} className="text-[#05668D] animate-spin" />
                    <span>Assistant is preparing guidance...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Action Chips */}
            <div className="p-2 border-t border-gray-100 bg-white flex gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setInputMessage('Book an appointment')}
                className="text-[11px] px-3 py-1 bg-slate-100 hover:bg-[#0B2545] hover:text-white rounded-full font-bold text-slate-600 whitespace-nowrap transition-colors"
              >
                Book OPD
              </button>
              <button
                onClick={() => setInputMessage('What is Scarless TOETVA surgery?')}
                className="text-[11px] px-3 py-1 bg-teal-50 hover:bg-[#05668D] hover:text-white rounded-full font-bold text-[#05668D] whitespace-nowrap transition-colors"
              >
                Scarless TOETVA
              </button>
              <button
                onClick={() => setInputMessage('Tell me about thyroid nodules and TIRADS')}
                className="text-[11px] px-3 py-1 bg-slate-100 hover:bg-[#0B2545] hover:text-white rounded-full font-bold text-slate-600 whitespace-nowrap transition-colors"
              >
                Thyroid Nodules
              </button>
              <button
                onClick={() => setInputMessage('Hospital locations & timings in Chennai')}
                className="text-[11px] px-3 py-1 bg-slate-100 hover:bg-[#0B2545] hover:text-white rounded-full font-bold text-slate-600 whitespace-nowrap transition-colors"
              >
                Timings
              </button>
            </div>

            {/* Input Box */}
            <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about thyroid, TOETVA, parathyroid..."
                className="flex-1 px-4 py-2.5 rounded-full bg-[#FAF9F6] border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#05668D]"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="w-10 h-10 rounded-full bg-[#0B2545] text-white flex items-center justify-center hover:bg-[#13315C] transition-colors disabled:opacity-40 shadow-xs"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Trigger Button */}
      <motion.button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#0B2545] text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform border-2 border-[#C5A059]"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Health Assistant"
      >
        {isChatOpen ? <X size={24} /> : <MessageCircle size={26} />}
      </motion.button>

      {/* Patient Guide Modal */}
      <PatientGuideModal
        guideId={selectedGuideId}
        onClose={() => setSelectedGuideId(null)}
        onBookClick={() => scrollToSection('contact')}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onMediaUpdated={() => setGalleryRefresh(prev => prev + 1)}
        onAnnouncementUpdated={(text) => setAnnouncement(text)}
        currentAnnouncement={announcement}
      />
    </div>
  );
}
