import {useState} from 'react';
import {Check, CheckCircle2, CreditCard, Lock} from 'lucide-react';
import {PAYMENT_METHOD_LABELS, SUBSCRIPTION_PLANS, formatRupiah} from '../data/initialState';
import {PaymentMethodId, SubscriptionTierId, TrialState} from '../types/builder';

interface SubscriptionCheckoutViewProps {
  trialState: TrialState;
  remainingFormatted: string;
  onStartTrial: () => void;
  selectedPlanId: SubscriptionTierId;
  setSelectedPlanId: (id: SubscriptionTierId) => void;
  billingCycle: 'monthly' | 'annual';
  setBillingCycle: (cycle: 'monthly' | 'annual') => void;
  onCompleteSubscription: (planId: SubscriptionTierId, billing: 'monthly' | 'annual') => void;
}

export function SubscriptionCheckoutView({
  trialState,
  remainingFormatted,
  onStartTrial,
  selectedPlanId,
  setSelectedPlanId,
  billingCycle,
  setBillingCycle,
  onCompleteSubscription,
}: SubscriptionCheckoutViewProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>(PaymentMethodId.Qris);
  const [customerEmail, setCustomerEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  const activePlan =
    SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) ?? SUBSCRIPTION_PLANS[1];
  const monthlyEquivalent =
    billingCycle === 'annual' ? activePlan.annualMonthlyPriceIdr : activePlan.monthlyPriceIdr;
  const totalDue = billingCycle === 'annual' ? monthlyEquivalent * 12 : monthlyEquivalent;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.includes('@') || !companyName.trim()) {
      setErrorMsg('Mohon lengkapi nama bisnis dan alamat email penagihan yang valid.');
      return;
    }
    setErrorMsg(null);
    const newId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    setInvoiceId(newId);
    onCompleteSubscription(activePlan.id, billingCycle);
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 2-Day Free Trial Status Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-blue-700">
              Uji Coba Gratis 2 Hari (48 Jam Akses Penuh)
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              {trialState.subscribedPlanId
                ? `Langganan Penuh Aktif: Paket ${
                    SUBSCRIPTION_PLANS.find((p) => p.id === trialState.subscribedPlanId)?.name
                  }`
                : trialState.status === 'active'
                  ? 'Masa Uji Coba 2 Hari Anda Sedang Berjalan'
                  : trialState.status === 'pending_developer'
                    ? 'Pengajuan Web Uji Coba Menunggu Konfirmasi Developer'
                    : 'Ajukan Web Uji Coba Gratis Selama 2 Hari'}
            </h1>
            <p className="text-sm text-slate-600">
              {trialState.subscribedPlanId
                ? 'Seluruh fitur kustomisasi, analitik real-time, SEO, dan integrasi pembayaran aktif penuh.'
                : trialState.status === 'pending_developer'
                  ? 'Kirimkan data ringkas Anda ke WhatsApp developer untuk mengaktifkan timer akses 48 jam.'
                  : 'Isi formulir singkat kebutuhan website Anda untuk dikonfirmasi oleh developer sebelum akses 48 jam dimulai.'}
            </p>
          </div>

          <div className="shrink-0">
            {trialState.subscribedPlanId ? (
              <div className="px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
                Status Akun: Akses Penuh Aktif
              </div>
            ) : trialState.status === 'active' ? (
              <div className="px-5 py-3 rounded-lg bg-slate-900 text-white text-right">
                <div className="text-[11px] text-slate-300">Sisa Waktu Uji Coba</div>
                <div className="font-mono text-xl font-bold tabular-nums">
                  {remainingFormatted}
                </div>
              </div>
            ) : trialState.status === 'pending_developer' ? (
              <button
                type="button"
                onClick={onStartTrial}
                className="px-6 py-3 text-sm font-semibold text-amber-900 bg-amber-100 border border-amber-300 hover:bg-amber-200 rounded-lg transition-colors min-h-[44px] whitespace-nowrap"
              >
                Lanjutkan Konfirmasi Developer
              </button>
            ) : (
              <button
                type="button"
                onClick={onStartTrial}
                className="px-6 py-3 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors min-h-[44px] whitespace-nowrap"
              >
                Isi Formulir Uji Coba 2 Hari
              </button>
            )}
          </div>
        </div>

        {/* Plan Picker & Checkout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-xl font-bold text-slate-900">
                Pilih Paket Langganan Fleksibel
              </h2>
              <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md ${
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
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md ${
                    billingCycle === 'annual'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tahunan (Hemat 20%)
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const price =
                  billingCycle === 'annual' ? plan.annualMonthlyPriceIdr : plan.monthlyPriceIdr;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`w-full text-left p-6 rounded-xl bg-white transition-colors ${
                      isSelected
                        ? 'border-2 border-blue-700'
                        : 'border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-lg font-bold text-slate-900">
                            {plan.name}
                          </span>
                          {plan.recommended && (
                            <span className="text-xs font-semibold text-blue-700">
                              · Rekomendasi
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{plan.audience}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                          {formatRupiah(price)}
                        </div>
                        <div className="text-[11px] text-slate-500">per bulan</div>
                      </div>
                    </div>

                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {plan.highlights.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Payment Integration Panel */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">
                Aktivasi &amp; Pembayaran Instan
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Transaksi diproses melalui jalur terenkripsi end-to-end AES-256.
              </p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Bisnis / Perusahaan
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Contoh: PT Karya Nusantara"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Pengiriman Invoice
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="keuangan@perusahaan.id"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-700 mb-2">
                  Metode Pembayaran
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.values(PaymentMethodId).map((methodId) => {
                    const meta = PAYMENT_METHOD_LABELS[methodId];
                    const active = paymentMethod === methodId;
                    return (
                      <button
                        key={methodId}
                        type="button"
                        onClick={() => setPaymentMethod(methodId)}
                        className={`p-3 text-left rounded-lg border transition-colors ${
                          active
                            ? 'border-blue-700 bg-blue-50/60'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                          <CreditCard className="w-3.5 h-3.5 text-blue-700" />
                          {meta.name}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{meta.subtitle}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Paket Pilihan</span>
                  <span className="font-semibold text-slate-900">
                    {activePlan.name} ({billingCycle === 'annual' ? 'Tahunan' : 'Bulanan'})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Biaya Transaksi Platform</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {activePlan.transactionFeeLabel}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Pembayaran</span>
                  <span className="tabular-nums">{formatRupiah(totalDue)}</span>
                </div>
              </div>

              {errorMsg && <p className="text-xs font-medium text-red-700">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors min-h-[44px] flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Lanjutkan ke Akses Penuh Sekarang</span>
              </button>

              {invoiceId && (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    Pembayaran Terkonfirmasi ({invoiceId})
                  </div>
                  <p>
                    Paket {activePlan.name} untuk {companyName} telah aktif penuh via{' '}
                    {PAYMENT_METHOD_LABELS[paymentMethod].name}.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
