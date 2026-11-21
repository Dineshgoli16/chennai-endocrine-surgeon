import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, CheckCircle2, AlertCircle, Loader2, Bell, Users, Film, Image as ImageIcon, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface MediaItem {
  id: number | string;
  filename: string;
  type: string;
  title?: string;
  category?: string;
  uploaded_at: string;
}

export interface Appointment {
  id: number | string;
  name: string;
  phone: string;
  city: string;
  specialty: string;
  preferred_date?: string;
  symptoms?: string;
  booked_at: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMediaUpdated: () => void;
  onAnnouncementUpdated: (text: string) => void;
  currentAnnouncement: string;
}

export default function AdminPanel({
  isOpen,
  onClose,
  onMediaUpdated,
  onAnnouncementUpdated,
  currentAnnouncement
}: AdminPanelProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Admin tabs: announcement, upload, appointments
  const [activeTab, setActiveTab] = useState<'announcement' | 'upload' | 'appointments'>('announcement');
  
  // Announcement state
  const [announcementText, setAnnouncementText] = useState(currentAnnouncement);
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false);
  const [announcementMsg, setAnnouncementMsg] = useState('');

  // Upload state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Thyroid');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  // Media list for management
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  useEffect(() => {
    setAnnouncementText(currentAnnouncement);
  }, [currentAnnouncement]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setIsVerifying(true);
    setAuthError('');

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        setIsAdmin(true);
        loadAdminData();
      } else {
        setAuthError('Incorrect password. Please verify your administrative key.');
      }
    } catch {
      // Local fallback for offline mode
      if (password === 'Adarsh*321' || password === 'admin123') {
        setIsAdmin(true);
      } else {
        setAuthError('Connection error or invalid password.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const loadAdminData = async () => {
    // Load media
    setLoadingMedia(true);
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setMediaList(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMedia(false);
    }

    // Load appointments
    setLoadingAppointments(true);
    try {
      const res = await fetch(`/api/appointments?password=${encodeURIComponent(password)}`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleSaveAnnouncement = async () => {
    setIsSavingAnnouncement(true);
    setAnnouncementMsg('');

    try {
      const res = await fetch('/api/announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, text: announcementText })
      });
      if (res.ok) {
        setAnnouncementMsg('Announcement updated successfully!');
        onAnnouncementUpdated(announcementText);
        setTimeout(() => setAnnouncementMsg(''), 3000);
      } else {
        setAnnouncementMsg('Failed to update announcement.');
      }
    } catch {
      // Local preview fallback
      onAnnouncementUpdated(announcementText);
      setAnnouncementMsg('Updated in current session.');
      setTimeout(() => setAnnouncementMsg(''), 3000);
    } finally {
      setIsSavingAnnouncement(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess('');

    const formData = new FormData();
    formData.append('media', file);
    formData.append('password', password);
    formData.append('title', uploadTitle || file.name);
    formData.append('category', uploadCategory);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setUploadSuccess('File uploaded to clinical gallery!');
        setUploadTitle('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        onMediaUpdated();
        loadAdminData();
        setTimeout(() => setUploadSuccess(''), 3000);
      } else {
        alert('Upload failed. Check file size or file type.');
      }
    } catch {
      alert('Network error while uploading.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMedia = async (id: number | string) => {
    if (!confirm('Are you sure you want to remove this media item?')) return;

    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        setMediaList(prev => prev.filter(m => m.id !== id));
        onMediaUpdated();
      }
    } catch (e) {
      console.error('Delete error', e);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col border border-gray-100"
        >
          {/* Header */}
          <div className="bg-[#0B2545] text-white p-6 flex justify-between items-center border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#05668D] flex items-center justify-center text-white font-bold">
                <Key size={20} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">Clinical Practice Portal</h3>
                <p className="text-xs text-slate-300">Dr. Adarsh Raghavan Practice Administration</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {!isAdmin ? (
            /* Login Form */
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#05668D]/10 text-[#05668D] flex items-center justify-center mb-6">
                <Key size={32} />
              </div>
              <h4 className="text-xl font-serif font-bold text-[#0B2545] mb-2">Restricted Access</h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6">
                Enter your administrative key to manage live announcements, view appointments, and update gallery cases.
              </p>

              <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Admin Password..."
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#05668D] text-sm text-center"
                    autoFocus
                  />
                  {authError && (
                    <p className="text-xs text-red-600 mt-2 flex items-center justify-center gap-1">
                      <AlertCircle size={14} /> {authError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3.5 rounded-xl bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying ? <Loader2 size={16} className="animate-spin" /> : 'Authenticate Portal'}
                </button>
              </form>
            </div>
          ) : (
            /* Admin Dashboard */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 bg-slate-50 text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('announcement')}
                  className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
                    activeTab === 'announcement'
                      ? 'border-[#05668D] text-[#05668D] bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Bell size={16} /> Announcement Banner
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
                    activeTab === 'upload'
                      ? 'border-[#05668D] text-[#05668D] bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Upload size={16} /> Upload Media
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
                    activeTab === 'appointments'
                      ? 'border-[#05668D] text-[#05668D] bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Users size={16} /> Patient Bookings ({appointments.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
                {activeTab === 'announcement' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#05668D] mb-2">
                        Live Announcement Bar Message
                      </label>
                      <p className="text-xs text-slate-500 mb-3">
                        This text displays prominently at the very top of the website for all patients.
                      </p>
                      <textarea
                        rows={3}
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                        className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#05668D] text-sm"
                        placeholder="e.g., Consultations at Paterson Cancer Center (6-9 PM Mon-Sat), SIMS Hospital (3-4 PM Mon/Wed/Fri) & Billroth RA Puram | By Prior Appointment"
                      />
                    </div>
                    {announcementMsg && (
                      <p className="text-xs text-green-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={14} /> {announcementMsg}
                      </p>
                    )}
                    <button
                      onClick={handleSaveAnnouncement}
                      disabled={isSavingAnnouncement}
                      className="px-6 py-3 rounded-xl bg-[#05668D] hover:bg-[#028090] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
                    >
                      {isSavingAnnouncement ? <Loader2 size={16} className="animate-spin" /> : 'Publish Announcement'}
                    </button>
                  </div>
                )}

                {activeTab === 'upload' && (
                  <div className="space-y-6">
                    <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-gray-200 space-y-4">
                      <h4 className="text-sm font-bold text-[#0B2545] uppercase tracking-wide">
                        Upload Clinical Case Photo / Video
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                            Title / Case Description
                          </label>
                          <input
                            type="text"
                            value={uploadTitle}
                            onChange={(e) => setUploadTitle(e.target.value)}
                            placeholder="e.g. TOETVA Scarless Port Placement"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#05668D]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                            Category
                          </label>
                          <select
                            value={uploadCategory}
                            onChange={(e) => setUploadCategory(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#05668D]"
                          >
                            <option>Thyroid</option>
                            <option>Scarless TOETVA</option>
                            <option>Parathyroid</option>
                            <option>Adrenal</option>
                            <option>Breast Oncoplasty</option>
                            <option>Academic & Awards</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*,video/*"
                          className="hidden"
                          id="admin-file-input"
                        />
                        <label
                          htmlFor="admin-file-input"
                          className={`w-full py-4 px-6 border-2 border-dashed border-[#05668D]/30 hover:border-[#05668D] rounded-2xl bg-white flex flex-col items-center justify-center cursor-pointer transition-all ${
                            isUploading ? 'opacity-50 pointer-events-none' : ''
                          }`}
                        >
                          <Upload className="text-[#05668D] mb-2" size={28} />
                          <span className="text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                            {isUploading ? 'Uploading to Server...' : 'Click to Select Image or Video'}
                          </span>
                          <span className="text-[11px] text-slate-400 mt-1">
                            Supported: JPG, PNG, WEBP, MP4, WEBM
                          </span>
                        </label>
                      </div>

                      {uploadSuccess && (
                        <p className="text-xs text-green-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={14} /> {uploadSuccess}
                        </p>
                      )}
                    </div>

                    {/* Media Items Manager */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Uploaded Media Items ({mediaList.length})
                      </h4>
                      {loadingMedia ? (
                        <div className="py-8 flex justify-center text-slate-400">
                          <Loader2 size={24} className="animate-spin" />
                        </div>
                      ) : mediaList.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No media items uploaded yet.</p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {mediaList.map((item) => (
                            <div key={item.id} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-slate-100 aspect-video flex items-center justify-center">
                              {item.type.includes('video') ? (
                                <Film className="text-slate-400" size={24} />
                              ) : (
                                <img
                                  src={`/uploads/${item.filename}`}
                                  alt={item.title || 'Clinical Media'}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleDeleteMedia(item.id)}
                                  className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                                  title="Delete item"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'appointments' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-[#0B2545] uppercase tracking-wide">
                        Patient Appointment Submissions
                      </h4>
                      <button
                        onClick={loadAdminData}
                        className="text-xs text-[#05668D] hover:underline font-semibold"
                      >
                        Refresh List
                      </button>
                    </div>

                    {loadingAppointments ? (
                      <div className="py-12 flex justify-center text-slate-400">
                        <Loader2 size={24} className="animate-spin" />
                      </div>
                    ) : appointments.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-gray-100 text-slate-400 text-xs">
                        No appointments submitted yet. All submissions via the website form will appear here.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {appointments.map((apt) => (
                          <div
                            key={apt.id}
                            className="p-4 rounded-2xl bg-[#FAF9F6] border border-gray-200 hover:border-[#05668D] transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                              <div>
                                <span className="font-bold text-[#0B2545] text-sm">{apt.name}</span>
                                <span className="text-xs text-slate-500 ml-2">({apt.city})</span>
                              </div>
                              <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#05668D]/10 text-[#05668D] font-bold w-fit">
                                {apt.specialty}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 space-y-1">
                              <p>
                                <strong className="text-slate-800">Phone:</strong>{' '}
                                <a href={`tel:${apt.phone}`} className="text-[#05668D] font-bold hover:underline">
                                  {apt.phone}
                                </a>
                              </p>
                              {apt.preferred_date && (
                                <p>
                                  <strong className="text-slate-800">Preferred Date:</strong> {apt.preferred_date}
                                </p>
                              )}
                              {apt.symptoms && (
                                <p>
                                  <strong className="text-slate-800">Symptoms:</strong> {apt.symptoms}
                                </p>
                              )}
                              <p className="text-[10px] text-slate-400 pt-1">
                                Booked on: {new Date(apt.booked_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-slate-600 font-bold text-xs hover:bg-white transition-colors"
                >
                  Close Portal
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
