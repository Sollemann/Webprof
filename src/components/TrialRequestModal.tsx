import {useState} from 'react';
import {CheckCircle2, Clock, MessageCircle, ShieldCheck, X} from 'lucide-react';
import {TrialRequestData, TrialState} from '../types/builder';

interface TrialRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  trialState: TrialState;
  developerWaNumber: string;
  onSubmitRequest: (data: TrialRequestData) => void;
  onConfirmByDeveloper: () => void;
}

const WEBSITE_CATEGORIES = [
  'Toko Daring & Ritel (Checkout QRIS / VA / E-Wallet)',
  'Kuliner, Kafe & Restoran (Menu & Pemesanan Langsung)',
  'Jasa Profesional, Konsultan & B2B (Profil & Lead Form)',
  'Profil Perusahaan, Pabrik & UMKM (Kredibilitas & SEO)',
  'Klinik, Kesehatan & Kecantikan (Layanan & Reservasi)',
  'Pendidikan, Kursus & Penjualan Tiket Acara',
  'Properti, Arsitektur & Otomotif (Katalog & Janji Temu)',
  'Agensi Kreatif, Studio & Portofolio Karya',
  'Organisasi, Komunitas & Layanan Publik',
];

const ESSENTIAL_FEATURE_OPTIONS = [
  'Katalog Produk / Paket Harga',
  'Pembayaran Otomatis (QRIS / VA / E-Wallet)',
  'Formulir Pemesanan & Jadwal Konsultasi',
  'Optimasi SEO Google & Analitik Pengunjung',
  'Testimoni Pelanggan & Daftar FAQ',
  'Tombol Arahkan ke WhatsApp Bisnis',
];

function formatWaDigits(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  return digits || '6281234567890';
}

export function TrialRequestModal({
  isOpen,
  onClose,
  trialState,
  developerWaNumber,
  onSubmitRequest,
  onConfirmByDeveloper,
}: TrialRequestModalProps) {
  const [fullName, setFullName] = useState(trialState.requestData?.fullName ?? '');
  const [businessName, setBusinessName] = useState(trialState.requestData?.businessName ?? '');
  const [whatsappNumber, setWhatsappNumber] = useState(
    trialState.requestData?.whatsappNumber ?? ''
  );
  const [websiteCategory, setWebsiteCategory] = useState(
    trialState.requestData?.websiteCategory ?? WEBSITE_CATEGORIES[0]
  );
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    trialState.requestData?.selectedFeatures ?? [
      'Katalog Produk / Paket Harga',
      'Pembayaran Otomatis (QRIS / VA / E-Wallet)',
      'Optimasi SEO Google & Analitik Pengunjung',
    ]
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [waSentClicked, setWaSentClicked] = useState(false);

  if (!isOpen) return null;

  const req = trialState.requestData;
  const isPending = trialState.status === 'pending_developer' && req !== null;
  const cleanDevWa = formatWaDigits(developerWaNumber);

  const toggleFeature = (feat: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((item) => item !== feat) : [...prev, feat]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !businessName.trim() || whatsappNumber.replace(/\D/g, '').length < 9) {
      setErrorMsg('Lengkapi nama Anda, nama bisnis, dan nomor WhatsApp aktif yang valid.');
      return;
    }
    if (selectedFeatures.length === 0) {
      setErrorMsg('Pilih minimal satu fitur kebutuhan utama website uji coba Anda.');
      return;
    }
    setErrorMsg(null);
    onSubmitRequest({
      fullName: fullName.trim(),
      businessName: businessName.trim(),
      whatsappNumber: whatsappNumber.trim(),
      websiteCategory,
      selectedFeatures,
      submittedAt: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  };

  const waConfirmMessage = req
    ? [
        'Halo Developer RakitWeb,',
        'Saya mengajukan pembuatan web uji coba gratis 2 hari untuk dikonfirmasi:',
        `- Nama: ${req.fullName}`,
        `- Nama Bisnis/Web: ${req.businessName}`,
        `- No. WA Pemohon: ${req.whatsappNumber}`,
        `- Jenis Website: ${req.websiteCategory}`,
        `- Kebutuhan Fitur: ${req.selectedFeatures.join(', ')}`,
        '',
        'Mohon konfirmasi agar web uji coba 48 jam saya dapat langsung diaktifkan. Terima kasih.',
      ].join('\n')
    : '';

  const waConfirmUrl = `https://wa.me/${cleanDevWa}?text=${encodeURIComponent(waConfirmMessage)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trial-modal-title"
    >
      <div className="w-full max-w-xl max-h-[90vh] bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div>
            <h2 id="trial-modal-title" className="font-display text-lg font-bold text-slate-900">
              {isPending
                ? 'Menunggu Konfirmasi Developer'
                : 'Formulir Pembuatan Web Uji Coba (2 Hari)'}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {isPending
                ? 'Kirim data ringkas ke WhatsApp developer untuk mengaktifkan akses 48 jam.'
                : 'Isi data penting dan pilih kebutuhan utama website untuk dikonfirmasi developer.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir uji coba"
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          {trialState.status !== 'pending_developer' || !req ? (
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nama Lengkap Anda
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nomor WhatsApp Aktif
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Bisnis / Judul Website
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Contoh: Kopi Senja Nusantara"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Jenis &amp; Tujuan Website
                </label>
                <select
                  value={websiteCategory}
                  onChange={(e) => setWebsiteCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-blue-700"
                >
                  {WEBSITE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-700 mb-2">
                  Fitur Utama yang Dibutuhkan ({selectedFeatures.length} dipilih)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ESSENTIAL_FEATURE_OPTIONS.map((feat) => {
                    const checked = selectedFeatures.includes(feat);
                    return (
                      <label
                        key={feat}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          checked
                            ? 'border-blue-700 bg-blue-50/60 text-slate-900 font-medium'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFeature(feat)}
                          className="mt-0.5 rounded border-slate-300 text-blue-700"
                        />
                        <span>{feat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {errorMsg && <p className="text-xs font-medium text-red-700">{errorMsg}</p>}

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors min-h-[44px]"
                >
                  Ajukan Konfirmasi Developer
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors min-h-[44px]"
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 space-y-5">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 font-semibold text-amber-800">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Status: Menunggu Konfirmasi Developer ({req.submittedAt} WIB)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-slate-700">
                  <div>
                    <span className="text-slate-500">Pemohon: </span>
                    <span className="font-semibold text-slate-900">{req.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">No. WA: </span>
                    <span className="font-mono font-semibold text-slate-900">
                      {req.whatsappNumber}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">Nama Web: </span>
                    <span className="font-semibold text-slate-900">{req.businessName}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">Jenis Web: </span>
                    <span className="font-semibold text-slate-900">{req.websiteCategory}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">Fitur Utama: </span>
                    <span className="font-semibold text-slate-900">
                      {req.selectedFeatures.join(' · ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={waConfirmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setWaSentClicked(true)}
                  className="w-full py-3 px-4 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors min-h-[44px] flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>1. Kirim Permintaan ke WhatsApp Developer</span>
                </a>

                {waSentClicked && (
                  <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      Pesan konfirmasi telah dibuka untuk WhatsApp Developer (+{cleanDevWa}).
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onConfirmByDeveloper();
                    onClose();
                  }}
                  className="w-full py-3 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors min-h-[44px] flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>2. Developer Sudah Konfirmasi — Aktifkan Uji Coba 2 Hari</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
