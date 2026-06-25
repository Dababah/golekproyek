GolekProyek v1.0 — Product Requirements Document (Fokus Jasa Web)Status: Siap Eksekusi | Versi: 1.2 (Revised) | Tanggal: Juni 2026Owner: Fawas | Stack: Next.js 15 (App Router) · Neon (PostgreSQL via Prisma) · Gemini API · Upstash (QStash & Redis) · Vercel1. Latar Belakang & TujuanGolekProyek v1.0 adalah AI-Powered Outreach CRM yang dirancang khusus untuk mengotomatisasi pencarian dan akuisisi klien Jasa Pembuatan Website. Sistem ini fokus memecahkan masalah manual dalam mencari bisnis lokal (UMKM/Cafe/Resto) yang sudah memiliki reputasi bagus di Google Maps tetapi belum memiliki website resmi.Sistem akan otomatis menyaring bisnis yang tidak memiliki website, membantu Mas Fawas menyusun pesan penawaran berbasis local pride (Bahasa campuran Indonesia-Jogja yang persuasif) via Gemini AI, dan memantau status proyek dari lead yang berhasil closing.2. Arsitektur Sistem & Tech Stack SederhanaFrontend & Backend Layer: Next.js 15+ dengan TypeScript (Strict Mode) dan Server Actions untuk logika internal & CRUD. Styling menggunakan TailwindCSS + Shadcn/UI. State management UI cukup menggunakan Zustand.Database (Single DB): Neon (PostgreSQL via Prisma) sebagai satu-satunya source of truth. Tidak menggunakan MongoDB untuk menyederhanakan infrastruktur. Data mentah atau tambahan disimpan langsung di kolom Json PostgreSQL.External Services:SerpApi (Google Maps API): Untuk scraping data bisnis lokal berdasarkan keyword dan lokasi.Gemini API (gemini-1.5-flash): Untuk membuat draf pesan penawaran personal secara instan.Upstash QStash: Mengelola antrean (queue) background job scraping agar Server Action Next.js tidak terkena timeout Vercel Serverless (maksimal 10–60 detik).Auth: NextAuth.js v5 berbasis Credentials Provider dengan single-user session (Username & Password disimpan aman sebagai environment variable di Vercel).3. Struktur Data — Prisma SchemaSkema database dibuat lean, langsung mengaitkan Campaign, Lead, dan Project tracking tanpa tabel-tabel log yang mempersulit CRUD awal.Cuplikan kodedatasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum LeadStatus {
  BARU           // Baru di-scrape & belum disentuh
  POTENSIAL      // Terverifikasi valid & siap ditawari web
  DIHUBUNGI      // Sudah dikirimi pesan penawaran (IG/WA)
  NEGOSIASI      // Tahap diskusi harga/fitur website
  CLOSING        // Sukses deal jadi proyek web
  TIDAK_MINAT    // Menolak penawaran
}

enum ProjectStatus {
  ONGOING        // Web sedang dikerjakan
  DONE           // Web selesai & serah terima
  CANCELLED      // Proyek batal di tengah jalan
}

model Campaign {
  id        String   @id @default(cuid())
  name      String   // Contoh: "Resto & Cafe Sleman"
  keyword   String   // Contoh: "cafe"
  location  String   @default("Yogyakarta")
  createdAt DateTime @default(now())
  leads     Lead[]
}

model Lead {
  id           String     @id @default(cuid())
  placeId      String     @unique // Guard deduplikasi agar tidak double-scrape
  name         String     // Nama Bisnis/UMKM
  phone        String?    // Nomor HP/WhatsApp bisnis
  address      String?    // Alamat fisik
  website      String?    // Link web. Jika null/kosong = Target Utama (Hot Lead)
  googleRating Float?
  status       LeadStatus @default(BARU)
  igHandle     String?    // Diinput manual di UI untuk keperluan deep-link outreach
  notes        String?    @db.Text
  campaignId   String
  campaign     Campaign   @relation(fields: [campaignId], references: [id])
  project      Project?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  @@index([status])
}

model Project {
  id          String        @id @default(cuid())
  leadId      String        @unique
  lead        Lead          @relation(fields: [leadId], references: [id])
  projectName String        // Contoh: "Landing Page & Digital Menu Cafe Omah"
  fee         Decimal       @db.Decimal(12, 2)
  dpPaid      Decimal       @db.Decimal(12, 2) @default(0) // Pencatatan Uang Muka (DP)
  isFullPaid  Boolean       @default(false)             // Status Pelunasan
  status      ProjectStatus @default(ONGOING)
  notes       String?       @db.Text
  startDate   DateTime      @default(now())
  endDate     DateTime?
}
4. Logika Bisnis & Filter Utama (Binary Logic)Sistem mengabaikan analisis subjektif (seperti menganalisis web lama/jelek). Penyaringan dilakukan secara absolut berdasarkan ketersediaan website:Ada Website (website != null): Dikategorikan sebagai prospek rendah. Tetap disimpan di DB tetapi di UI diberi tanda standar.Tidak Ada Website (website == null atau kosong): Ditandai otomatis oleh sistem sebagai 🔥 HOT LEAD / PRIORITAS UTAMA. Di halaman dashboard, baris ini akan mendapatkan badge khusus agar Mas Fawas bisa langsung mengeksekusi penawaran.5. AI Engine — Prompt & Persona (Gaya Jogja)Gemini API digunakan murni sebagai generator draf pesan teks penawaran yang diletakkan di dalam Side Drawer detail lead. Tidak ada sistem spintax manual; Gemini akan langsung memberikan variasi teks jadi.Sistem Prompt Persona:"Kamu adalah asisten CRM personal milik Fawas, seorang developer website profesional di Yogyakarta. Tugasmu menulis draf pesan penawaran pembuatan website (landing page, profil bisnis, atau menu digital) untuk pemilik bisnis lokal.Gunakan bahasa campuran Indonesia-Jawa Jogja yang santai, sopan, ngajeni (menghormati dengan sebutan mas/mbak/pak/bu), persuasif, dan tidak terkesan hard-selling.Tekankan poin bahwa bisnis mereka sudah sangat bagus dan ramai di Google Maps (sebutkan rating dan nama bisnisnya), namun sangat disayangkan belum memiliki website resmi untuk meningkatkan kredibilitas brand atau memudahkan pesanan/informasi."Contoh Output AI di UI:"Halo mas/mbak [Nama Bisnis], salam kenal saya Fawas dari Jogja. Kebetulan wingi mampir moco review [Nama Bisnis] ten Google Maps, mantep tenan ulasane wes bintang [Rating]. Sayang banget pas tak cek jebul belum ada link website resminya mas/mbak.Padahal nggo bisnis sek wes berkembang ngeten, nek wonten landing page resmi nggo nampilke menu utowo kontak reservasi, bakalan ketok luwih profesional lan naik kelas brand-e. Kebetulan kulo nembe wonten slot nggo bantu develop web UMKM daerah Jogja dengan harga konco dewe. Nek sekirane longgar, saged ngobrol-ngobrol riyin mas/mbak, niki portofolio kulo..."6. Alur Kerja Operasional Sederhana (End-to-End)Fase Ingestion: Mas Fawas memasukkan kata kunci (misal: "kuliner") dan lokasi ("Kasihan Bantul" atau "Sleman") $\rightarrow$ Request dikirim via QStash ke background worker $\rightarrow$ SerpApi mengembalikan list data bisnis $\rightarrow$ Data masuk ke database Neon.Fase Filtering: Halaman dashboard otomatis mengurutkan atau memfilter data. Bisnis tanpa website langsung naik ke baris paling atas dengan indikator merah/api (Hot Lead).Fase Review & Enrichment: Mas Fawas membuka baris lead lewat Side Drawer, memasukkan igHandle atau nomor WhatsApp bisnis jika ditemukan di internet secara sekilas.Fase AI Draft: Menekan tombol "Generate Penawaran", AI menyajikan draf pesan kustom berdasarkan nama bisnis dan ratingnya dengan gaya Jogja.Fase Kirim (Deep-linking): Mas Fawas menekan tombol "Kirim via IG" atau "Kirim via WA". Sistem akan membuka tab baru secara otomatis ([https://instagram.com/](https://instagram.com/)[igHandle] atau [https://wa.me/](https://wa.me/)[phone]). Mas Fawas cukup menyalin teks draf dari AI dan melakukan paste langsung ke chat klien. Status lead otomatis berubah menjadi DIHUBUNGI.Fase Proyek: Jika klien tertarik dan sepakat (Deal), status diubah ke CLOSING. Sistem memunculkan form cepat untuk membuat entri di tabel Project (Memasukkan nama proyek, total fee, dan jumlah DP yang masuk).7. Dashboard UI - Spasifikasi Esensial8.1 Dashboard UtamaHeader: Menampilkan total Lead Baru (Tanpa Web) dan ringkasan nilai proyek yang sedang berjalan (Ongoing Revenue).Tabel Utama: Menampilkan Kolom: Nama Bisnis, Rating Maps, Status Badge (BARU, DIHUBUNGI, dll), Website (berupa tanda silang merah jika kosong), dan Tombol Aksi.Filter Cepat: Tombol toggle untuk menyaring langsung: [Semua Prospek] atau [🔥 Butuh Website].8.2 Right Side Drawer (Action Panel)Panel geser dari kanan saat salah satu baris bisnis diklik, berisi 3 tab sederhana:Detail Bisnis: Nama, Alamat, Rating, input teks untuk igHandle dan phone.AI Outreach Chat: Kolom tempat draf teks penawaran dari Gemini muncul beserta tombol [📋 Salin Teks], [↗️ Buka IG], dan [💬 Buka WA].Project & Notes: Teks area bebas untuk mencatat hasil obrolan atau kendala, serta tombol cepat [💰 Ubah Jadi Proyek] jika status masuk ke tahapan Closing.8. Aturan Wajib Operasional Kode (Guidelines)Soft-Delete Hanya di Level UI: Prospek tidak benar-benar dihapus dari DB menggunakan DELETE demi menjaga histori data kampanye. Cukup gunakan filter status atau flag jika diperlukan, namun untuk v1.0 manipulasi status ke TIDAK_MINAT sudah menggantikan fungsi hapus.Revalidasi Data: Gunakan revalidatePath('/dashboard') di setiap akhir Server Action (saat update status atau penambahan catatan bisnis) agar UI selalu sinkron tanpa force-reload manual.Pencegahan Duplikasi: Kolom placeId dari Google Maps di-set @unique. Jika kata kunci pencarian baru menghasilkan bisnis yang sama dari pencarian lama, database otomatis mengabaikannya (safe insert / skip duplicate).