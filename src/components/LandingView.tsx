import {useState} from 'react';
import {ArrowRight, Check, Headphones, Lock, BarChart3, Search, Layers, CreditCard} from 'lucide-react';
import {GENERATED_ASSETS, SUBSCRIPTION_PLANS, formatRupiah} from '../data/initialState';
import {AppSection, SubscriptionTierId, TrialState} from '../types/builder';
import {SafeImage} from './SafeImage';

interface LandingViewProps {
  onNavigate: (section: AppSection) => void;
  onStartTrial: () => void;
  onSelectPlan: (planId: SubscriptionTierId, billing: 'monthly' | 'annual') => void;
  onOpenSupport: () => void;
  trialState: TrialState;
}

export function LandingView({
  onNavigate,
  onStartTrial,
  onSelectPlan,
  onOpenSupport,
  trialState,
}: LandingViewProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="bg-white text-slate-900">
      {/* Hero Section */}
      <section className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
              <div className="space-y-5">
                <p className="text-xs font-medium text-slate-600">
                  Platform Website Bisnis Indonesia · Uji Coba Penuh 48 Jam · Enkripsi AES-256
                </p>
                <h1
                  className="font-display font-bold tracking-tight text-slate-900 text-balance leading-[1.08]"
                  style={{fontSize: 'clamp(2.25rem, 4vw, 3.65rem)'}}
                >
                  Bangun Website Profesional dan Terima Pembayaran dalam Satu Studio
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  Susun tata letak sesuai identitas bisnis Anda melalui editor drag-and-drop,
                  aktifkan QRIS serta Virtual Account secara instan, pantau analitik real-time,
                  dan optimalkan visibilitas Google dengan SEO bawaan.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    if (trialState.status === 'active' || trialState.status === 'subscribed') {
                      onNavigate(AppSection.Builder);
                    } else {
                      onStartTrial();
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors min-h-[44px] whitespace-nowrap"
                >
                  <span>
                    {trialState.status === 'active' || trialState.status === 'subscribed'
                      ? 'Lanjutkan di Studio Builder'
                      : trialState.status === 'pending_developer'
                        ? 'Menunggu Konfirmasi Developer'
                        : 'Mulai Uji Coba Gratis 2 Hari'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(AppSection.Builder)}
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors min-h-[44px] whitespace-nowrap"
                >
                  Coba Editor Drag-and-Drop
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[300px] lg:min-h-[420px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <SafeImage
                  src={GENERATED_ASSETS.heroStudio}
                  alt="Ruang kerja studio desain web modern dengan layar editorial RakitWeb"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* 4-Column Proof Strip */}
          <div className="mt-14 pt-10 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                48 Jam
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Uji coba gratis akses penuh tanpa kartu kredit
              </p>
            </div>
            <div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                4 Metode
              </div>
              <p className="text-sm text-slate-600 mt-1">
                QRIS, Virtual Account, E-Wallet, dan Kartu Kredit
              </p>
            </div>
            <div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                AES-256
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Enkripsi end-to-end data pelanggan &amp; SSL TLS 1.3
              </p>
            </div>
            <div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                Sampai Puas
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Masukan &amp; revisi apa saja langsung ke WA developer kami
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 01: Asymmetric Bento Capabilities */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-blue-700 mb-2">
              01. Arsitektur Platform
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
              Kendali Penuh dari Desain Hingga Transaksi Masuk
            </h2>
            <p className="text-slate-600 mt-3 leading-relaxed">
              Setiap situs yang Anda susun langsung terhubung dengan sistem pembayaran, analitik
              kunjungan langsung, dan struktur SEO teknis tanpa perlu memasang plugin tambahan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Marquee Capability 1 */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-8 flex flex-col justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-slate-500">
                    Editor Visual · Kustomisasi Tanpa Batas
                  </span>
                  <Layers className="w-5 h-5 text-blue-700" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900">
                  Studio Drag-and-Drop yang Mengikuti Identitas Bisnis Anda
                </h3>
                <p className="text-slate-600 leading-relaxed max-w-2xl">
                  Tarik dan atur urutan bagian Hero, Katalog Produk, Formulir Checkout, Testimoni,
                  hingga FAQ secara langsung. Ubah palet warna merek, ukuran sudut kartu, serta
                  pratinjau responsif untuk desktop, tablet, dan ponsel dalam satu klik.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  3 templat siap pakai · Penyimpanan otomatis lokal
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate(AppSection.Builder)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap"
                >
                  Buka Studio Builder <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Capability 2 */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-slate-500">
                    Kasir Daring · Konfirmasi Otomatis
                  </span>
                  <CreditCard className="w-5 h-5 text-blue-700" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Integrasi Pembayaran Instan
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pasang blok pembayaran QRIS dinamis, Virtual Account BCA/Mandiri/BNI, GoPay,
                  OVO, DANA, dan kartu kredit langsung di halaman mana pun.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(AppSection.Pricing)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap"
              >
                Lihat Simulasi Pembayaran <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Capability 3 */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-slate-500">
                    Telemetri Langsung · Visibilitas Pencarian
                  </span>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-700" strokeWidth={1.75} />
                    <Search className="w-5 h-5 text-blue-700" strokeWidth={1.75} />
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Analitik Real-Time &amp; Optimasi SEO Bawaan
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pantau pengunjung aktif dan konversi detik demi detik. Sunting Meta Title,
                  OpenGraph, Slug, dan Schema JSON-LD dengan pratinjau hasil pencarian Google.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(AppSection.AnalyticsSeo)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap"
              >
                Buka Dasbor Analitik &amp; SEO <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Capability 4 */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-8 flex flex-col justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-slate-500">
                    Keamanan Berlapis · Pendampingan Aktif
                  </span>
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-700" strokeWidth={1.75} />
                    <Headphones className="w-5 h-5 text-blue-700" strokeWidth={1.75} />
                  </div>
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900">
                  Enkripsi End-to-End dan Masukan Revisi ke WhatsApp Developer
                </h3>
                <p className="text-slate-600 leading-relaxed max-w-2xl">
                  Seluruh data formulir dan transaksi pelanggan dilindungi enkripsi AES-256-GCM
                  sebelum meninggalkan peramban, lengkap dengan sertifikat TLS 1.3 dan WAF. Jika
                  ada bagian website yang dirasa kurang, sampaikan masukan Anda hingga puas dan
                  kirim otomatis ke WhatsApp developer kami.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onNavigate(AppSection.Security)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap"
                >
                  Periksa Pusat Keamanan E2E <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onOpenSupport}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 whitespace-nowrap"
                >
                  Kirim Masukan ke WA Developer
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 02: Proof & Case Studies */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-blue-700 mb-2">
              02. Dampak Terukur pada Bisnis Pelanggan
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
              Hasil Nyata Setelah Beralih ke Halaman Kustom &amp; Checkout Instan
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <article className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col">
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden border-b border-slate-200">
                <SafeImage
                  src={GENERATED_ASSETS.coffeeCase}
                  alt="Produk kopi spesialti Altura Roastery di meja batu"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    Altura Coffee Roasters · Industri Kuliner &amp; Ritel · Bandung
                  </p>
                  <h3 className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                    +164% Transaksi Langsung via QRIS dalam 90 Hari
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Sebelumnya pelanggan harus mengirim bukti transfer manual melalui chat. Setelah
                    memasang blok pembayaran QRIS dan formulir langganan mingguan di RakitWeb,
                    waktu penyelesaian pesanan turun dari 18 menit menjadi 35 detik.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">Dimas Prakoso</span> — Pendiri,
                  Altura Coffee Roasters
                </div>
              </div>
            </article>

            <article className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col">
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden border-b border-slate-200">
                <SafeImage
                  src={GENERATED_ASSETS.furnitureCase}
                  alt="Kursi santai kayu jati KayuLoka Studio di ruang pamer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    KayuLoka Studio · Furnitur Arsitektural · Jepara &amp; Jakarta
                  </p>
                  <h3 className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                    +210% Kunjungan Organik Google dalam 6 Minggu
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Dengan memanfaatkan editor Schema Produk dan audit SEO bawaan untuk kata kunci
                    furnitur jati kustom, katalog proyek masuk ke halaman pertama pencarian dan
                    menghasilkan 42 permintaan penawaran arsitek per bulan.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">Lestari Handayani</span> — Direktur
                  Komersial, KayuLoka Studio
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Section 03: Flexible Subscription Pricing */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-blue-700 mb-2">
                03. Paket Langganan Fleksibel
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
                Mulai Gratis 2 Hari, Lanjutkan Sesuai Skala Bisnis Anda
              </h2>
              <p className="text-slate-600 mt-3">
                Uji seluruh fitur editor, integrasi pembayaran, dan SEO selama 48 jam penuh sebelum
                memilih paket bulanan atau tahunan.
              </p>
            </div>

            <div
              role="group"
              aria-label="Pilih periode tagihan"
              className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-lg shrink-0 self-start"
            >
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  billingCycle === 'monthly'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  billingCycle === 'annual'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tahunan (Hemat 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const price =
                billingCycle === 'annual' ? plan.annualMonthlyPriceIdr : plan.monthlyPriceIdr;
              return (
                <div
                  key={plan.id}
                  className={`rounded-xl p-8 bg-white flex flex-col justify-between gap-8 ${
                    plan.recommended
                      ? 'border-2 border-blue-700'
                      : 'border border-slate-200'
                  }`}
                >
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-xl font-bold text-slate-900">
                          {plan.name}
                        </h3>
                        {plan.recommended && (
                          <span className="text-xs font-semibold text-blue-700">
                            Paling Populer
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{plan.audience}</p>
                    </div>

                    <div className="pb-5 border-b border-slate-200">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-3xl font-bold text-slate-900 tabular-nums">
                          {formatRupiah(price)}
                        </span>
                        <span className="text-xs text-slate-500">/ bulan</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {billingCycle === 'annual'
                          ? 'Ditagih per tahun · Gratis 2 hari di awal'
                          : 'Fleksibel batalkan kapan saja · Gratis 2 hari'}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-700 pb-4 border-b border-slate-100">
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-500">Bandwidth</span>
                        <span className="font-semibold tabular-nums">{plan.bandwidthLabel}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-500">Penyimpanan</span>
                        <span className="font-semibold tabular-nums">{plan.storageLabel}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-500">Biaya Transaksi</span>
                        <span className="font-semibold tabular-nums">{plan.transactionFeeLabel}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-500">Akses Tim</span>
                        <span className="font-semibold tabular-nums">{plan.teamSeats}</span>
                      </div>
                    </div>

                    <ul className="space-y-2.5 text-sm text-slate-700">
                      {plan.highlights.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectPlan(plan.id, billingCycle)}
                    className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
                      plan.recommended
                        ? 'bg-blue-700 text-white hover:bg-blue-800'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    Pilih Paket {plan.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-1">
            <div className="font-display text-lg font-bold text-slate-900">RakitWeb</div>
            <p className="text-xs text-slate-500">
              Platform Pembuatan Website Profesional · Enkripsi End-to-End AES-256 · Revisi Sampai Puas via WA Developer
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <button
              type="button"
              onClick={() => onNavigate(AppSection.Builder)}
              className="hover:text-slate-900"
            >
              Studio Builder
            </button>
            <button
              type="button"
              onClick={() => onNavigate(AppSection.AnalyticsSeo)}
              className="hover:text-slate-900"
            >
              Analitik &amp; SEO
            </button>
            <button
              type="button"
              onClick={() => onNavigate(AppSection.Pricing)}
              className="hover:text-slate-900"
            >
              Paket Langganan
            </button>
            <button
              type="button"
              onClick={() => onNavigate(AppSection.Security)}
              className="hover:text-slate-900"
            >
              Keamanan Data
            </button>
            <button
              type="button"
              onClick={onOpenSupport}
              className="font-semibold text-blue-700 hover:text-blue-800"
            >
              Masukan &amp; Revisi (WA Developer)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
