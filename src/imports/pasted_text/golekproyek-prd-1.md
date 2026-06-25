Berikut adalah **Product Requirements Document (PRD) Lengkap, Final, dan Super Lean untuk GolekProyek v1.0**. Dokumentasi ini telah disesuaikan total dengan membuang semua sistem manajemen akun (*dummy/asli*), membuang QStash, membuang dual DB, dan mengadopsi 100% pola arsitektur aman seperti **Core Pawas Gadget Second**.

---

# Product Requirements Document (PRD)

## GolekProyek v1.0 — AI-Powered Web Dev Acquisition CRM

* **Status:** Siap Eksekusi (Final)
* **Versi:** 1.4 (Revised)
* **Tanggal:** Juni 2026
* **Owner:** Fawas
* **Stack Utama:** Next.js 15 (App Router) · Neon (PostgreSQL via Prisma) · Gemini API · TailwindCSS + Shadcn/UI · Vercel

---

## 1. Latar Belakang & Tujuan Bisnis

**GolekProyek** adalah platform CRM taktis yang dibangun khusus untuk mengotomatisasi pencarian dan akuisisi klien **Jasa Pembuatan Website (Web Dev Agency)**.

### Problem:

Proses mencari bisnis lokal (cafe, resto, dll.) yang potensial secara manual lewat Google Maps sangat memakan waktu. Menyeleksi satu per satu mana bisnis yang sudah ramai tapi belum punya website, mencari kontak sosial medianya, serta menyusun pesan penawaran yang personal sering kali melelahkan dan tidak terorganisir dengan baik.

### Solusi v1.0 (Pola Core Pawas):

Sistem ini bertindak sebagai papan data pemburu prospek (*crawler*) sekaligus asisten pintar. Sistem mencari data bisnis dari Google Maps secara anonim, menyaringnya secara mutlak berbasis biner (Punya Web vs Tidak Punya Web), dan menggunakan AI Gemini untuk menyusun draf pesan penawaran dengan bahasa campuran Indonesia-Jawa Jogja yang persuasif.

Aplikasi **TIDAK MEMBUTUHKAN** token, login, password, atau integrasi akun Instagram/WhatsApp asli maupun *dummy* milik Fawas. Keamanan akun 100% terjaga karena proses pengiriman pesan mengandalkan *deep-link browser* dan eksekusi *copy-paste* mandiri oleh Fawas, persis seperti kenyamanan pada sistem Core Pawas Gadget.

---

## 2. Arsitektur Sistem & Data Pipeline Sederhana

Meniru kesederhanaan arsitektur data pipeline pada proyek *Core Pawas*, sistem ini membuang antrean pihak ketiga (*QStash/Queue Management*) dan menggantinya dengan **Direct Paginated Server Actions**.

```
[UI Dashboard] ──(Klik Cari: 10-20 Data/Halaman)──> [Next.js Server Action]
                                                            │
   ┌────────────────────────────────────────────────────────┴──────┐
   ▼ (Hit Sinkron 3-5 detik)                                       ▼ (Upsert & Filter)
[SerpApi Google Maps] ═════(Return JSON Results)═════> [Neon PostgreSQL via Prisma]
                                                                   │
                                                                   ▼
                                                       [revalidatePath('/dashboard')]

```

* **Pencegahan Timeout Vercel:** Pencarian dibatasi per 1 halaman (10–20 hasil bisnis) per satu kali klik tombol. Ini menjamin *request* ke SerpApi selesai dalam waktu 3–5 detik saja, sangat aman dari batas *timeout* *serverless function* gratisan Vercel.
* **Satu Database (Single Source of Truth):** Seluruh data terpusat pada **Neon PostgreSQL**. Tidak perlu MongoDB Atlas tambahan; data hasil *scraping* disimpan langsung dalam kolom terstruktur atau teks biasa pada PostgreSQL melalui Prisma Client.

---

## 3. Struktur Data — Prisma Schema Complete

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ─── ENUMS ───────────────────────────────────────────────

enum LeadStatus {
  BARU           // Data baru hasil scraping, belum di-outreach
  POTENSIAL      // Terverifikasi valid dan sangat potensial ditawari web
  DIHUBUNGI      // Sudah dikirimi pesan penawaran (IG DM / WhatsApp)
  NEGOSIASI      // Sedang dalam diskusi fitur/harga website
  CLOSING        // Sukses deal menjadi proyek web dev
  TIDAK_MINAT    // Prospek menolak atau tidak merespons
}

enum ProjectStatus {
  ONGOING        // Website sedang didevelop
  DONE           // Proyek selesai, website diserahterimakan
  CANCELLED      // Proyek dibatalkan oleh salah satu pihak
}

// ─── MODELS ──────────────────────────────────────────────

model Campaign {
  id        String   @id @default(cuid())
  name      String   // e.g., "Cafe & Resto Sleman", "Klinik Kecantikan Bantul"
  keyword   String   // e.g., "cafe", "aesthetic clinic"
  location  String   @default("Yogyakarta")
  createdAt DateTime @default(now())
  leads     Lead[]
}

model Lead {
  id           String     @id @default(cuid())
  placeId      String     @unique // ID Unik Google Maps untuk pencegahan data double (Deduplication)
  name         String     // Nama Bisnis / Tempat
  phone        String?    // Nomor Telepon / WhatsApp yang terdaftar di Maps
  address      String?    // Alamat lengkap fisik
  website      String?    // Link website. Jika NULL atau KOSONG = Hot Lead (Target Utama Jasa Web)
  googleRating Float?
  status       LeadStatus @default(BARU)
  
  // Sosmed Enrichment (Instagram)
  igHandle     String?    // @username instagram target (diisi manual oleh user)
  igFollowers  Int?       // Jumlah followers (opsional)
  igBio        String?    @db.Text
  
  notes        String?    @db.Text // Catatan kustom dari Fawas selama follow-up
  campaignId   String
  campaign     Campaign   @relation(fields: [campaignId], references: [id])
  project      Project?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  @@index([status])
  @@index([campaignId])
}

model Project {
  id          String        @id @default(cuid())
  leadId      String        @unique
  lead        Lead          @relation(fields: [leadId], references: [id])
  projectName String        // e.g., "Landing Page & Digital Menu Cafe Kopi Konco"
  fee         Decimal       @db.Decimal(12, 2)
  dpPaid      Decimal       @db.Decimal(12, 2) @default(0) // Pencatatan Uang Muka / DP masuk
  isFullPaid  Boolean       @default(false)             // Status pelunasan proyek
  status      ProjectStatus @default(ONGOING)
  notes       String?       @db.Text
  startDate   DateTime      @default(now())
  endDate     DateTime?
}

```

---

## 4. Logika Bisnis & Penyaringan Utama (Binary Logic)

Sistem membuang logika analisis subjektif (seperti mendeteksi web lama/lambat). Penyaringan dilakukan secara absolut menggunakan *Binary Logic* pada ketersediaan data website di Google Maps:

1. **Ada Website (`website != null`):** Dikategorikan sebagai prospek rendah. Data tetap disimpan agar tidak ter-*scrape* ulang, namun diberi warna redup (abu-abu) di UI.
2. **Tidak Ada Website (`website == null` atau string kosong):** Sistem otomatis menandai entri ini sebagai **🔥 HOT LEAD / PRIORITAS UTAMA**. Di halaman dashboard utama, baris ini otomatis mendapatkan penanda khusus yang mencolok agar segera dieksekusi.

---

## 5. Integrasi AI Agent & Persona Penjualan (Gaya Jogja)

Sistem menggunakan **Gemini API (`gemini-1.5-flash`)** secara langsung (*direct hit*) dari Server Action untuk membuat draf penawaran di dalam komponen Side Drawer detail lead.

### System Prompt Persona:

```
Kamu adalah asisten CRM personal milik Fawas, seorang full-stack website developer profesional yang berbasis di Yogyakarta. Tugasmu adalah membuat draf teks pesan penawaran pembuatan website (bisa berupa landing page, web profil bisnis, atau menu digital berbasis QR) yang ditujukan kepada pemilik bisnis lokal.

Aturan Penulisan Pesan:
1. Gunakan bahasa campuran Indonesia-Jawa Jogja yang santai, sopan, ngajeni (menghormati klien dengan sapaan mas/mbak/pak/bu sesuai jenis bisnis), persuasif, dan tidak kaku/hard-selling.
2. Manfaatkan data keunggulan bisnis mereka (sebutkan nama bisnis dan rating Google Maps mereka yang sudah bagus).
3. Tekankan kelemahannya secara halus: "Bisnisnya sudah ramai dan ulasannya bagus sekali, sayang sekali di Google Maps belum terpasang link website resmi untuk meningkatkan kredibilitas brand atau menampilkan menu & reservasi online".
4. Tawarkan solusi dengan harga yang bersahabat ("harga konco dewe").

```

### Contoh Output Teks Jadi di UI:

> *"Halo mas/mbak pemilik **Cafe Kopi Konco**, salam kenal saya Fawas dari Jogja. Kebetulan wingi mampir moco review usahane njenengan ten Google Maps, mantep tenan ulasane wes bintang **4.7**. Sayang banget pas tak cek jebul belum ada link website resminya mas/mbak.*
> *Padahal nggo bisnis sek wes berkembang lan rame ngeten, nek wonten landing page resmi nggo nampilke daftar menu utowo kontak reservasi, bakalan ketok luwih profesional lan naik kelas brand-e. Kebetulan kulo nembe wonten slot nggo bantu bikin web UMKM daerah Jogja dengan harga konco dewe. Nek sekirane longgar, saged ngobrol-ngobrol riyin mas/mbak, niki portofolio kulo..."*

---

## 6. Alur Kerja Operasional Tanpa Akun (End-to-End)

1. **Pencarian Prospek (Ingestion):** Fawas menginput kata kunci (e.g., `"kuliner"`) dan lokasi (e.g., `"Kasihan Bantul"`) pada form dashboard $\rightarrow$ Klik `[Cari Prospek]` $\rightarrow$ Server Action memanggil SerpApi untuk 20 data pertama $\rightarrow$ Hasil disimpan ke Neon DB dengan seleksi otomatis anti-duplikat via `@unique placeId`.
2. **Penyaringan Otomatis (Filtering):** Dashboard memunculkan daftar bisnis. Data yang tidak memiliki website langsung mendapatkan *badge* **🔥 Butuh Web**.
3. **Pengayaan Data Media Sosial (Enrichment):** Fawas mengklik baris lead $\rightarrow$ Side Drawer terbuka dari kanan. Fawas memasukkan `@username` Instagram bisnis tersebut secara manual ke kolom `igHandle` yang tersedia di drawer berdasarkan pencarian sekilas.
4. **Pembuatan Pesan (AI Generation):** Fawas mengklik tombol `[Generate Penawaran Web]`. Sistem menembak Gemini API dan menampilkan kotak teks draf berisi pesan penawaran kustom gaya Jogja.
5. **Deep-Linking Outreach (Pola Core Pawas):** Fawas mengklik tombol `[🚀 Buka IG & Kirim]`. Sistem menyalin teks draf buatan AI ke clipboard browser secara otomatis, lalu membuka tab browser baru mengarah ke `[https://instagram.com/](https://instagram.com/)[igHandle]` (atau `[https://wa.me/](https://wa.me/)[phone]`). Browser bawaan laptop/HP Fawas yang sudah login akun pribadinya akan langsung membuka halaman chat target. Fawas tinggal menekan *Paste (Ctrl+V)* dan kirim. Status lead otomatis berubah menjadi `DIHUBUNGI`.
6. **Manajemen Proyek (Closing):** Apabila klien deal, Fawas mengganti status lead menjadi `CLOSING`. Sebuah form cepat akan muncul untuk membuat data baru ke tabel `Project` (Mengisi nama proyek, nilai kontrak/*fee*, dan jumlah uang muka/DP).

---

## 7. Desain Antarmuka (Dashboard UI Specification)

### 7.1 Layout Halaman Utama (`/dashboard`)

* **Top Bar Stats:** Ringkasan performa bisnis saat ini: `Total Hot Leads (Tanpa Web): X` | `Proyek Berjalan (Ongoing): Y` | `Total Omset Terkumpul: Rp XX.XXX.XXX`.
* **Control Panel:** Form pencarian ringkas berisi 2 input teks (Keyword & Lokasi) dan 1 tombol aksi `[Cari Prospek]`.
* **Quick Filter Toggle:** Tombol tab filter cepat: `[Semua Prospek]` | `[🔥 Prioritas: Belum Punya Web]` | `[Sudah Dihubungi]` | `[Tahap Negosiasi]`.
* **Tabel Leads:** Menyajikan data kolom: Nama Bisnis, Rating, Alamat, Website (Tanda silang merah jika kosong), Status Badge, dan Tanggal di-scrape. Di bagian bawah tabel terdapat tombol `[Load More / Halaman Berikutnya]` untuk melakukan scraping halaman selanjutnya secara bertahap dan aman.

### 7.2 Panel Aksi Kanan (Right Side Drawer)

* **Bagian Atas (Profil Bisnis):** Menampilkan nama bisnis, alamat, rating Google Maps, serta input form manual untuk menyimpan nomor WhatsApp (`phone`) dan `@username` Instagram (`igHandle`).
* **Bagian Tengah (AI Copywriting Desk):** Kotak teks tempat draf pesan penawaran buatan Gemini dirender. Dilengkapi dengan tombol `[🔄 Buat Ulang Teks]` dan tombol utama `[📋 Salin Teks & Buka IG]`.
* **Bagian Bawah (Status & Project Controller):** Menu *dropdown* manual untuk memperbarui status prospek (`BARU` $\rightarrow$ `DIHUBUNGI` $\rightarrow$ `NEGOSIASI` $\rightarrow$ `CLOSING`). Jika memilih status `CLOSING`, panel akan memunculkan isian form proyek berupa: *Nama Proyek*, *Total Nilai Kontrak (Fee)*, dan *DP Masuk*.

---

## 8. Aturan Wajib Pengembangan & Kode (Guidelines)

1. **Dilarang Keras Melakukan Hard Delete:** Menghapus prospek tidak diperbolehkan di level database agar histori data kampanye scraping tetap utuh. Jika suatu bisnis menolak penawaran, cukup pindahkan statusnya menjadi `TIDAK_MINAT`.
2. **Revalidasi Data Instan:** Setiap kali Fawas melakukan mutasi data di dalam drawer, Server Action wajib mengeksekusi fungsi `revalidatePath('/dashboard')` di akhir baris kode agar tabel utama langsung terperbarui tanpa *force-reload* halaman browser.
3. **Pencegahan Duplikasi Otomatis:** Manfaatkan batasan unik (`@unique`) dari field `placeId` bawaan Google Maps pada skema Prisma. Logika kode *crawler* harus melakukan bypass (*skip*) jika menemukan ID tempat yang sudah eksis di database Neon.
4. **Autentikasi Sederhana Single-User:** Menggunakan konfigurasi NextAuth.js v5 paling dasar berbasis *credentials provider*. Username (`AUTH_USER=fawas`) dan *password hash* disimpan langsung pada *Environment Variables* Vercel tanpa perlu membuat manajemen tabel user baru yang rumit.