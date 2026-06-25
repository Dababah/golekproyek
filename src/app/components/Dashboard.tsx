import { motion } from "motion/react";
import {
  Flame,
  TrendingUp,
  Users,
  DollarSign,
  Search,
  Plus,
  MapPin,
  Star,
  Phone,
  Instagram,
  ChevronRight,
  Sparkles,
  Target,
  Globe,
  XCircle,
  Briefcase,
  RefreshCw,
  BarChart3
} from "lucide-react";
import { useState } from "react";
import { LeadDrawer } from "./LeadDrawer";

export interface Lead {
  id: string;
  name: string;
  rating: number;
  address: string;
  phone: string;
  website: string | null;
  status: LeadStatus;
  igHandle?: string;
  image: string;
  category: string;
  campaign: string;
}

export type LeadStatus =
  | "BARU"
  | "POTENSIAL"
  | "DIHUBUNGI"
  | "NEGOSIASI"
  | "CLOSING"
  | "TIDAK_MINAT";

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Kopi Klotok Jogja",
    rating: 4.8,
    address: "Jl. Kaliurang KM 5, Sleman",
    phone: "+6281234567890",
    website: null,
    status: "BARU",
    category: "Cafe",
    campaign: "Cafe & Resto Sleman",
    image:
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzgyMzIwMjI5fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "2",
    name: "Resto Omah Semar",
    rating: 4.9,
    address: "Jl. Malioboro 45, Yogyakarta",
    phone: "+6281234567891",
    website: null,
    status: "POTENSIAL",
    igHandle: "@omahsemar_jogja",
    category: "Restaurant",
    campaign: "Cafe & Resto Sleman",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN0YXVyYW50fGVufDF8fHx8MTc4MjMzNzA5OXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "3",
    name: "Warung Gudeg Pawon",
    rating: 4.7,
    address: "Jl. Wijilan 22, Yogyakarta",
    phone: "+6281234567892",
    website: null,
    status: "DIHUBUNGI",
    igHandle: "@gudegpawon",
    category: "Restaurant",
    campaign: "Kuliner Kota Yogyakarta",
    image:
      "https://images.unsplash.com/photo-1569096651661-820d0de8b4ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzgyMzM3MTAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "4",
    name: "Bakery Roti Unyil",
    rating: 4.6,
    address: "Jl. Gejayan 12, Sleman",
    phone: "+6281234567893",
    website: "https://rotiunyil.com",
    status: "TIDAK_MINAT",
    category: "Bakery",
    campaign: "Cafe & Resto Sleman",
    image:
      "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBzaG9wfGVufDF8fHx8MTc4MjMzNzEwMHww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "5",
    name: "Angkringan Lik Man",
    rating: 4.9,
    address: "Jl. Terban, Gondokusuman",
    phone: "+6281234567894",
    website: null,
    status: "BARU",
    category: "Street Food",
    campaign: "Kuliner Kota Yogyakarta",
    image:
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzgyMzIwMjI5fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "6",
    name: "Sate Klathak Pak Pong",
    rating: 4.8,
    address: "Jl. Imogiri Timur KM 5",
    phone: "+6281234567895",
    website: null,
    status: "NEGOSIASI",
    igHandle: "@sateklathak_pakpong",
    category: "Restaurant",
    campaign: "Kuliner Kota Yogyakarta",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN0YXVyYW50fGVufDF8fHx8MTc4MjMzNzA5OXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "7",
    name: "Klinik Kecantikan Aura",
    rating: 4.7,
    address: "Jl. Seturan Raya 8, Sleman",
    phone: "+6281234567896",
    website: null,
    status: "CLOSING",
    igHandle: "@klinik_aura_jogja",
    category: "Klinik",
    campaign: "Klinik Kecantikan Bantul",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjbGluaWN8ZW58MXx8fHwxNzgyMzIwMjI5fDA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

type FilterTab = "all" | "hot" | "dihubungi" | "negosiasi";

const statusConfig: Record<LeadStatus, { label: string; color: string }> = {
  BARU: { label: "Baru", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  POTENSIAL: { label: "Potensial", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  DIHUBUNGI: { label: "Dihubungi", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  NEGOSIASI: { label: "Negosiasi", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  CLOSING: { label: "Closing ✓", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  TIDAK_MINAT: { label: "Tidak Minat", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" }
};

const filterTabs: { id: FilterTab; label: string; icon?: React.ReactNode }[] = [
  { id: "all", label: "Semua Prospek" },
  { id: "hot", label: "🔥 Prioritas: Belum Punya Web" },
  { id: "dihubungi", label: "Sudah Dihubungi" },
  { id: "negosiasi", label: "Tahap Negosiasi" }
];

export function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("Yogyakarta");
  const [isSearching, setIsSearching] = useState(false);

  const filteredLeads = leads.filter((lead) => {
    if (selectedFilter === "hot") return !lead.website;
    if (selectedFilter === "dihubungi") return lead.status === "DIHUBUNGI";
    if (selectedFilter === "negosiasi") return lead.status === "NEGOSIASI";
    return true;
  });

  const hotLeadsCount = leads.filter((l) => !l.website).length;
  const ongoingCount = leads.filter((l) => l.status === "CLOSING").length;
  const totalRevenue = "Rp 45.000.000";
  const totalProspek = leads.length;

  const handleSearchProspek = () => {
    if (!keyword) return;
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 2000);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
    );
    setSelectedLead(updatedLead);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950 text-white">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/4 w-3/4 h-3/4 bg-emerald-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/4 w-3/4 h-3/4 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.01 }}>
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-emerald-500 rounded-2xl blur-xl opacity-50"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 p-2.5 rounded-2xl shadow-lg">
                  <Target className="w-7 h-7" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                  GolekProyek
                </h1>
                <p className="text-xs text-gray-400 -mt-0.5">Gak perlu ribet, urusan klien beres.</p>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              Campaign Baru
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Hot Leads",
              value: hotLeadsCount,
              sub: "Butuh website",
              icon: Flame,
              gradient: "from-red-500 to-orange-500",
              glow: "bg-gradient-to-r from-red-500 to-orange-500",
              textColor: "text-orange-400",
              delay: 0.1
            },
            {
              label: "Total Prospek",
              value: totalProspek,
              sub: "3 campaign aktif",
              icon: Users,
              gradient: "from-emerald-500 to-teal-500",
              glow: "bg-gradient-to-r from-emerald-500 to-teal-500",
              textColor: "text-emerald-400",
              delay: 0.2
            },
            {
              label: "Proyek Ongoing",
              value: ongoingCount,
              sub: "Dalam pengerjaan",
              icon: Briefcase,
              gradient: "from-blue-500 to-purple-500",
              glow: "bg-gradient-to-r from-blue-500 to-purple-500",
              textColor: "text-blue-400",
              delay: 0.3
            },
            {
              label: "Total Omset",
              value: totalRevenue,
              sub: "Akumulasi closing",
              icon: DollarSign,
              gradient: "from-purple-500 to-pink-500",
              glow: "bg-gradient-to-r from-purple-500 to-pink-500",
              textColor: "text-purple-400",
              delay: 0.4
            }
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stat.delay }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative"
              >
                <div
                  className={`absolute inset-0 ${stat.glow} rounded-2xl blur-xl opacity-20 group-hover:opacity-35 transition-opacity`}
                />
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="text-gray-400 text-xs truncate">{stat.label}</p>
                      <h3
                        className={`text-3xl font-black mt-1 ${stat.textColor} ${
                          typeof stat.value === "string" ? "text-xl mt-2 font-bold" : ""
                        }`}
                      >
                        {stat.value}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
                    </div>
                    <div
                      className={`bg-gradient-to-br ${stat.gradient} bg-opacity-20 p-2.5 rounded-xl opacity-80`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cari Prospek Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl blur-xl" />
          <div className="relative bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-xl">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-white">Cari Prospek Baru</h2>
                <p className="text-xs text-gray-400">Temukan bisnis lokal dari Google Maps</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Kata kunci, misal: cafe, kuliner, klinik..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchProspek()}
                  className="w-full bg-white/8 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm transition-all"
                />
              </div>
              <div className="flex-1 sm:max-w-[200px] relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <input
                  type="text"
                  placeholder="Lokasi..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white/8 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSearchProspek}
                disabled={isSearching || !keyword}
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm whitespace-nowrap"
              >
                {isSearching ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.div>
                    Mencari...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Cari Prospek
                  </>
                )}
              </motion.button>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Setiap pencarian mengambil 10–20 data bisnis. Duplikasi dicegah otomatis via PlaceID.
            </p>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-2"
        >
          {filterTabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedFilter === tab.id
                  ? tab.id === "hot"
                    ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/30"
                    : "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-white/8 text-gray-300 border border-white/10 hover:bg-white/15"
              }`}
            >
              {tab.label}
              {tab.id !== "all" && (
                <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded-md text-xs">
                  {tab.id === "hot"
                    ? leads.filter((l) => !l.website).length
                    : tab.id === "dihubungi"
                    ? leads.filter((l) => l.status === "DIHUBUNGI").length
                    : leads.filter((l) => l.status === "NEGOSIASI").length}
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredLeads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + index * 0.07 }}
              whileHover={{ y: -6, scale: 1.015 }}
              onClick={() => setSelectedLead(lead)}
              className={`group relative cursor-pointer ${
                lead.website ? "opacity-60 hover:opacity-80" : ""
              }`}
            >
              <div
                className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-25 transition-opacity ${
                  !lead.website
                    ? "bg-gradient-to-r from-red-500 to-orange-500"
                    : "bg-gradient-to-r from-slate-400 to-gray-400"
                }`}
              />

              <div
                className={`relative backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border transition-colors ${
                  !lead.website
                    ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20"
                    : "bg-gradient-to-br from-white/5 to-white/2 border-white/10"
                }`}
              >
                {/* Hot Badge */}
                {!lead.website && (
                  <motion.div
                    className="absolute top-3 right-3 z-10 bg-gradient-to-r from-red-500 to-orange-500 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg text-xs font-bold"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    HOT
                  </motion.div>
                )}

                <div className="flex gap-4 p-5">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                    <img
                      src={lead.image}
                      alt={lead.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <h3 className="text-base font-bold text-white leading-tight truncate pr-8">
                          {lead.name}
                        </h3>
                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-md mt-1 inline-block">
                          {lead.campaign}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-500/15 px-2 py-1 rounded-lg flex-shrink-0">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-yellow-400">{lead.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-1 mb-3 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{lead.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        {lead.website ? (
                          <>
                            <Globe className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span className="truncate text-emerald-400/70">{lead.website}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                            <span className="text-red-400/80">Belum punya website</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                          statusConfig[lead.status].color
                        }`}
                      >
                        {statusConfig[lead.status].label}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {lead.igHandle && (
                          <div className="bg-pink-500/15 p-1.5 rounded-lg">
                            <Instagram className="w-3.5 h-3.5 text-pink-400" />
                          </div>
                        )}
                        {lead.phone && (
                          <div className="bg-green-500/15 p-1.5 rounded-lg">
                            <Phone className="w-3.5 h-3.5 text-green-400" />
                          </div>
                        )}
                        <motion.div
                          className="bg-emerald-500/15 p-1.5 rounded-lg"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLeads.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
              <BarChart3 className="w-14 h-14 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-300 mb-2">Tidak ada prospek</h3>
              <p className="text-sm text-gray-500">Coba pilih filter lain atau cari prospek baru di atas.</p>
            </div>
          </motion.div>
        )}

        {/* Load More */}
        {filteredLeads.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white/8 border border-white/15 hover:bg-white/15 px-8 py-3 rounded-xl text-sm font-medium text-gray-300 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Load More / Halaman Berikutnya
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Lead Drawer */}
      {selectedLead && (
        <LeadDrawer
          lead={selectedLead}
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={handleUpdateLead}
        />
      )}
    </div>
  );
}
