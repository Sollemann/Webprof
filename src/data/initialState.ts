import {
  BlockType,
  PaymentMethodId,
  SecurityAuditEntry,
  SecuritySetting,
  SeoConfig,
  SiteBlock,
  SiteThemeConfig,
  SubscriptionPlan,
  SubscriptionTierId,
  TransactionRecord,
} from '../types/builder';

export const GENERATED_ASSETS = {
  heroStudio: '/src/assets/images/hero_studio_workspace_1795511879057.jpg',
  coffeeCase: '/src/assets/images/case_study_coffee_1795511879022.jpg',
  furnitureCase: '/src/assets/images/case_study_furniture_1795511879451.jpg',
  interiorTemplate: '/src/assets/images/builder_template_interior_1795511882314.jpg',
};

export const INITIAL_THEME: SiteThemeConfig = {
  siteName: 'KayuLoka Studio',
  subdomain: 'kayuloka.rakitweb.id',
  accentColor: '#1D4ED8',
  radiusMode: 'medium',
  typographyStyle: 'modern',
};

export const INITIAL_SEO: SeoConfig = {
  metaTitle: 'KayuLoka Studio — Furnitur Jati Minimalis & Pembayaran Instan',
  metaDescription:
    'Koleksi furnitur kayu jati solid berkualitas arsitektural dengan pemesanan langsung, pembayaran QRIS dan Virtual Account terenkripsi.',
  slug: '/koleksi-jati-2026',
  canonicalDomain: 'https://kayuloka.rakitweb.id',
  ogTitle: 'KayuLoka Studio — Furnitur Jati Modern Indonesia',
  schemaType: 'Product',
  robotsIndex: true,
  sitemapAuto: true,
};

export const TEMPLATE_PRESETS: Record<string, {label: string; theme: SiteThemeConfig; blocks: SiteBlock[]}> = {
  furniture: {
    label: 'Studio Furnitur',
    theme: INITIAL_THEME,
    blocks: [
      {
        id: 'blk-hero-1',
        type: BlockType.Hero,
        title: 'Furnitur Jati Minimalis untuk Ruang Kerja & Hunian Modern',
        subtitle:
          'Dirancang dengan proporsi presisi dari kayu jati bersertifikat SVLK. Pesan langsung secara daring dengan perlindungan pembayaran terenkripsi.',
        ctaText: 'Lihat Koleksi Terbaru',
        align: 'left',
        surface: 'light',
        imageUrl: GENERATED_ASSETS.furnitureCase,
        imageAlt: 'Kursi santai kayu jati dan linen alami di ruang pamer KayuLoka Studio',
      },
      {
        id: 'blk-catalog-1',
        type: BlockType.ProductCatalog,
        title: 'Katalog Pilihan Pelanggan',
        subtitle: 'Setiap unit diproduksi sesuai pesanan dengan garansi struktur 5 tahun.',
        ctaText: 'Pilih Produk',
        align: 'left',
        surface: 'muted',
        products: [
          {
            id: 'prod-1',
            name: 'Kursi Santai Svara',
            description: 'Rangka jati solid finishing matte dengan bantalan linen tenun alami.',
            priceIdr: 4250000,
            imageUrl: GENERATED_ASSETS.furnitureCase,
          },
          {
            id: 'prod-2',
            name: 'Meja Konsol Nala',
            description: 'Profil ramping 140cm untuk ruang tamu atau lobi studio.',
            priceIdr: 3600000,
            imageUrl: GENERATED_ASSETS.interiorTemplate,
          },
        ],
      },
      {
        id: 'blk-pay-1',
        type: BlockType.PaymentCheckout,
        title: 'Pembayaran Uang Muka & Pelunasan Instan',
        subtitle: 'Pilih metode pembayaran yang paling nyaman. Konfirmasi otomatis dalam hitungan detik.',
        ctaText: 'Bayar Sekarang',
        align: 'left',
        surface: 'light',
        paymentTitle: 'Pemesanan Kursi Santai Svara (Batch #24)',
        paymentAmountIdr: 4250000,
        enabledPayments: [
          PaymentMethodId.Qris,
          PaymentMethodId.VirtualAccount,
          PaymentMethodId.EWallet,
          PaymentMethodId.CreditCard,
        ],
      },
      {
        id: 'blk-testi-1',
        type: BlockType.Testimonials,
        title: 'Dipercaya Arsitek & Pemilik Properti',
        subtitle: 'Ulasan terverifikasi dari proyek hunian dan ruang komersial.',
        ctaText: '',
        align: 'left',
        surface: 'muted',
        testimonials: [
          {
            id: 't-1',
            quote:
              'Proses pemesanan hingga pembayaran termin proyek jauh lebih rapi sejak menggunakan situs ini. Klien kami bisa langsung melunasi lewat QRIS atau VA.',
            authorName: 'Rama Pratama',
            role: 'Prinsipal Arsitek',
            company: 'Studio Ruang Teduh',
          },
          {
            id: 't-2',
            quote:
              'Detail produk tampil sangat jelas di ponsel dan waktu muat halaman cepat, membantu konversi kunjungan iklan meningkat signifikan.',
            authorName: 'Nadia Kusuma',
            role: 'Direktur Operasional',
            company: 'Villa Senja Ubud',
          },
        ],
      },
    ],
  },
  coffee: {
    label: 'Kedai & Roastery',
    theme: {
      siteName: 'Altura Roastery',
      subdomain: 'altura.rakitweb.id',
      accentColor: '#0F172A',
      radiusMode: 'sharp',
      typographyStyle: 'editorial',
    },
    blocks: [
      {
        id: 'blk-coffee-hero',
        type: BlockType.Hero,
        title: 'Biji Kopi Single Origin Dipanggang Segar Setiap Selasa',
        subtitle:
          'Seleksi panen mikro dari Gayo, Kintamani, dan Toraja. Langganan mingguan dengan pengiriman langsung ke pintu Anda.',
        ctaText: 'Pesan Paket Roastery',
        align: 'left',
        surface: 'light',
        imageUrl: GENERATED_ASSETS.coffeeCase,
        imageAlt: 'Kemasan kopi spesialti Altura Roastery dan alat seduh keramik di atas meja batu',
      },
      {
        id: 'blk-coffee-pay',
        type: BlockType.PaymentCheckout,
        title: 'Checkout Langganan Kopi Bulanan',
        subtitle: 'Pembayaran aman dengan enkripsi end-to-end dan invoice otomatis ke email.',
        ctaText: 'Selesaikan Pembayaran',
        align: 'left',
        surface: 'muted',
        paymentTitle: 'Paket 2x 250g Single Origin Filter Roast',
        paymentAmountIdr: 285000,
        enabledPayments: [PaymentMethodId.Qris, PaymentMethodId.EWallet, PaymentMethodId.VirtualAccount],
      },
      {
        id: 'blk-coffee-faq',
        type: BlockType.Faq,
        title: 'Pertanyaan Umum Pelanggan',
        subtitle: 'Informasi jadwal sangrai, penggilingan, dan pengiriman.',
        ctaText: '',
        align: 'left',
        surface: 'light',
        faqs: [
          {
            id: 'faq-1',
            question: 'Kapan pesanan biji kopi dikirim setelah pembayaran berhasil?',
            answer:
              'Pesanan yang terkonfirmasi sebelum pukul 14.00 WIB akan diproses pada hari sangrai terdekat dan dikirim melalui kurir instan atau reguler.',
          },
          {
            id: 'faq-2',
            question: 'Apakah saya bisa meminta gilingan khusus untuk V60 atau Espresso?',
            answer:
              'Bisa. Anda dapat memilih profil gilingan Whole Bean, Pour Over, atau Espresso di catatan pesanan sebelum membayar.',
          },
        ],
      },
    ],
  },
  agency: {
    label: 'Konsultan B2B',
    theme: {
      siteName: 'Nusantara Advisory',
      subdomain: 'nusantara.rakitweb.id',
      accentColor: '#1E40AF',
      radiusMode: 'medium',
      typographyStyle: 'modern',
    },
    blocks: [
      {
        id: 'blk-ag-hero',
        type: BlockType.Hero,
        title: 'Audit Keuangan & Strategi Ekspansi untuk Perusahaan Bertumbuh',
        subtitle:
          'Pendampingan terukur bagi tim manajemen dalam menyusun proyeksi kas, kepatuhan pajak, dan kesiapan pendanaan.',
        ctaText: 'Jadwalkan Konsultasi',
        align: 'left',
        surface: 'light',
        imageUrl: GENERATED_ASSETS.heroStudio,
        imageAlt: 'Ruang studio konsultasi modern dengan meja kayu dan layar analitik',
      },
      {
        id: 'blk-ag-contact',
        type: BlockType.ContactForm,
        title: 'Ajukan Penjadwalan Sesi Konsultasi',
        subtitle: 'Tim analis kami akan merespons dalam maksimal 1 hari kerja.',
        ctaText: 'Kirim Permintaan',
        align: 'left',
        surface: 'muted',
        contactEmail: 'halo@nusantara-advisory.id',
      },
    ],
  },
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: SubscriptionTierId.Starter,
    name: 'Pemula',
    audience: 'Untuk perintis usaha & portofolio profesional',
    monthlyPriceIdr: 149000,
    annualMonthlyPriceIdr: 119000,
    bandwidthLabel: '100 GB / bulan',
    storageLabel: '10 GB SSD NVMe',
    transactionFeeLabel: '1,2% per transaksi',
    teamSeats: '1 Akun Admin',
    highlights: [
      'Editor drag-and-drop penuh (hingga 15 halaman)',
      'Integrasi QRIS & Virtual Account bawaan',
      'Sertifikat SSL/TLS 1.3 & enkripsi end-to-end',
      'Audit SEO dasar & sitemap XML otomatis',
    ],
  },
  {
    id: SubscriptionTierId.Pro,
    name: 'Bisnis Pro',
    audience: 'Untuk toko daring & bisnis bertumbuh',
    monthlyPriceIdr: 349000,
    annualMonthlyPriceIdr: 279000,
    bandwidthLabel: '1 TB / bulan',
    storageLabel: '50 GB SSD NVMe',
    transactionFeeLabel: '0,5% per transaksi',
    teamSeats: '5 Anggota Tim',
    recommended: true,
    highlights: [
      'Halaman & blok kustom tanpa batas',
      'Semua metode bayar (QRIS, VA, E-Wallet, Kartu)',
      'Dasbor analitik real-time & ekspor laporan',
      'Optimasi SEO lanjutan (Schema JSON-LD & OpenGraph)',
      'Masukan & revisi website sampai puas langsung ke WA developer',
    ],
  },
  {
    id: SubscriptionTierId.Enterprise,
    name: 'Korporasi',
    audience: 'Untuk perusahaan multi-cabang & volume tinggi',
    monthlyPriceIdr: 899000,
    annualMonthlyPriceIdr: 719000,
    bandwidthLabel: 'Tanpa Batas (CDN Global)',
    storageLabel: '250 GB SSD Terdedikasi',
    transactionFeeLabel: '0% biaya platform',
    teamSeats: '20 Anggota Tim + RBAC',
    highlights: [
      'Multi-domain kustom & infrastruktur terdedikasi',
      'SLA Uptime 99,99% dengan WAF & mitigasi DDoS',
      'API Webhook pembayaran & sinkronisasi ERP',
      'Manajer akun khusus & revisi prioritas via WA developer',
    ],
  },
];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodId, {name: string; subtitle: string}> = {
  [PaymentMethodId.Qris]: {
    name: 'QRIS Instan',
    subtitle: 'Mendukung seluruh bank & e-wallet Indonesia',
  },
  [PaymentMethodId.VirtualAccount]: {
    name: 'Virtual Account',
    subtitle: 'BCA, Mandiri, BNI, BRI, Permata',
  },
  [PaymentMethodId.EWallet]: {
    name: 'E-Wallet',
    subtitle: 'GoPay, OVO, DANA, ShopeePay',
  },
  [PaymentMethodId.CreditCard]: {
    name: 'Kartu Kredit / Debit',
    subtitle: 'Visa, Mastercard, JCB (3D Secure)',
  },
};

export const ANALYTICS_SERIES_BY_RANGE: Record<
  'today' | '7d' | '30d',
  Array<{label: string; visitors: number; conversions: number; revenueIdr: number}>
> = {
  today: [
    {label: '08:00', visitors: 142, conversions: 6, revenueIdr: 2450000},
    {label: '10:00', visitors: 238, conversions: 11, revenueIdr: 4820000},
    {label: '12:00', visitors: 315, conversions: 16, revenueIdr: 6390000},
    {label: '14:00', visitors: 284, conversions: 14, revenueIdr: 5710000},
    {label: '16:00', visitors: 368, conversions: 21, revenueIdr: 8940000},
    {label: '18:00', visitors: 412, conversions: 24, revenueIdr: 10250000},
    {label: '20:00', visitors: 356, conversions: 19, revenueIdr: 7860000},
  ],
  '7d': [
    {label: 'Sen', visitors: 1420, conversions: 58, revenueIdr: 24800000},
    {label: 'Sel', visitors: 1680, conversions: 72, revenueIdr: 31200000},
    {label: 'Rab', visitors: 1590, conversions: 65, revenueIdr: 28900000},
    {label: 'Kam', visitors: 1940, conversions: 89, revenueIdr: 38400000},
    {label: 'Jum', visitors: 2150, conversions: 96, revenueIdr: 42150000},
    {label: 'Sab', visitors: 2480, conversions: 112, revenueIdr: 48600000},
    {label: 'Min', visitors: 2210, conversions: 98, revenueIdr: 43200000},
  ],
  '30d': [
    {label: 'Minggu 1', visitors: 8420, conversions: 342, revenueIdr: 142800000},
    {label: 'Minggu 2', visitors: 9650, conversions: 415, revenueIdr: 178400000},
    {label: 'Minggu 3', visitors: 11240, conversions: 498, revenueIdr: 214600000},
    {label: 'Minggu 4', visitors: 12890, conversions: 576, revenueIdr: 248900000},
  ],
};

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'TRX-89241',
    timestamp: 'Hari ini · 19:42 WIB',
    customerName: 'Budi Santoso',
    itemLabel: 'Kursi Santai Svara (1x)',
    method: PaymentMethodId.Qris,
    amountIdr: 4250000,
    status: 'Berhasil',
  },
  {
    id: 'TRX-89240',
    timestamp: 'Hari ini · 18:15 WIB',
    customerName: 'Dewi Anggraini',
    itemLabel: 'Meja Konsol Nala (1x)',
    method: PaymentMethodId.VirtualAccount,
    amountIdr: 3600000,
    status: 'Berhasil',
  },
  {
    id: 'TRX-89239',
    timestamp: 'Hari ini · 17:03 WIB',
    customerName: 'Hendrik Wijaya',
    itemLabel: 'Paket Uji Sampel Kayu',
    method: PaymentMethodId.EWallet,
    amountIdr: 250000,
    status: 'Berhasil',
  },
  {
    id: 'TRX-89238',
    timestamp: 'Hari ini · 15:48 WIB',
    customerName: 'Siti Rahma',
    itemLabel: 'Kursi Santai Svara (2x)',
    method: PaymentMethodId.CreditCard,
    amountIdr: 8500000,
    status: 'Menunggu',
  },
];

export const INITIAL_SECURITY_SETTINGS: SecuritySetting[] = [
  {
    id: 'sec-e2e',
    label: 'Enkripsi End-to-End Payload Pembayaran & Formulir',
    description: 'Data pelanggan dienkripsi di sisi peramban menggunakan AES-256-GCM sebelum dikirim ke server.',
    enabled: true,
    standard: 'AES-256-GCM',
  },
  {
    id: 'sec-tls',
    label: 'Paksa HTTPS & Sertifikat TLS 1.3 Otomatis',
    description: 'Seluruh lalu lintas domain kustom dan sub-domain diarahkan melalui koneksi terenkripsi HSTS.',
    enabled: true,
    standard: 'TLS 1.3 + HSTS',
  },
  {
    id: 'sec-waf',
    label: 'Web Application Firewall (WAF) & Mitigasi DDoS',
    description: 'Menyaring permintaan otomatis berbahaya, injeksi SQL, dan lonjakan trafik bot secara real-time.',
    enabled: true,
    standard: 'OWASP Core Rule Set',
  },
  {
    id: 'sec-2fa',
    label: 'Autentikasi Dua Faktor (2FA) untuk Tim Admin',
    description: 'Wajibkan verifikasi TOTP/Passkey saat mengubah konfigurasi rekening pembayaran atau ekspor data.',
    enabled: true,
    standard: 'WebAuthn / TOTP',
  },
];

export const INITIAL_AUDIT_LOGS: SecurityAuditEntry[] = [
  {
    id: 'AUD-104',
    timestamp: '2026-11-24 19:40:12',
    event: 'Rotasi kunci sesi enkripsi end-to-end berhasil',
    actor: 'Sistem Vault Otomatis',
    ipMasked: '103.145.**.18',
    status: 'Terverifikasi',
  },
  {
    id: 'AUD-103',
    timestamp: '2026-11-24 18:12:05',
    event: 'Pembaruan konfigurasi webhook QRIS terenkripsi',
    actor: 'admin@kayuloka.id',
    ipMasked: '182.253.**.92',
    status: 'Terverifikasi',
  },
  {
    id: 'AUD-102',
    timestamp: '2026-11-24 14:09:44',
    event: 'Percobaan pemindaian celah otomatis pada /wp-login',
    actor: 'Bot Eksternal',
    ipMasked: '45.134.**.201',
    status: 'Diblokir',
  },
  {
    id: 'AUD-101',
    timestamp: '2026-11-24 09:20:01',
    event: 'Perpanjangan sertifikat SSL/TLS 1.3 domain kustom',
    actor: 'RakitWeb Edge CA',
    ipMasked: '103.145.**.04',
    status: 'Terverifikasi',
  },
];

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}
