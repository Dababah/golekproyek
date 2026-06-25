import { motion, AnimatePresence } from "motion/react";
import {
  X,
  MapPin,
  Star,
  Phone,
  Instagram,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  DollarSign,
  FileText,
  Zap,
  Globe,
  XCircle,
  Send,
  RefreshCw,
  ChevronDown,
  Flame,
  Hash,
  Users,
  StickyNote
} from "lucide-react";
import { useState } from "react";
import type { Lead, LeadStatus } from "./Dashboard";

interface LeadDrawerProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
}

const statusOptions: { value: LeadStatus; label: string; color: string }[] = [
  { value: "BARU", label: "Baru", color: "text-blue-400" },
  { value: "POTENSIAL", label: "Potensial", color: "text-purple-400" },
  { value: "DIHUBUNGI", label: "Dihubungi", color: "text-yellow-400" },
  { value: "NEGOSIASI", label: "Negosiasi", color: "text-orange-400" },
  { value: "CLOSING", label: "✓ Closing", color: "text-emerald-400" },
  { value: "TIDAK_MINAT", label: "Tidak Minat", color: "text-gray-400" }
];

export function LeadDrawer({ lead, isOpen, onClose, onUpdate }: LeadDrawerProps) {
  const [activeTab, setActiveTab] = useState<"detail" | "ai" | "project">("detail");
  const [copied, setCopied] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Editable fields (local state)
  const [igHandle, setIgHandle] = useState(lead.igHandle || "");
  const [phone, setPhone] = useState(lead.phone || "");
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState("");

  // Project form
  const [projectName, setProjectName] = useState("");
  const [fee, setFee] = useState("");
  const [dp, setDp] = useState("");
  const [projectSaved, setProjectSaved] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(aiMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAndOpenIG = async () => {
    await navigator.clipboard.writeText(aiMessage);
    const handle = igHandle.replace("@", "");
    if (handle) {
      window.open(`https://instagram.com/${handle}`, "_blank");
    }
    handleStatusChange("DIHUBUNGI");
  };

  const handleCopyAndOpenWA = async () => {
    const cleanPhone = phone.replace(/\D/g, "");
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(aiMessage)}`,
      "_blank"
    );
    handleStatusChange("DIHUBUNGI");
  };

  const handleStatusChange = (newStatus: LeadStatus) => {
    setStatus(newStatus);
    onUpdate({ ...lead, status: newStatus, igHandle, phone });
  };

  const handleSaveContact = () => {
    onUpdate({ ...lead, igHandle, phone, status });
  };

  const handleSaveProject = () => {
    setProjectSaved(true);
    handleStatusChange("CLOSING");
    setTimeout(() => setProjectSaved(false), 2000);
  };

  const generateAIMessage = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const displayPhone = igHandle ? igHandle : lead.name;
      setAiMessage(
        `Halo mas/mbak pemilik ${lead.name}, salam kenal saya Fawas dari Jogja. ` +
          `Kebetulan wingi mampir moco review usahane njenengan ten Google Maps, mantep tenan ulasane wes bintang ${lead.rating}. ` +
          `Sayang banget pas tak cek jebul belum ada link website resminya mas/mbak.\n\n` +
          `Padahal nggo bisnis sek wes berkembang lan rame ngeten, nek wonten landing page resmi nggo nampilke ` +
          `daftar menu utowo kontak reservasi, bakalan ketok luwih profesional lan naik kelas brand-e.\n\n` +
          `Kebetulan kulo nembe wonten slot nggo bantu bikin web UMKM daerah Jogja dengan harga konco dewe. ` +
          `Nek sekirane longgar, saged ngobrol-ngobrol riyin mas/mbak, niki portofolio kulo... 🙏`
      );
      setIsGenerating(false);
    }, 1800);
  };

  const tabs = [
    { id: "detail", label: "Info & Kontak", icon: FileText },
    { id: "ai", label: "AI Generator", icon: Sparkles },
    { id: "project", label: "Proyek & Status", icon: DollarSign }
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] lg:w-[560px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-l border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
            </div>

            {/* Hero Image */}
            <div className="relative h-44 overflow-hidden flex-shrink-0">
              <img
                src={lead.image}
                alt={lead.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-slate-900" />

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-3 right-3 bg-black/50 backdrop-blur-xl p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {!lead.website && (
                <motion.div
                  className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg text-xs font-bold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Flame className="w-3.5 h-3.5" />
                  HOT LEAD
                </motion.div>
              )}
            </div>

            {/* Lead Title Row */}
            <div className="relative px-5 pt-4 pb-3 border-b border-white/10 flex-shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-white leading-tight truncate">{lead.name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{lead.category} · {lead.campaign}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-yellow-500/15 px-2.5 py-1.5 rounded-xl flex-shrink-0">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-yellow-400 text-sm">{lead.rating}</span>
                </div>
              </div>

              {/* Website status pill */}
              <div className="mt-2 flex items-center gap-2">
                {lead.website ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400/70 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    <Globe className="w-3 h-3" /> Punya Website
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                    <XCircle className="w-3 h-3" /> Belum Punya Website
                  </span>
                )}
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    statusOptions.find((s) => s.value === status)?.color ?? "text-gray-400"
                  } bg-white/5 border-white/10`}
                >
                  {statusOptions.find((s) => s.value === status)?.label}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="relative flex gap-1.5 px-5 py-3 border-b border-white/10 flex-shrink-0 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 whitespace-nowrap text-sm ${
                      activeTab === tab.id ? "text-white" : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="drawerTab"
                        className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl shadow-lg shadow-emerald-500/30"
                        transition={{ type: "spring", damping: 22, stiffness: 300 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Scrollable Content */}
            <div className="relative flex-1 overflow-y-auto px-5 py-5">
              <AnimatePresence mode="wait">
                {/* ─── TAB: INFO & KONTAK ─── */}
                {activeTab === "detail" && (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    className="space-y-5"
                  >
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Informasi Bisnis
                      </h3>

                      <motion.div whileHover={{ x: 4 }} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                        <div className="bg-emerald-500/15 p-2 rounded-lg flex-shrink-0">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Alamat</p>
                          <p className="text-sm text-white mt-0.5">{lead.address}</p>
                        </div>
                      </motion.div>

                      <motion.div whileHover={{ x: 4 }} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                        <div className="bg-purple-500/15 p-2 rounded-lg flex-shrink-0">
                          <ExternalLink className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Website</p>
                          <p className="text-sm mt-0.5">
                            {lead.website ? (
                              <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                {lead.website}
                              </a>
                            ) : (
                              <span className="text-red-400">❌ Belum punya website</span>
                            )}
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Enrichment Fields */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Enrichment Data
                      </h3>

                      <div>
                        <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
                          <Phone className="w-3.5 h-3.5" />
                          Nomor WhatsApp
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+6281234567890"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/40 transition-all"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
                          <Instagram className="w-3.5 h-3.5" />
                          Instagram Handle
                        </label>
                        <input
                          type="text"
                          value={igHandle}
                          onChange={(e) => setIgHandle(e.target.value)}
                          placeholder="@username_bisnis"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/40 transition-all"
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveContact}
                        className="w-full bg-white/8 border border-white/15 hover:bg-white/15 rounded-xl py-2.5 text-sm font-medium text-gray-200 transition-all"
                      >
                        Simpan Data Kontak
                      </motion.button>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2.5">
                      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Quick Actions</h3>

                      {phone && (
                        <motion.a
                          href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-3 bg-gradient-to-r from-green-700/80 to-green-600/80 hover:from-green-600 hover:to-green-500 border border-green-500/30 rounded-xl p-3.5 transition-all shadow-lg shadow-green-500/20"
                        >
                          <MessageCircle className="w-5 h-5 text-green-300" />
                          <div>
                            <p className="text-sm font-semibold">Buka WhatsApp</p>
                            <p className="text-xs text-green-300/70">Hubungi via WA</p>
                          </div>
                        </motion.a>
                      )}

                      {igHandle && (
                        <motion.a
                          href={`https://instagram.com/${igHandle.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-3 bg-gradient-to-r from-pink-700/80 to-purple-600/80 hover:from-pink-600 hover:to-purple-500 border border-pink-500/30 rounded-xl p-3.5 transition-all shadow-lg shadow-pink-500/20"
                        >
                          <Instagram className="w-5 h-5 text-pink-300" />
                          <div>
                            <p className="text-sm font-semibold">Buka Instagram</p>
                            <p className="text-xs text-pink-300/70">{igHandle}</p>
                          </div>
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ─── TAB: AI GENERATOR ─── */}
                {activeTab === "ai" && (
                  <motion.div
                    key="ai"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    className="space-y-5"
                  >
                    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-2.5 rounded-xl">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm">AI Gemini — Draf Penawaran</h3>
                          <p className="text-xs text-gray-400">Gaya bahasa Indonesia-Jawa Jogja</p>
                        </div>
                      </div>

                      {!aiMessage ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={generateAIMessage}
                          disabled={isGenerating}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl p-3.5 font-semibold text-sm shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isGenerating ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Zap className="w-4 h-4" />
                              </motion.div>
                              Generating pesan...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Generate Penawaran Web
                            </>
                          )}
                        </motion.button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-3"
                        >
                          <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-h-52 overflow-y-auto">
                            <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">
                              {aiMessage}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleCopy}
                              className="flex-1 bg-slate-700 hover:bg-slate-600 border border-white/10 rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                              {copied ? (
                                <>
                                  <Check className="w-4 h-4 text-emerald-400" />
                                  <span className="text-emerald-400">Tersalin!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  Salin Teks
                                </>
                              )}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={generateAIMessage}
                              className="px-3.5 bg-white/8 hover:bg-white/15 border border-white/10 rounded-xl transition-colors"
                              title="Buat ulang"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Send actions — only visible after message generated */}
                    {aiMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2.5"
                      >
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Kirim Pesan
                        </h3>

                        {igHandle && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCopyAndOpenIG}
                            className="w-full flex items-center gap-3 bg-gradient-to-r from-pink-700/80 to-purple-600/80 hover:from-pink-600 hover:to-purple-500 border border-pink-500/30 rounded-xl p-4 transition-all shadow-lg shadow-pink-500/20"
                          >
                            <div className="bg-white/15 p-2 rounded-lg">
                              <Instagram className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold">📋 Salin Teks & Buka IG</p>
                              <p className="text-xs text-pink-300/70">Clipboard otomatis → Paste di DM · Status → Dihubungi</p>
                            </div>
                          </motion.button>
                        )}

                        {phone && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCopyAndOpenWA}
                            className="w-full flex items-center gap-3 bg-gradient-to-r from-green-700/80 to-green-600/80 hover:from-green-600 hover:to-green-500 border border-green-500/30 rounded-xl p-4 transition-all shadow-lg shadow-green-500/20"
                          >
                            <div className="bg-white/15 p-2 rounded-lg">
                              <MessageCircle className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold">🚀 Kirim via WhatsApp</p>
                              <p className="text-xs text-green-300/70">Buka WA dengan pesan otomatis · Status → Dihubungi</p>
                            </div>
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* ─── TAB: PROYEK & STATUS ─── */}
                {activeTab === "project" && (
                  <motion.div
                    key="project"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    className="space-y-5"
                  >
                    {/* Status Dropdown */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Update Status Prospek
                      </h3>
                      <div className="relative">
                        <select
                          value={status}
                          onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                          className="w-full appearance-none bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all cursor-pointer"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-slate-800">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-gray-400 leading-relaxed">
                        <span className="text-gray-300 font-medium">Alur:</span>{" "}
                        BARU → POTENSIAL → DIHUBUNGI → NEGOSIASI → CLOSING{" "}
                        <span className="text-gray-500">(atau TIDAK_MINAT jika menolak)</span>
                      </div>
                    </div>

                    {/* Project Form — shows when CLOSING */}
                    <AnimatePresence>
                      {status === "CLOSING" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/25 rounded-xl p-5 space-y-4">
                            <div className="flex items-center gap-2.5 mb-2">
                              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg">
                                <DollarSign className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="font-bold text-white text-sm">Buat Proyek Baru</h3>
                                <p className="text-xs text-gray-400">Lead ini berhasil closing! 🎉</p>
                              </div>
                            </div>

                            <div>
                              <label className="text-xs text-gray-400 mb-1.5 block">Nama Proyek</label>
                              <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="Landing Page & Digital Menu Cafe..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-400 mb-1.5 block">Total Fee (Rp)</label>
                                <input
                                  type="text"
                                  value={fee}
                                  onChange={(e) => setFee(e.target.value)}
                                  placeholder="5.000.000"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-400 mb-1.5 block">DP Masuk (Rp)</label>
                                <input
                                  type="text"
                                  value={dp}
                                  onChange={(e) => setDp(e.target.value)}
                                  placeholder="2.500.000"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                                />
                              </div>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleSaveProject}
                              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl py-3 text-sm font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
                            >
                              {projectSaved ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  Proyek Tersimpan!
                                </>
                              ) : (
                                <>
                                  <DollarSign className="w-4 h-4" />
                                  💰 Buat Proyek
                                </>
                              )}
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Notes */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                        <StickyNote className="w-3.5 h-3.5" />
                        Catatan Follow-up
                      </h3>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Tulis catatan hasil obrolan, kendala, atau reminder..."
                        rows={5}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all resize-none"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-white/8 border border-white/15 hover:bg-white/15 rounded-xl py-2.5 text-sm font-medium text-gray-200 transition-all"
                      >
                        Simpan Catatan
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
