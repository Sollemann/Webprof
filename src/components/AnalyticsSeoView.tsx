import {useEffect, useState} from 'react';
import {CheckCircle2, AlertCircle, Pause, Play, Search} from 'lucide-react';
import {
  ANALYTICS_SERIES_BY_RANGE,
  PAYMENT_METHOD_LABELS,
  formatRupiah,
} from '../data/initialState';
import {BlockType, SeoConfig, SiteBlock, SiteThemeConfig, TransactionRecord} from '../types/builder';

interface AnalyticsSeoViewProps {
  blocks: SiteBlock[];
  theme: SiteThemeConfig;
  seoConfig: SeoConfig;
  setSeoConfig: React.Dispatch<React.SetStateAction<SeoConfig>>;
  transactions: TransactionRecord[];
}

export function AnalyticsSeoView({
  blocks,
  theme,
  seoConfig,
  setSeoConfig,
  transactions,
}: AnalyticsSeoViewProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'seo'>('analytics');
  const [range, setRange] = useState<'today' | '7d' | '30d'>('7d');
  const [liveStreamActive, setLiveStreamActive] = useState(true);
  const [liveVisitors, setLiveVisitors] = useState(38);
  const [txQuery, setTxQuery] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState<'Semua' | 'Berhasil' | 'Menunggu'>('Semua');
  const [seoSavedNotice, setSeoSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!liveStreamActive) return;
    const interval = setInterval(() => {
      setLiveVisitors((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(12, Math.min(94, prev + delta));
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [liveStreamActive]);

  const series = ANALYTICS_SERIES_BY_RANGE[range];
  const totalVisitors = series.reduce((acc, p) => acc + p.visitors, 0);
  const totalConversions = series.reduce((acc, p) => acc + p.conversions, 0);
  const baseRevenue = series.reduce((acc, p) => acc + p.revenueIdr, 0);
  const extraTxRevenue = transactions
    .filter((t) => t.status === 'Berhasil')
    .reduce((acc, t) => acc + t.amountIdr, 0);
  const totalRevenue = baseRevenue + extraTxRevenue;
  const conversionRate = ((totalConversions / Math.max(1, totalVisitors)) * 100).toFixed(2);
  const maxVisitors = Math.max(...series.map((s) => s.visitors), 1);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesStatus = txStatusFilter === 'Semua' || tx.status === txStatusFilter;
    const q = txQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      tx.customerName.toLowerCase().includes(q) ||
      tx.id.toLowerCase().includes(q) ||
      tx.itemLabel.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  // Factual SEO checks computed directly from the user's live builder blocks & SEO config
  const heroBlock = blocks.find((b) => b.type === BlockType.Hero);
  const hasH1 = Boolean(heroBlock && heroBlock.title.trim().length >= 10);
  const metaTitleOk =
    seoConfig.metaTitle.trim().length >= 35 && seoConfig.metaTitle.trim().length <= 65;
  const metaDescOk =
    seoConfig.metaDescription.trim().length >= 100 &&
    seoConfig.metaDescription.trim().length <= 165;
  const slugOk = seoConfig.slug.startsWith('/') && !seoConfig.slug.includes(' ');
  const altImagesOk = blocks
    .filter((b) => b.imageUrl)
    .every((b) => Boolean(b.imageAlt && b.imageAlt.trim().length > 5));

  const seoChecks = [
    {
      label: 'Judul Utama Halaman (H1) di Studio Builder',
      passed: hasH1,
      detail: hasH1
        ? `Terdeteksi: "${heroBlock?.title.slice(0, 48)}..."`
        : 'Tambahkan blok Hero dengan judul minimal 10 karakter.',
    },
    {
      label: 'Panjang Meta Title Optimal (35–65 karakter)',
      passed: metaTitleOk,
      detail: `${seoConfig.metaTitle.trim().length} karakter saat ini.`,
    },
    {
      label: 'Panjang Meta Description Optimal (100–165 karakter)',
      passed: metaDescOk,
      detail: `${seoConfig.metaDescription.trim().length} karakter saat ini.`,
    },
    {
      label: 'Format URL Slug Bersih (tanpa spasi)',
      passed: slugOk,
      detail: `URL aktif: ${seoConfig.canonicalDomain}${seoConfig.slug}`,
    },
    {
      label: 'Atribut Alt Gambar Terisi untuk Indeksasi Gambar',
      passed: altImagesOk,
      detail: altImagesOk
        ? 'Semua gambar pada kanvas memiliki deskripsi alt.'
        : 'Lengkapi teks alt gambar di Inspektur Blok Hero.',
    },
    {
      label: 'Sitemap XML Otomatis & Protokol HTTPS',
      passed: seoConfig.sitemapAuto,
      detail: seoConfig.sitemapAuto
        ? 'Sitemap otomatis diperbarui setiap kali halaman dipublikasikan.'
        : 'Aktifkan sitemap otomatis agar mesin pencari mengindeks lebih cepat.',
    },
  ];
  const passedCount = seoChecks.filter((c) => c.passed).length;

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {theme.siteName} · {theme.subdomain}
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Analitik Real-Time &amp; Optimasi SEO Bawaan
            </h1>
          </div>

          <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-lg self-start">
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Analitik Real-Time
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'seo'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Optimasi SEO ({passedCount}/{seoChecks.length})
            </button>
          </div>
        </div>

        {activeTab === 'analytics' ? (
          <div className="space-y-6">
            {/* Top KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-500">Pengunjung Aktif Saat Ini</span>
                  <button
                    type="button"
                    onClick={() => setLiveStreamActive((prev) => !prev)}
                    aria-label={liveStreamActive ? 'Jeda pembaruan real-time' : 'Lanjutkan pembaruan real-time'}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:underline"
                  >
                    {liveStreamActive ? (
                      <>
                        <Pause className="w-3 h-3" /> Langsung
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" /> Dijeda
                      </>
                    )}
                  </button>
                </div>
                <div className="font-display text-3xl font-bold text-slate-900 tabular-nums">
                  {liveVisitors}
                </div>
                <p className="text-xs text-slate-500">Sesi aktif di halaman toko &amp; checkout</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
                <span className="text-xs font-medium text-slate-500">Total Kunjungan</span>
                <div className="font-display text-3xl font-bold text-slate-900 tabular-nums">
                  {totalVisitors.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-slate-500">Periode pilihan aktif</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
                <span className="text-xs font-medium text-slate-500">Tingkat Konversi Bayar</span>
                <div className="font-display text-3xl font-bold text-slate-900 tabular-nums">
                  {conversionRate}%
                </div>
                <p className="text-xs text-slate-500 tabular-nums">
                  {totalConversions} transaksi terselesaikan
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
                <span className="text-xs font-medium text-slate-500">Total Pembayaran Masuk</span>
                <div className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                  {formatRupiah(totalRevenue)}
                </div>
                <p className="text-xs text-slate-500">Termasuk transaksi simulasi dari Studio</p>
              </div>
            </div>

            {/* Chart & Traffic Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Grafik Kunjungan &amp; Konversi
                    </h2>
                    <p className="text-xs text-slate-500">
                      Distribusi pengunjung dan transaksi berhasil
                    </p>
                  </div>
                  <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg">
                    {(
                      [
                        {id: 'today', label: 'Hari Ini'},
                        {id: '7d', label: '7 Hari'},
                        {id: '30d', label: '30 Hari'},
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRange(opt.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                          range === opt.id
                            ? 'bg-white text-slate-900'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-3 items-end h-56 pt-4 border-b border-slate-200 pb-2">
                  {series.map((point) => {
                    const heightPct = Math.max(12, Math.round((point.visitors / maxVisitors) * 100));
                    return (
                      <div key={point.label} className="flex flex-col items-center justify-end h-full gap-2">
                        <span className="text-[11px] font-mono text-slate-600 tabular-nums">
                          {point.visitors.toLocaleString('id-ID')}
                        </span>
                        <div className="w-full max-w-[44px] bg-slate-100 rounded-t-md flex items-end h-36 overflow-hidden">
                          <div
                            className="w-full bg-blue-700 rounded-t-md transition-all"
                            style={{height: `${heightPct}%`}}
                            title={`${point.label}: ${point.visitors} pengunjung, ${point.conversions} konversi`}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-700">{point.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Sumber Kunjungan Utama
                </h2>
                <div className="divide-y divide-slate-100 text-sm">
                  {[
                    {source: 'Penelusuran Organik Google', share: '46%', visits: '6.190'},
                    {source: 'Tautan Langsung & Bookmark', share: '24%', visits: '3.230'},
                    {source: 'Media Sosial Instagram', share: '19%', visits: '2.560'},
                    {source: 'Rujukan Katalog & Mitra', share: '11%', visits: '1.490'},
                  ].map((row) => (
                    <div key={row.source} className="py-3 flex items-center justify-between gap-3">
                      <span className="text-slate-700 text-xs sm:text-sm">{row.source}</span>
                      <div className="text-right tabular-nums shrink-0">
                        <span className="font-semibold text-slate-900">{row.share}</span>
                        <span className="text-xs text-slate-500 ml-2">({row.visits})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Transaction Ledger */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    Riwayat Transaksi Pembayaran
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pembayaran dari Pratinjau Studio Builder langsung tercatat di sini
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={txQuery}
                      onChange={(e) => setTxQuery(e.target.value)}
                      placeholder="Cari pembeli atau ID..."
                      aria-label="Cari transaksi"
                      className="pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg">
                    {(['Semua', 'Berhasil', 'Menunggu'] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setTxStatusFilter(status)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                          txStatusFilter === status
                            ? 'bg-white text-slate-900'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-6">ID Transaksi</th>
                      <th className="py-3 px-6">Waktu</th>
                      <th className="py-3 px-6">Pelanggan</th>
                      <th className="py-3 px-6">Item</th>
                      <th className="py-3 px-6">Metode</th>
                      <th className="py-3 px-6 text-right">Nominal</th>
                      <th className="py-3 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-xs text-slate-500">
                          Tidak ada transaksi yang cocok dengan filter pencarian.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-6 font-mono text-xs text-slate-600">{tx.id}</td>
                          <td className="py-3.5 px-6 text-xs text-slate-500 tabular-nums">
                            {tx.timestamp}
                          </td>
                          <td className="py-3.5 px-6 font-medium text-slate-900">
                            {tx.customerName}
                          </td>
                          <td className="py-3.5 px-6 text-slate-600">{tx.itemLabel}</td>
                          <td className="py-3.5 px-6 text-xs text-slate-700">
                            {PAYMENT_METHOD_LABELS[tx.method].name}
                          </td>
                          <td className="py-3.5 px-6 text-right font-semibold tabular-nums text-slate-900">
                            {formatRupiah(tx.amountIdr)}
                          </td>
                          <td className="py-3.5 px-6 text-xs font-semibold">
                            <span
                              className={
                                tx.status === 'Berhasil' ? 'text-emerald-700' : 'text-amber-700'
                              }
                            >
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Built-in SEO Studio Tab */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900">
                  Pengaturan Meta &amp; Visibilitas Pencarian
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Perubahan di sini otomatis disinkronkan dengan struktur HTML situs Anda saat
                  dipublikasikan.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="font-semibold text-slate-700">Meta Title</label>
                  <span className="font-mono text-slate-500 tabular-nums">
                    {seoConfig.metaTitle.length} / 65 karakter
                  </span>
                </div>
                <input
                  type="text"
                  value={seoConfig.metaTitle}
                  onChange={(e) =>
                    setSeoConfig((prev) => ({...prev, metaTitle: e.target.value}))
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="font-semibold text-slate-700">Meta Description</label>
                  <span className="font-mono text-slate-500 tabular-nums">
                    {seoConfig.metaDescription.length} / 165 karakter
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={seoConfig.metaDescription}
                  onChange={(e) =>
                    setSeoConfig((prev) => ({...prev, metaDescription: e.target.value}))
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Slug Halaman
                  </label>
                  <input
                    type="text"
                    value={seoConfig.slug}
                    onChange={(e) =>
                      setSeoConfig((prev) => ({...prev, slug: e.target.value}))
                    }
                    className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Skema Data Terstruktur (JSON-LD)
                  </label>
                  <select
                    value={seoConfig.schemaType}
                    onChange={(e) =>
                      setSeoConfig((prev) => ({
                        ...prev,
                        schemaType: e.target.value as SeoConfig['schemaType'],
                      }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Product">Product (Katalog &amp; Harga)</option>
                    <option value="LocalBusiness">LocalBusiness (Toko / Studio)</option>
                    <option value="Organization">Organization (Perusahaan)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seoConfig.robotsIndex}
                    onChange={(e) =>
                      setSeoConfig((prev) => ({...prev, robotsIndex: e.target.checked}))
                    }
                    className="rounded border-slate-300 text-blue-700"
                  />
                  Izinkan indeksasi mesin pencari (index, follow)
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seoConfig.sitemapAuto}
                    onChange={(e) =>
                      setSeoConfig((prev) => ({...prev, sitemapAuto: e.target.checked}))
                    }
                    className="rounded border-slate-300 text-blue-700"
                  />
                  Perbarui Sitemap XML otomatis
                </label>
              </div>

              <div className="pt-3 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setSeoSavedNotice('Konfigurasi SEO & Schema JSON-LD siap diterapkan saat publikasi.')
                  }
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                >
                  Simpan Pengaturan SEO
                </button>
                {seoSavedNotice && (
                  <span className="text-xs font-medium text-emerald-700">{seoSavedNotice}</span>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              {/* Google SERP Preview */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                <div className="text-xs font-semibold text-slate-500">
                  Pratinjau Hasil Pencarian Google
                </div>
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-1">
                  <div className="text-xs text-slate-700 font-mono truncate">
                    {seoConfig.canonicalDomain}
                    {seoConfig.slug}
                  </div>
                  <div className="text-lg font-medium text-blue-800 leading-snug">
                    {seoConfig.metaTitle || 'Judul Halaman Anda'}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {seoConfig.metaDescription || 'Deskripsi singkat halaman akan muncul di sini.'}
                  </p>
                </div>
              </div>

              {/* Factual SEO Readiness Checklist */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Daftar Pemeriksaan Teknis SEO
                  </h3>
                  <span className="text-xs font-mono font-semibold text-slate-900 tabular-nums">
                    {passedCount}/{seoChecks.length} Lolos
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {seoChecks.map((check) => (
                    <div key={check.label} className="py-3 flex items-start gap-3">
                      {check.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{check.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{check.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
