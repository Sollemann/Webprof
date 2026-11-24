import {useState} from 'react';
import {Menu, X} from 'lucide-react';
import {AppSection, TrialState} from '../types/builder';

interface HeaderProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
  onStartTrial: () => void;
  trialState: TrialState;
}

const NAV_ITEMS: Array<{id: AppSection; label: string}> = [
  {id: AppSection.Landing, label: 'Beranda'},
  {id: AppSection.Builder, label: 'Studio Builder'},
  {id: AppSection.AnalyticsSeo, label: 'Analitik & SEO'},
  {id: AppSection.Pricing, label: 'Paket & Bayar'},
  {id: AppSection.Security, label: 'Keamanan'},
];

export function Header({activeSection, onNavigate, onStartTrial, trialState}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryCtaLabel = trialState.subscribedPlanId
    ? 'Buka Studio'
    : trialState.status === 'active'
      ? 'Lanjut Paket'
      : trialState.status === 'pending_developer'
        ? 'Konfirmasi Uji Coba'
        : 'Coba Gratis 2 Hari';

  const handlePrimaryClick = () => {
    if (trialState.subscribedPlanId) {
      onNavigate(AppSection.Builder);
    } else if (trialState.status === 'active') {
      onNavigate(AppSection.Pricing);
    } else {
      onStartTrial();
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => {
            onNavigate(AppSection.Landing);
            setMobileMenuOpen(false);
          }}
          className="font-display text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
        >
          RakitWeb
        </button>

        <nav aria-label="Navigasi Utama" className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 ${
                  isActive
                    ? 'text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-blue-700"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrimaryClick}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            {primaryCtaLabel}
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={handlePrimaryClick}
            className="w-full mt-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors min-h-[44px]"
          >
            {primaryCtaLabel}
          </button>
        </div>
      )}
    </header>
  );
}
