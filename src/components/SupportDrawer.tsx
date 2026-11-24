import {useState} from 'react';
import {Check, CheckCircle2, Copy, MessageCircle, Plus, Send, Trash2, X} from 'lucide-react';
import {FeedbackRevisionItem, SiteThemeConfig, SupportMessage} from '../types/builder';

interface SupportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: SiteThemeConfig;
  developerWaNumber: string;
  onChangeDeveloperWaNumber: (num: string) => void;
  messages: SupportMessage[];
  onSendMessage: (area: string, text: string) => void;
  revisions: FeedbackRevisionItem[];
  onToggleRevisionStatus: (id: string) => void;
  onDeleteRevision: (id: string) => void;
}

const FEEDBACK_AREAS = [
  'Tampilan & Tata Letak',
  'Pembayaran & Checkout',
  'Teks & Foto Produk',
  'Optimasi SEO & Google',
  'Keamanan & Domain',
  'Fitur Tambahan Lainnya',
];

const QUICK_SUGGESTIONS = [
  'Warna tombol dan tata letak hero masih kurang pas',
  'Perlu tambah pilihan produk dan deskripsi harga',
  'Ingin penyesuaian metode bayar QRIS / Virtual Account',
  'Judul SEO dan kata kunci pencarian masih perlu dipoles',
];

function sanitizeWaDigits(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`;
  }
  return digits || '6281234567890';
}

export function SupportDrawer({
  isOpen,
  onClose,
  theme,
  developerWaNumber,
  onChangeDeveloperWaNumber,
  messages,
  onSendMessage,
  revisions,
  onToggleRevisionStatus,
  onDeleteRevision,
}: SupportDrawerProps) {
  const [activeTab, setActiveTab] = useState<'feedback' | 'wa_summary'>('feedback');
  const [selectedArea, setSelectedArea] = useState<string>(FEEDBACK_AREAS[0]);
  const [inputNote, setInputNote] = useState('');
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [dispatchedNotice, setDispatchedNotice] = useState(false);

  if (!isOpen) return null;

  const cleanWa = sanitizeWaDigits(developerWaNumber);
  const pendingRevisions = revisions.filter((r) => r.status === 'Menunggu Developer');
  const summaryLines = (pendingRevisions.length > 0 ? pendingRevisions : revisions)
    .map((item, idx) => `${idx + 1}. [${item.area}] ${item.note}`)
    .join('\n');

  const waMessageText = [
    `Halo Developer RakitWeb,`,
    `Berikut masukan revisi untuk website *${theme.siteName}* (${theme.subdomain}):`,
    '',
    summaryLines || 'Belum ada catatan revisi — ingin konsultasi penyempurnaan website.',
    '',
    `Mohon dibantu penyesuaian sampai puas. Terima kasih.`,
  ].join('\n');

  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(waMessageText)}`;

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputNote.trim();
    if (!trimmed) return;
    onSendMessage(selectedArea, trimmed);
    setInputNote('');
    setDispatchedNotice(false);
  };

  const handleCopyWaMessage = async () => {
    try {
      await navigator.clipboard.writeText(waMessageText);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 2500);
    } catch {
      setCopiedNotice(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/35 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-drawer-title"
    >
      <div className="w-full max-w-md bg-white h-full border-l border-slate-200 flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            <h2 id="feedback-drawer-title" className="font-display text-lg font-bold text-slate-900">
              Masukan &amp; Revisi Website
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Tulis apa saja yang kurang sampai puas · Otomatis ke WhatsApp Developer
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel masukan"
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-3 pb-2 border-b border-slate-200 flex items-center gap-1 bg-slate-50">
          <button
            type="button"
            onClick={() => setActiveTab('feedback')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'feedback'
                ? 'bg-white text-slate-900 border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tulis Masukan ({revisions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('wa_summary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'wa_summary'
                ? 'bg-white text-slate-900 border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Format &amp; WA Developer
          </button>
        </div>

        {activeTab === 'feedback' ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="text-xs text-slate-600 border-b border-slate-100 pb-3 space-y-2">
                <p className="font-semibold text-slate-800">
                  Pilih contoh masukan cepat atau tulis sendiri di bawah:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SUGGESTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onSendMessage(selectedArea, item)}
                      className="text-left text-xs px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      + {item}
                    </button>
                  ))}
                </div>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="text-[11px] text-slate-500 mb-1">
                    {msg.author} · <span className="tabular-nums">{msg.time}</span>
                  </div>
                  <div
                    className={`max-w-[88%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-700 text-white'
                        : 'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-200 bg-white space-y-3">
              <form onSubmit={handleSubmitNote} className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                    Bagian Web:
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    aria-label="Pilih bagian website yang ingin direvisi"
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:border-blue-700"
                  >
                    {FEEDBACK_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputNote}
                    onChange={(e) => setInputNote(e.target.value)}
                    placeholder="Tulis apa yang kurang atau ingin diubah..."
                    aria-label="Catatan masukan website"
                    className="flex-1 px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors min-h-[42px] whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Catat
                  </button>
                </div>
              </form>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setDispatchedNotice(true)}
                  className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors min-h-[44px] flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    Kirim Otomatis ke WA Developer ({pendingRevisions.length || revisions.length} Masukan)
                  </span>
                </a>
                {dispatchedNotice && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      Pesan masukan lengkap telah diarahkan ke WhatsApp Developer (+{cleanWa}).
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor WhatsApp Developer Tujuan
              </label>
              <input
                type="tel"
                value={developerWaNumber}
                onChange={(e) => onChangeDeveloperWaNumber(e.target.value)}
                placeholder="6281234567890"
                className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Semua catatan revisi otomatis dirangkum ke tautan wa.me/+{cleanWa}
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-700">
                  Daftar Masukan Pelanggan ({revisions.length})
                </h3>
                <span className="text-[11px] text-slate-500">Klik status jika sudah puas</span>
              </div>

              {revisions.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">
                  Belum ada catatan. Tambahkan masukan di tab &ldquo;Tulis Masukan&rdquo;.
                </p>
              ) : (
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                  {revisions.map((rev) => (
                    <div key={rev.id} className="p-3.5 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-900">{rev.area}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onToggleRevisionStatus(rev.id)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold ${
                              rev.status === 'Selesai'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {rev.status === 'Selesai' && <Check className="w-3 h-3" />}
                            {rev.status}
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRevision(rev.id)}
                            aria-label="Hapus masukan"
                            className="p-1 text-slate-400 hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{rev.note}</p>
                      <div className="text-[11px] text-slate-400 tabular-nums">{rev.createdAt}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Pratinjau Pesan Otomatis ke WA
                </span>
                <button
                  type="button"
                  onClick={handleCopyWaMessage}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedNotice ? 'Tersalin' : 'Salin Teks'}
                </button>
              </div>
              <pre className="p-3.5 rounded-lg bg-slate-900 text-slate-100 text-[11px] font-mono whitespace-pre-wrap leading-relaxed">
                {waMessageText}
              </pre>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors min-h-[44px] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Kirim ke WhatsApp Developer Sekarang</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
