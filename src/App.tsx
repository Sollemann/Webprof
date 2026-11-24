import {useEffect, useState} from 'react';
import {AnalyticsSeoView} from './components/AnalyticsSeoView';
import {Header} from './components/Header';
import {LandingView} from './components/LandingView';
import {SecurityView} from './components/SecurityView';
import {StudioBuilderView} from './components/StudioBuilderView';
import {SubscriptionCheckoutView} from './components/SubscriptionCheckoutView';
import {SupportDrawer} from './components/SupportDrawer';
import {TrialRequestModal} from './components/TrialRequestModal';
import {
  INITIAL_SEO,
  INITIAL_THEME,
  INITIAL_TRANSACTIONS,
  TEMPLATE_PRESETS,
} from './data/initialState';
import {
  AppSection,
  FeedbackRevisionItem,
  PaymentMethodId,
  SeoConfig,
  SiteBlock,
  SiteThemeConfig,
  SubscriptionTierId,
  SupportMessage,
  TransactionRecord,
  TrialRequestData,
  TrialState,
} from './types/builder';

const TRIAL_DURATION_MS = 48 * 60 * 60 * 1000; // 2 Hari (48 Jam)

function formatRemainingTime(ms: number): string {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
}

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.Landing);
  const [blocks, setBlocks] = useState<SiteBlock[]>(() =>
    structuredClone(TEMPLATE_PRESETS.furniture.blocks)
  );
  const [theme, setTheme] = useState<SiteThemeConfig>(() => structuredClone(INITIAL_THEME));
  const [seoConfig, setSeoConfig] = useState<SeoConfig>(() => structuredClone(INITIAL_SEO));
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);

  const [trialState, setTrialState] = useState<TrialState>({
    status: 'idle',
    isActive: false,
    startedAtMs: null,
    durationMs: TRIAL_DURATION_MS,
    subscribedPlanId: null,
    billingCycle: 'annual',
    requestData: null,
  });
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionTierId>(
    SubscriptionTierId.Pro
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const [supportOpen, setSupportOpen] = useState(false);
  const [developerWaNumber, setDeveloperWaNumber] = useState('6281234567890');
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([
    {
      id: 'msg-init',
      sender: 'agent',
      author: 'Tim Developer RakitWeb',
      text: 'Halo! Silakan tulis masukan bagian website mana saja yang masih kurang sampai Anda benar-benar puas. Semua catatan Anda akan otomatis dirangkum ke WhatsApp developer kami.',
      time: 'Siap Revisi',
    },
  ]);
  const [revisions, setRevisions] = useState<FeedbackRevisionItem[]>([
    {
      id: 'REV-101',
      area: 'Tampilan & Tata Letak',
      note: 'Mohon sesuaikan ukuran tombol CTA hero agar lebih menonjol di tampilan ponsel.',
      status: 'Menunggu Developer',
      createdAt: 'Hari ini · 16:10 WIB',
    },
  ]);

  useEffect(() => {
    if (trialState.status !== 'active' || trialState.subscribedPlanId) return;
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [trialState.status, trialState.subscribedPlanId]);

  const remainingMs =
    trialState.status === 'active' && trialState.startedAtMs
      ? Math.max(0, trialState.durationMs - (nowMs - trialState.startedAtMs))
      : TRIAL_DURATION_MS;
  const remainingFormatted = formatRemainingTime(remainingMs);

  const handleOpenTrialFlow = () => {
    if (trialState.status === 'active' || trialState.status === 'subscribed') {
      setActiveSection(AppSection.Builder);
      return;
    }
    setTrialModalOpen(true);
  };

  const handleSubmitTrialRequest = (data: TrialRequestData) => {
    const slugified = data.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 24);

    if (data.websiteCategory.toLowerCase().includes('kuliner')) {
      setBlocks(structuredClone(TEMPLATE_PRESETS.coffee.blocks));
    } else if (
      data.websiteCategory.toLowerCase().includes('konsultan') ||
      data.websiteCategory.toLowerCase().includes('perusahaan')
    ) {
      setBlocks(structuredClone(TEMPLATE_PRESETS.agency.blocks));
    }

    setTheme((prev) => ({
      ...prev,
      siteName: data.businessName,
      subdomain: `${slugified || 'webbisnis'}.rakitweb.id`,
    }));
    setTrialState((prev) => ({
      ...prev,
      status: 'pending_developer',
      requestData: data,
    }));
  };

  const handleConfirmTrialByDeveloper = () => {
    setNowMs(Date.now());
    setTrialState((prev) => ({
      ...prev,
      status: 'active',
      isActive: true,
      startedAtMs: prev.startedAtMs ?? Date.now(),
    }));
    setActiveSection(AppSection.Builder);
  };

  const handleSelectPlanFromLanding = (
    planId: SubscriptionTierId,
    billing: 'monthly' | 'annual'
  ) => {
    setSelectedPlanId(planId);
    setBillingCycle(billing);
    setActiveSection(AppSection.Pricing);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleCompleteSubscription = (
    planId: SubscriptionTierId,
    billing: 'monthly' | 'annual'
  ) => {
    setTrialState((prev) => ({
      ...prev,
      status: 'subscribed',
      isActive: true,
      subscribedPlanId: planId,
      billingCycle: billing,
    }));
  };

  const handleRecordPayment = (
    customerName: string,
    itemLabel: string,
    method: PaymentMethodId,
    amountIdr: number
  ) => {
    const newTx: TransactionRecord = {
      id: `TRX-${Math.floor(89242 + Math.random() * 900)}`,
      timestamp: 'Baru saja · WIB',
      customerName,
      itemLabel,
      method,
      amountIdr,
      status: 'Berhasil',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleSendFeedback = (area: string, note: string) => {
    const timeLabel = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const newRevision: FeedbackRevisionItem = {
      id: `REV-${Math.floor(102 + Math.random() * 890)}`,
      area,
      note,
      status: 'Menunggu Developer',
      createdAt: `Hari ini · ${timeLabel} WIB`,
    };
    setRevisions((prev) => [...prev, newRevision]);

    const userMsg: SupportMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      author: 'Masukan Anda',
      text: `[${area}] ${note}`,
      time: timeLabel,
    };
    const agentMsg: SupportMessage = {
      id: `msg-a-${Date.now() + 1}`,
      sender: 'agent',
      author: 'Tim Developer RakitWeb',
      text: `Masukan untuk "${area}" sudah masuk ke daftar revisi (${newRevision.id}). Masih ada bagian lain yang kurang? Silakan tambah lagi sampai puas, atau klik tombol hijau di bawah untuk kirim otomatis ke WhatsApp Developer.`,
      time: timeLabel,
    };
    setSupportMessages((prev) => [...prev, userMsg, agentMsg]);
  };

  const handleToggleRevisionStatus = (id: string) => {
    setRevisions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'Selesai' ? 'Menunggu Developer' : 'Selesai',
            }
          : item
      )
    );
  };

  const handleDeleteRevision = (id: string) => {
    setRevisions((prev) => prev.filter((item) => item.id !== id));
  };

  const handleNavigate = (section: AppSection) => {
    setActiveSection(section);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onStartTrial={handleOpenTrialFlow}
        trialState={trialState}
      />

      <div className="flex-1">
        {activeSection === AppSection.Landing && (
          <LandingView
            onNavigate={handleNavigate}
            onStartTrial={handleOpenTrialFlow}
            onSelectPlan={handleSelectPlanFromLanding}
            onOpenSupport={() => setSupportOpen(true)}
            trialState={trialState}
          />
        )}

        {activeSection === AppSection.Builder && (
          <StudioBuilderView
            blocks={blocks}
            setBlocks={setBlocks}
            theme={theme}
            setTheme={setTheme}
            trialState={trialState}
            remainingFormatted={remainingFormatted}
            onStartTrial={handleOpenTrialFlow}
            onNavigate={handleNavigate}
            onOpenSupport={() => setSupportOpen(true)}
            onRecordPayment={handleRecordPayment}
          />
        )}

        {activeSection === AppSection.AnalyticsSeo && (
          <AnalyticsSeoView
            blocks={blocks}
            theme={theme}
            seoConfig={seoConfig}
            setSeoConfig={setSeoConfig}
            transactions={transactions}
          />
        )}

        {activeSection === AppSection.Pricing && (
          <SubscriptionCheckoutView
            trialState={trialState}
            remainingFormatted={remainingFormatted}
            onStartTrial={handleOpenTrialFlow}
            selectedPlanId={selectedPlanId}
            setSelectedPlanId={setSelectedPlanId}
            billingCycle={billingCycle}
            setBillingCycle={setBillingCycle}
            onCompleteSubscription={handleCompleteSubscription}
          />
        )}

        {activeSection === AppSection.Security && <SecurityView />}
      </div>

      <TrialRequestModal
        isOpen={trialModalOpen}
        onClose={() => setTrialModalOpen(false)}
        trialState={trialState}
        developerWaNumber={developerWaNumber}
        onSubmitRequest={handleSubmitTrialRequest}
        onConfirmByDeveloper={handleConfirmTrialByDeveloper}
      />

      <SupportDrawer
        isOpen={supportOpen}
        onClose={() => setSupportOpen(false)}
        theme={theme}
        developerWaNumber={developerWaNumber}
        onChangeDeveloperWaNumber={setDeveloperWaNumber}
        messages={supportMessages}
        onSendMessage={handleSendFeedback}
        revisions={revisions}
        onToggleRevisionStatus={handleToggleRevisionStatus}
        onDeleteRevision={handleDeleteRevision}
      />
    </div>
  );
}
