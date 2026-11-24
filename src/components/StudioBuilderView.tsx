import {useState} from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Copy,
  CreditCard,
  Eye,
  GripVertical,
  Headphones,
  Monitor,
  Pencil,
  Plus,
  Smartphone,
  Tablet,
  Trash2,
} from 'lucide-react';
import {
  GENERATED_ASSETS,
  PAYMENT_METHOD_LABELS,
  TEMPLATE_PRESETS,
  formatRupiah,
} from '../data/initialState';
import {
  AppSection,
  BlockType,
  DeviceViewport,
  PaymentMethodId,
  SiteBlock,
  SiteThemeConfig,
  TrialState,
} from '../types/builder';
import {SafeImage} from './SafeImage';

interface StudioBuilderViewProps {
  blocks: SiteBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<SiteBlock[]>>;
  theme: SiteThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<SiteThemeConfig>>;
  trialState: TrialState;
  remainingFormatted: string;
  onStartTrial: () => void;
  onNavigate: (section: AppSection) => void;
  onOpenSupport: () => void;
  onRecordPayment: (customerName: string, itemLabel: string, method: PaymentMethodId, amountIdr: number) => void;
}

const PALETTE_ITEMS: Array<{type: BlockType; label: string; desc: string}> = [
  {type: BlockType.Hero, label: 'Hero Utama', desc: 'Judul besar, gambar, dan CTA'},
  {type: BlockType.ProductCatalog, label: 'Katalog Produk', desc: 'Daftar produk dengan harga IDR'},
  {type: BlockType.PaymentCheckout, label: 'Checkout Pembayaran', desc: 'QRIS, VA, E-Wallet, Kartu'},
  {type: BlockType.Testimonials, label: 'Testimoni Klien', desc: 'Ulasan terverifikasi pelanggan'},
  {type: BlockType.ContactForm, label: 'Formulir Kontak', desc: 'Pengumpulan prospek terenkripsi'},
  {type: BlockType.Faq, label: 'Daftar FAQ', desc: 'Tanya jawab akordeon ringkas'},
];

const ACCENT_PRESETS = ['#1D4ED8', '#0F172A', '#047857', '#B45309', '#9F1239'];

const IMAGE_CHOICES = [
  {label: 'Kursi Kayu Jati (Studio)', url: GENERATED_ASSETS.furnitureCase},
  {label: 'Interior Minimalis (Plaster)', url: GENERATED_ASSETS.interiorTemplate},
  {label: 'Kopi Spesialti (Roastery)', url: GENERATED_ASSETS.coffeeCase},
  {label: 'Ruang Kerja Desain', url: GENERATED_ASSETS.heroStudio},
];

function createBlockFromType(type: BlockType): SiteBlock {
  const id = `blk-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  switch (type) {
    case BlockType.Hero:
      return {
        id,
        type,
        title: 'Solusi Digital Modern untuk Pertumbuhan Bisnis Anda',
        subtitle: 'Sesuaikan judul, gambar, dan tombol ajakan bertindak sesuai kebutuhan pelanggan.',
        ctaText: 'Mulai Konsultasi',
        align: 'left',
        surface: 'light',
        imageUrl: GENERATED_ASSETS.interiorTemplate,
        imageAlt: 'Interior ruang pamer modern yang bersih dan tertata',
      };
    case BlockType.ProductCatalog:
      return {
        id,
        type,
        title: 'Layanan & Produk Unggulan',
        subtitle: 'Harga transparan dengan opsi pemesanan langsung.',
        ctaText: 'Pesan Sekarang',
        align: 'left',
        surface: 'muted',
        products: [
          {
            id: `p-${Date.now()}-1`,
            name: 'Paket Desain Kustom',
            description: 'Pembuatan halaman utama dan katalog produk siap transaksi.',
            priceIdr: 1850000,
            imageUrl: GENERATED_ASSETS.interiorTemplate,
          },
          {
            id: `p-${Date.now()}-2`,
            name: 'Pendampingan SEO Lokal',
            description: 'Penataan kata kunci dan struktur data pencarian selama 30 hari.',
            priceIdr: 950000,
            imageUrl: GENERATED_ASSETS.heroStudio,
          },
        ],
      };
    case BlockType.PaymentCheckout:
      return {
        id,
        type,
        title: 'Pembayaran Instan Pelanggan',
        subtitle: 'Dukung QRIS, Virtual Account, E-Wallet, dan Kartu dalam satu formulir aman.',
        ctaText: 'Bayar Sekarang',
        align: 'left',
        surface: 'light',
        paymentTitle: 'Pembayaran Pesanan Kustom',
        paymentAmountIdr: 1250000,
        enabledPayments: [
          PaymentMethodId.Qris,
          PaymentMethodId.VirtualAccount,
          PaymentMethodId.EWallet,
        ],
      };
    case BlockType.Testimonials:
      return {
        id,
        type,
        title: 'Kata Pelanggan Kami',
        subtitle: 'Pengalaman nyata menggunakan produk dan layanan kami.',
        ctaText: '',
        align: 'left',
        surface: 'muted',
        testimonials: [
          {
            id: `t-${Date.now()}`,
            quote: 'Proses transaksi sangat mudah dan tim dukungan merespons kurang dari lima menit.',
            authorName: 'Andi Gunawan',
            role: 'Pemilik Usaha',
            company: 'Karya Mandiri Jakarta',
          },
        ],
      };
    case BlockType.ContactForm:
      return {
        id,
        type,
        title: 'Hubungi Tim Kami',
        subtitle: 'Kirimkan detail kebutuhan Anda. Data terlindungi enkripsi end-to-end.',
        ctaText: 'Kirim Pesan',
        align: 'left',
        surface: 'light',
        contactEmail: 'halo@bisnisanda.id',
      };
    case BlockType.Faq:
      return {
        id,
        type,
        title: 'Pertanyaan yang Sering Diajukan',
        subtitle: 'Informasi singkat sebelum Anda melakukan pemesanan.',
        ctaText: '',
        align: 'left',
        surface: 'muted',
        faqs: [
          {
            id: `f-${Date.now()}`,
            question: 'Apakah pembayaran langsung terkonfirmasi otomatis?',
            answer: 'Ya, transaksi melalui QRIS dan Virtual Account terverifikasi secara real-time.',
          },
        ],
      };
  }
}

export function StudioBuilderView({
  blocks,
  setBlocks,
  theme,
  setTheme,
  trialState,
  remainingFormatted,
  onStartTrial,
  onNavigate,
  onOpenSupport,
  onRecordPayment,
}: StudioBuilderViewProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string>(blocks[0]?.id ?? '');
  const [viewport, setViewport] = useState<DeviceViewport>(DeviceViewport.Desktop);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [publishNotice, setPublishNotice] = useState<string | null>(null);

  // Interactive test checkout state inside the canvas Payment block
  const [canvasPayMethod, setCanvasPayMethod] = useState<PaymentMethodId>(PaymentMethodId.Qris);
  const [canvasBuyerName, setCanvasBuyerName] = useState('Pelanggan Uji Coba');
  const [canvasPayReceipt, setCanvasPayReceipt] = useState<string | null>(null);
  const [contactSentNotice, setContactSentNotice] = useState<string | null>(null);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) ?? blocks[0] ?? null;

  const radiusClass =
    theme.radiusMode === 'sharp'
      ? 'rounded-none'
      : theme.radiusMode === 'rounded'
        ? 'rounded-2xl'
        : 'rounded-lg';

  const handleAddBlock = (type: BlockType, insertAtIndex?: number) => {
    const next = createBlockFromType(type);
    setBlocks((prev) => {
      if (typeof insertAtIndex === 'number' && insertAtIndex >= 0 && insertAtIndex <= prev.length) {
        const copy = [...prev];
        copy.splice(insertAtIndex, 0, next);
        return copy;
      }
      return [...prev, next];
    });
    setSelectedBlockId(next.id);
    setPublishNotice(null);
  };

  const handleMoveBlock = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    setBlocks((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
  };

  const handleDuplicateBlock = (index: number) => {
    const source = blocks[index];
    if (!source) return;
    const copyBlock: SiteBlock = {
      ...structuredClone(source),
      id: `blk-${Date.now()}`,
      title: `${source.title} (Salinan)`,
    };
    setBlocks((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, copyBlock);
      return next;
    });
    setSelectedBlockId(copyBlock.id);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks((prev) => {
      const filtered = prev.filter((b) => b.id !== id);
      if (selectedBlockId === id) {
        setSelectedBlockId(filtered[0]?.id ?? '');
      }
      return filtered;
    });
  };

  const updateSelectedBlock = (patch: Partial<SiteBlock>) => {
    if (!selectedBlock) return;
    setBlocks((prev) =>
      prev.map((b) => (b.id === selectedBlock.id ? {...b, ...patch} : b))
    );
  };

  const handleDropOnCanvas = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const paletteType = e.dataTransfer.getData('paletteType') as BlockType | '';
    if (paletteType) {
      handleAddBlock(paletteType, dropIndex);
    } else if (draggedBlockIndex !== null && draggedBlockIndex !== dropIndex) {
      setBlocks((prev) => {
        const copy = [...prev];
        const [moved] = copy.splice(draggedBlockIndex, 1);
        copy.splice(dropIndex, 0, moved);
        return copy;
      });
    }
    setDraggedBlockIndex(null);
    setDragOverIndex(null);
  };

  const handleApplyPreset = (presetKey: string) => {
    const preset = TEMPLATE_PRESETS[presetKey];
    if (!preset) return;
    const clonedBlocks = structuredClone(preset.blocks);
    setBlocks(clonedBlocks);
    setTheme(structuredClone(preset.theme));
    setSelectedBlockId(clonedBlocks[0]?.id ?? '');
    setPublishNotice(`Templat "${preset.label}" diterapkan.`);
  };

  const handlePublish = () => {
    if (!trialState.isActive && !trialState.subscribedPlanId) {
      onStartTrial();
    }
    setPublishNotice(
      `Situs diterbitkan ke https://${theme.subdomain} dengan sertifikat SSL TLS 1.3 & enkripsi end-to-end.`
    );
  };

  const canvasWidthClass =
    viewport === DeviceViewport.Mobile
      ? 'max-w-[390px]'
      : viewport === DeviceViewport.Tablet
        ? 'max-w-[768px]'
        : 'max-w-full';

  return (
    <div className="bg-slate-100 min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Studio Sub-Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-sm font-bold text-slate-900">
            Studio Drag-and-Drop
          </span>
          <span className="text-slate-300" aria-hidden="true">|</span>
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <span className="hidden sm:inline">Templat:</span>
            <select
              aria-label="Pilih templat awal"
              onChange={(e) => handleApplyPreset(e.target.value)}
              defaultValue="furniture"
              className="px-2.5 py-1.5 text-xs font-medium border border-slate-200 rounded-md bg-white text-slate-900 focus:outline-none focus:border-blue-700"
            >
              {Object.entries(TEMPLATE_PRESETS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Responsive Viewport & Edit/Preview Switch */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => setViewport(DeviceViewport.Desktop)}
              aria-label="Tampilan Desktop"
              className={`p-1.5 rounded-md transition-colors ${
                viewport === DeviceViewport.Desktop
                  ? 'bg-white text-slate-900'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewport(DeviceViewport.Tablet)}
              aria-label="Tampilan Tablet"
              className={`p-1.5 rounded-md transition-colors ${
                viewport === DeviceViewport.Tablet
                  ? 'bg-white text-slate-900'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewport(DeviceViewport.Mobile)}
              aria-label="Tampilan Ponsel"
              className={`p-1.5 rounded-md transition-colors ${
                viewport === DeviceViewport.Mobile
                  ? 'bg-white text-slate-900'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsPreviewMode((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap min-h-[36px] ${
              isPreviewMode
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isPreviewMode ? (
              <>
                <Pencil className="w-3.5 h-3.5" /> Kembali ke Editor
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> Pratinjau &amp; Uji Bayar
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSupport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 whitespace-nowrap min-h-[36px]"
          >
            <Headphones className="w-3.5 h-3.5 text-blue-700" /> Masukan Web (WA)
          </button>

          {trialState.subscribedPlanId ? (
            <span className="text-xs font-semibold text-emerald-700 px-2.5">
              Paket Aktif
            </span>
          ) : trialState.status === 'active' ? (
            <button
              type="button"
              onClick={() => onNavigate(AppSection.Pricing)}
              className="px-3 py-1.5 text-xs font-mono font-medium text-blue-800 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 whitespace-nowrap"
            >
              Uji Coba: {remainingFormatted}
            </button>
          ) : trialState.status === 'pending_developer' ? (
            <button
              type="button"
              onClick={onStartTrial}
              className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 whitespace-nowrap"
            >
              Menunggu Konfirmasi Dev
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartTrial}
              className="px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg whitespace-nowrap"
            >
              Ajukan Uji Coba 2 Hari
            </button>
          )}

          <button
            type="button"
            onClick={handlePublish}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap min-h-[36px]"
          >
            Publikasikan
          </button>
        </div>
      </div>

      {publishNotice && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center justify-between gap-4 text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{publishNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setPublishNotice(null)}
            className="font-semibold text-emerald-800 hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Main 3-Pane Studio Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
        {/* Left Pane: Drag Palette & Custom Theme */}
        {!isPreviewMode && (
          <aside className="lg:col-span-3 bg-white border-r border-slate-200 p-5 space-y-6 overflow-y-auto">
            <div>
              <h2 className="text-xs font-semibold text-slate-900 mb-1">
                Komponen Drag-and-Drop
              </h2>
              <p className="text-xs text-slate-500 mb-3">
                Seret komponen ke kanvas atau klik tambah.
              </p>
              <div className="space-y-2">
                {PALETTE_ITEMS.map((item) => (
                  <div
                    key={item.type}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('paletteType', item.type);
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    className="group border border-slate-200 rounded-lg p-3 bg-white hover:border-blue-600 cursor-grab active:cursor-grabbing flex items-center justify-between gap-2 transition-colors"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <GripVertical className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{item.desc}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddBlock(item.type)}
                      aria-label={`Tambah blok ${item.label}`}
                      className="w-7 h-7 inline-flex items-center justify-center rounded-md bg-slate-100 hover:bg-blue-700 hover:text-white text-slate-700 shrink-0 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-slate-200 space-y-4">
              <h2 className="text-xs font-semibold text-slate-900">
                Kustomisasi Identitas Situs
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Nama Merek / Bisnis
                </label>
                <input
                  type="text"
                  value={theme.siteName}
                  onChange={(e) => setTheme((prev) => ({...prev, siteName: e.target.value}))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Alamat Subdomain
                </label>
                <input
                  type="text"
                  value={theme.subdomain}
                  onChange={(e) => setTheme((prev) => ({...prev, subdomain: e.target.value}))}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Warna Aksen Utama
                </label>
                <div className="flex items-center gap-2">
                  {ACCENT_PRESETS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setTheme((prev) => ({...prev, accentColor: hex}))}
                      aria-label={`Pilih warna aksen ${hex}`}
                      className={`w-7 h-7 rounded-md border-2 transition-transform ${
                        theme.accentColor === hex ? 'border-slate-900 scale-110' : 'border-transparent'
                      }`}
                      style={{backgroundColor: hex}}
                    />
                  ))}
                  <input
                    type="color"
                    aria-label="Warna aksen kustom"
                    value={theme.accentColor}
                    onChange={(e) => setTheme((prev) => ({...prev, accentColor: e.target.value}))}
                    className="w-7 h-7 p-0 border border-slate-300 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Sudut Komponen
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      {id: 'sharp', label: 'Tajam'},
                      {id: 'medium', label: 'Sedang'},
                      {id: 'rounded', label: 'Bulat'},
                    ] as const
                  ).map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setTheme((prev) => ({...prev, radiusMode: mode.id}))}
                      className={`py-1.5 text-xs font-medium rounded-md border ${
                        theme.radiusMode === mode.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Center Pane: Interactive Drop Canvas */}
        <main
          className={`${
            isPreviewMode ? 'lg:col-span-12' : 'lg:col-span-6'
          } p-4 sm:p-6 overflow-y-auto flex justify-center`}
        >
          <div
            className={`w-full ${canvasWidthClass} transition-all bg-white border border-slate-200 rounded-xl overflow-hidden self-start`}
          >
            {/* Simulated Client Site Top Navigation */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-white">
              <span className="font-display font-bold text-base text-slate-900">
                {theme.siteName}
              </span>
              <span className="text-xs font-mono text-slate-500 truncate">
                https://{theme.subdomain}
              </span>
            </div>

            {blocks.length === 0 ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropOnCanvas(e, 0)}
                className="p-16 text-center border-2 border-dashed border-slate-300 m-6 rounded-xl space-y-3"
              >
                <p className="font-display text-lg font-semibold text-slate-900">
                  Kanvas Website Masih Kosong
                </p>
                <p className="text-sm text-slate-600">
                  Seret komponen dari panel kiri ke area ini atau klik tombol di bawah.
                </p>
                <button
                  type="button"
                  onClick={() => handleAddBlock(BlockType.Hero)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg"
                >
                  Tambah Blok Hero Utama
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {blocks.map((block, index) => {
                  const isSelected = !isPreviewMode && selectedBlock?.id === block.id;
                  const isDragTarget = dragOverIndex === index;
                  const surfaceClasses =
                    block.surface === 'dark'
                      ? 'bg-slate-900 text-white'
                      : block.surface === 'muted'
                        ? 'bg-slate-50 text-slate-900'
                        : 'bg-white text-slate-900';

                  return (
                    <div
                      key={block.id}
                      draggable={!isPreviewMode}
                      onDragStart={() => setDraggedBlockIndex(index)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragOverIndex !== index) setDragOverIndex(index);
                      }}
                      onDragLeave={() => setDragOverIndex(null)}
                      onDrop={(e) => handleDropOnCanvas(e, index)}
                      onClick={() => {
                        if (!isPreviewMode) setSelectedBlockId(block.id);
                      }}
                      className={`relative transition-colors ${surfaceClasses} ${
                        !isPreviewMode ? 'cursor-pointer' : ''
                      } ${isSelected ? 'ring-2 ring-inset ring-blue-700' : ''} ${
                        isDragTarget ? 'ring-2 ring-inset ring-blue-500 bg-blue-50/40' : ''
                      }`}
                    >
                      {!isPreviewMode && (
                        <div className="px-4 py-2 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between gap-2 text-xs text-slate-700">
                          <div className="flex items-center gap-2 font-medium">
                            <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {index + 1}.{' '}
                              {PALETTE_ITEMS.find((p) => p.type === block.type)?.label ?? block.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveBlock(index, -1);
                              }}
                              disabled={index === 0}
                              aria-label="Geser ke atas"
                              className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveBlock(index, 1);
                              }}
                              disabled={index === blocks.length - 1}
                              aria-label="Geser ke bawah"
                              className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateBlock(index);
                              }}
                              aria-label="Duplikat blok"
                              className="p-1 rounded hover:bg-slate-200"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBlock(block.id);
                              }}
                              aria-label="Hapus blok"
                              className="p-1 rounded hover:bg-red-100 text-red-700"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Rendered Block Body */}
                      <div
                        className={`p-8 sm:p-10 ${
                          block.align === 'center' ? 'text-center' : 'text-left'
                        }`}
                      >
                        {block.type === BlockType.Hero && (
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                            <div
                              className={`${
                                block.imageUrl ? 'md:col-span-7' : 'md:col-span-12'
                              } space-y-4`}
                            >
                              <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight text-balance">
                                {block.title}
                              </h1>
                              <p
                                className={`text-sm leading-relaxed ${
                                  block.surface === 'dark' ? 'text-slate-300' : 'text-slate-600'
                                }`}
                              >
                                {block.subtitle}
                              </p>
                              {block.ctaText && (
                                <button
                                  type="button"
                                  className={`px-5 py-2.5 text-sm font-semibold text-white ${radiusClass}`}
                                  style={{backgroundColor: theme.accentColor}}
                                >
                                  {block.ctaText}
                                </button>
                              )}
                            </div>
                            {block.imageUrl && (
                              <div
                                className={`md:col-span-5 aspect-[4/3] overflow-hidden border border-slate-200 ${radiusClass}`}
                              >
                                <SafeImage
                                  src={block.imageUrl}
                                  alt={block.imageAlt || block.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {block.type === BlockType.ProductCatalog && (
                          <div className="space-y-6">
                            <div>
                              <h2 className="font-display text-2xl font-bold">{block.title}</h2>
                              <p
                                className={`text-sm mt-1 ${
                                  block.surface === 'dark' ? 'text-slate-300' : 'text-slate-600'
                                }`}
                              >
                                {block.subtitle}
                              </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              {(block.products ?? []).map((prod) => (
                                <div
                                  key={prod.id}
                                  className={`border border-slate-200 overflow-hidden bg-white text-slate-900 ${radiusClass}`}
                                >
                                  {prod.imageUrl && (
                                    <div className="aspect-[4/3] bg-slate-100 border-b border-slate-200 overflow-hidden">
                                      <SafeImage
                                        src={prod.imageUrl}
                                        alt={prod.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="p-5 space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                      <h3 className="font-display font-bold text-base">
                                        {prod.name}
                                      </h3>
                                      <span className="text-sm font-semibold tabular-nums whitespace-nowrap">
                                        {formatRupiah(prod.priceIdr)}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                      {prod.description}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        if (isPreviewMode) {
                                          e.stopPropagation();
                                          onRecordPayment(
                                            'Pelanggan Katalog',
                                            prod.name,
                                            PaymentMethodId.Qris,
                                            prod.priceIdr
                                          );
                                          setCanvasPayReceipt(
                                            `Pesanan "${prod.name}" (${formatRupiah(prod.priceIdr)}) berhasil dicatat ke Analitik.`
                                          );
                                        }
                                      }}
                                      className={`w-full py-2 text-xs font-semibold text-white ${radiusClass}`}
                                      style={{backgroundColor: theme.accentColor}}
                                    >
                                      {block.ctaText || 'Pilih Produk'}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {block.type === BlockType.PaymentCheckout && (
                          <div className="space-y-5">
                            <div>
                              <h2 className="font-display text-2xl font-bold">{block.title}</h2>
                              <p
                                className={`text-sm mt-1 ${
                                  block.surface === 'dark' ? 'text-slate-300' : 'text-slate-600'
                                }`}
                              >
                                {block.subtitle}
                              </p>
                            </div>

                            <div
                              className={`border border-slate-200 bg-white text-slate-900 p-6 space-y-5 ${radiusClass}`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                                <div>
                                  <div className="text-xs text-slate-500">Item Pembayaran</div>
                                  <div className="font-semibold text-sm">
                                    {block.paymentTitle || 'Pembayaran Produk'}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-slate-500">Total Tagihan</div>
                                  <div className="font-display text-xl font-bold tabular-nums">
                                    {formatRupiah(block.paymentAmountIdr ?? 0)}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {(block.enabledPayments ?? []).map((methodId) => {
                                  const meta = PAYMENT_METHOD_LABELS[methodId];
                                  const active = canvasPayMethod === methodId;
                                  return (
                                    <button
                                      key={methodId}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCanvasPayMethod(methodId);
                                      }}
                                      className={`p-3 text-left border transition-colors ${radiusClass} ${
                                        active
                                          ? 'border-blue-700 bg-blue-50/60'
                                          : 'border-slate-200 hover:bg-slate-50'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                                        <CreditCard className="w-3.5 h-3.5 text-blue-700" />
                                        {meta.name}
                                      </div>
                                      <div className="text-[11px] text-slate-500 mt-0.5">
                                        {meta.subtitle}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                  type="text"
                                  value={canvasBuyerName}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => setCanvasBuyerName(e.target.value)}
                                  placeholder="Nama lengkap pembeli"
                                  aria-label="Nama lengkap pembeli"
                                  className={`flex-1 px-3 py-2 text-xs border border-slate-300 ${radiusClass}`}
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRecordPayment(
                                      canvasBuyerName || 'Pelanggan Baru',
                                      block.paymentTitle || 'Transaksi Checkout',
                                      canvasPayMethod,
                                      block.paymentAmountIdr ?? 0
                                    );
                                    setCanvasPayReceipt(
                                      `Pembayaran ${formatRupiah(block.paymentAmountIdr ?? 0)} via ${PAYMENT_METHOD_LABELS[canvasPayMethod].name} terkonfirmasi & terenkripsi.`
                                    );
                                  }}
                                  className={`px-5 py-2.5 text-xs font-semibold text-white whitespace-nowrap ${radiusClass}`}
                                  style={{backgroundColor: theme.accentColor}}
                                >
                                  {block.ctaText || 'Bayar Sekarang'}
                                </button>
                              </div>

                              {canvasPayReceipt && (
                                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                                  <span>{canvasPayReceipt}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {block.type === BlockType.Testimonials && (
                          <div className="space-y-6">
                            <div>
                              <h2 className="font-display text-2xl font-bold">{block.title}</h2>
                              <p
                                className={`text-sm mt-1 ${
                                  block.surface === 'dark' ? 'text-slate-300' : 'text-slate-600'
                                }`}
                              >
                                {block.subtitle}
                              </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              {(block.testimonials ?? []).map((item) => (
                                <blockquote
                                  key={item.id}
                                  className={`p-5 border border-slate-200 bg-white text-slate-900 space-y-3 ${radiusClass}`}
                                >
                                  <p className="text-sm leading-relaxed text-slate-700">
                                    “{item.quote}”
                                  </p>
                                  <footer className="text-xs text-slate-500">
                                    <span className="font-semibold text-slate-900">
                                      {item.authorName}
                                    </span>{' '}
                                    · {item.role}, {item.company}
                                  </footer>
                                </blockquote>
                              ))}
                            </div>
                          </div>
                        )}

                        {block.type === BlockType.ContactForm && (
                          <div className="max-w-lg space-y-4">
                            <h2 className="font-display text-2xl font-bold">{block.title}</h2>
                            <p
                              className={`text-sm ${
                                block.surface === 'dark' ? 'text-slate-300' : 'text-slate-600'
                              }`}
                            >
                              {block.subtitle}
                            </p>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                setContactSentNotice(
                                  `Pesan terkirim dengan enkripsi E2E ke ${block.contactEmail || 'admin@rakitweb.id'}.`
                                );
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="space-y-3"
                            >
                              <input
                                type="text"
                                required
                                placeholder="Nama Anda"
                                className={`w-full px-3.5 py-2.5 text-sm border border-slate-300 bg-white text-slate-900 ${radiusClass}`}
                              />
                              <input
                                type="email"
                                required
                                placeholder="Email Bisnis"
                                className={`w-full px-3.5 py-2.5 text-sm border border-slate-300 bg-white text-slate-900 ${radiusClass}`}
                              />
                              <button
                                type="submit"
                                className={`px-5 py-2.5 text-sm font-semibold text-white ${radiusClass}`}
                                style={{backgroundColor: theme.accentColor}}
                              >
                                {block.ctaText || 'Kirim Pesan'}
                              </button>
                              {contactSentNotice && (
                                <p className="text-xs text-emerald-700 font-medium">
                                  {contactSentNotice}
                                </p>
                              )}
                            </form>
                          </div>
                        )}

                        {block.type === BlockType.Faq && (
                          <div className="space-y-5">
                            <div>
                              <h2 className="font-display text-2xl font-bold">{block.title}</h2>
                              <p
                                className={`text-sm mt-1 ${
                                  block.surface === 'dark' ? 'text-slate-300' : 'text-slate-600'
                                }`}
                              >
                                {block.subtitle}
                              </p>
                            </div>
                            <div className="divide-y divide-slate-200 border border-slate-200 bg-white text-slate-900 rounded-lg">
                              {(block.faqs ?? []).map((faq) => (
                                <div key={faq.id} className="p-4 space-y-1.5">
                                  <div className="text-sm font-semibold text-slate-900">
                                    {faq.question}
                                  </div>
                                  <p className="text-xs text-slate-600 leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {/* Right Pane: Block Inspector */}
        {!isPreviewMode && (
          <aside className="lg:col-span-3 bg-white border-l border-slate-200 p-5 overflow-y-auto">
            {!selectedBlock ? (
              <div className="text-xs text-slate-500 py-8 text-center">
                Pilih blok pada kanvas untuk mengedit teks, harga, pembayaran, dan gambar.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="pb-3 border-b border-slate-200">
                  <div className="text-xs font-semibold text-blue-700">Inspektur Blok</div>
                  <div className="font-display text-base font-bold text-slate-900 mt-0.5">
                    {PALETTE_ITEMS.find((p) => p.type === selectedBlock.type)?.label}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Judul Bagian
                  </label>
                  <input
                    type="text"
                    value={selectedBlock.title}
                    onChange={(e) => updateSelectedBlock({title: e.target.value})}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Subjudul / Deskripsi
                  </label>
                  <textarea
                    rows={3}
                    value={selectedBlock.subtitle}
                    onChange={(e) => updateSelectedBlock({subtitle: e.target.value})}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                {selectedBlock.type !== BlockType.Testimonials &&
                  selectedBlock.type !== BlockType.Faq && (
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Label Tombol Aksi (CTA)
                      </label>
                      <input
                        type="text"
                        value={selectedBlock.ctaText}
                        onChange={(e) => updateSelectedBlock({ctaText: e.target.value})}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                      />
                    </div>
                  )}

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Latar Permukaan
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        {id: 'light', label: 'Putih'},
                        {id: 'muted', label: 'Abu Lembut'},
                        {id: 'dark', label: 'Gelap'},
                      ] as const
                    ).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => updateSelectedBlock({surface: s.id})}
                        className={`py-1.5 text-xs font-medium rounded-md border ${
                          selectedBlock.surface === s.id
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedBlock.type === BlockType.Hero && (
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <label className="block text-xs font-medium text-slate-700">
                      Pilih Gambar Hero
                    </label>
                    <select
                      value={selectedBlock.imageUrl ?? ''}
                      onChange={(e) => updateSelectedBlock({imageUrl: e.target.value})}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      {IMAGE_CHOICES.map((img) => (
                        <option key={img.url} value={img.url}>
                          {img.label}
                        </option>
                      ))}
                    </select>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Teks Alt Gambar (Untuk SEO)
                      </label>
                      <input
                        type="text"
                        value={selectedBlock.imageAlt ?? ''}
                        onChange={(e) => updateSelectedBlock({imageAlt: e.target.value})}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {selectedBlock.type === BlockType.PaymentCheckout && (
                  <div className="space-y-4 pt-3 border-t border-slate-200">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Nama Item Tagihan
                      </label>
                      <input
                        type="text"
                        value={selectedBlock.paymentTitle ?? ''}
                        onChange={(e) => updateSelectedBlock({paymentTitle: e.target.value})}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Nominal Harga (IDR)
                      </label>
                      <input
                        type="number"
                        min={10000}
                        step={5000}
                        value={selectedBlock.paymentAmountIdr ?? 0}
                        onChange={(e) =>
                          updateSelectedBlock({paymentAmountIdr: Number(e.target.value) || 0})
                        }
                        className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-slate-700 mb-2">
                        Metode Pembayaran Aktif
                      </span>
                      <div className="space-y-2">
                        {Object.values(PaymentMethodId).map((methodId) => {
                          const checked = (selectedBlock.enabledPayments ?? []).includes(methodId);
                          return (
                            <label
                              key={methodId}
                              className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  const current = selectedBlock.enabledPayments ?? [];
                                  const next = checked
                                    ? current.filter((m) => m !== methodId)
                                    : [...current, methodId];
                                  if (next.length > 0) {
                                    updateSelectedBlock({enabledPayments: next});
                                  }
                                }}
                                className="rounded border-slate-300 text-blue-700"
                              />
                              <span>{PAYMENT_METHOD_LABELS[methodId].name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {selectedBlock.type === BlockType.ProductCatalog && (
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">Daftar Produk</span>
                      <button
                        type="button"
                        onClick={() => {
                          const current = selectedBlock.products ?? [];
                          updateSelectedBlock({
                            products: [
                              ...current,
                              {
                                id: `prod-${Date.now()}`,
                                name: 'Produk Baru Kustom',
                                description: 'Deskripsi singkat keunggulan produk.',
                                priceIdr: 500000,
                                imageUrl: GENERATED_ASSETS.interiorTemplate,
                              },
                            ],
                          });
                        }}
                        className="text-xs font-semibold text-blue-700 hover:underline"
                      >
                        + Tambah Produk
                      </button>
                    </div>
                    {(selectedBlock.products ?? []).map((prod, idx) => (
                      <div
                        key={prod.id}
                        className="p-3 border border-slate-200 rounded-lg space-y-2 bg-slate-50"
                      >
                        <input
                          type="text"
                          value={prod.name}
                          onChange={(e) => {
                            const next = [...(selectedBlock.products ?? [])];
                            next[idx] = {...prod, name: e.target.value};
                            updateSelectedBlock({products: next});
                          }}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                        />
                        <input
                          type="number"
                          value={prod.priceIdr}
                          onChange={(e) => {
                            const next = [...(selectedBlock.products ?? [])];
                            next[idx] = {...prod, priceIdr: Number(e.target.value) || 0};
                            updateSelectedBlock({products: next});
                          }}
                          className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
