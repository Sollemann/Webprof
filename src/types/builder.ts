export enum AppSection {
  Landing = 'landing',
  Builder = 'builder',
  AnalyticsSeo = 'analytics_seo',
  Pricing = 'pricing',
  Security = 'security',
}

export enum BlockType {
  Hero = 'hero',
  ProductCatalog = 'product_catalog',
  PaymentCheckout = 'payment_checkout',
  Testimonials = 'testimonials',
  ContactForm = 'contact_form',
  Faq = 'faq',
}

export enum DeviceViewport {
  Desktop = 'desktop',
  Tablet = 'tablet',
  Mobile = 'mobile',
}

export enum PaymentMethodId {
  Qris = 'qris',
  VirtualAccount = 'virtual_account',
  EWallet = 'e_wallet',
  CreditCard = 'credit_card',
}

export enum SubscriptionTierId {
  Starter = 'starter',
  Pro = 'pro',
  Enterprise = 'enterprise',
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  priceIdr: number;
  imageUrl?: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  authorName: string;
  role: string;
  company: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SiteBlock {
  id: string;
  type: BlockType;
  title: string;
  subtitle: string;
  ctaText: string;
  align: 'left' | 'center';
  surface: 'light' | 'muted' | 'dark';
  imageUrl?: string;
  imageAlt?: string;
  products?: ProductItem[];
  paymentTitle?: string;
  paymentAmountIdr?: number;
  enabledPayments?: PaymentMethodId[];
  testimonials?: TestimonialItem[];
  faqs?: FaqItem[];
  contactEmail?: string;
}

export interface SiteThemeConfig {
  siteName: string;
  subdomain: string;
  accentColor: string;
  radiusMode: 'sharp' | 'medium' | 'rounded';
  typographyStyle: 'editorial' | 'modern';
}

export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  slug: string;
  canonicalDomain: string;
  ogTitle: string;
  schemaType: 'LocalBusiness' | 'Product' | 'Organization';
  robotsIndex: boolean;
  sitemapAuto: boolean;
}

export interface SubscriptionPlan {
  id: SubscriptionTierId;
  name: string;
  audience: string;
  monthlyPriceIdr: number;
  annualMonthlyPriceIdr: number;
  bandwidthLabel: string;
  storageLabel: string;
  transactionFeeLabel: string;
  teamSeats: string;
  highlights: string[];
  recommended?: boolean;
}

export interface TransactionRecord {
  id: string;
  timestamp: string;
  customerName: string;
  itemLabel: string;
  method: PaymentMethodId;
  amountIdr: number;
  status: 'Berhasil' | 'Menunggu' | 'Kadaluarsa';
}

export interface SecuritySetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  standard: string;
}

export interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  ipMasked: string;
  status: 'Terverifikasi' | 'Diblokir';
}

export interface SupportMessage {
  id: string;
  sender: 'user' | 'agent';
  author: string;
  text: string;
  time: string;
}

export interface FeedbackRevisionItem {
  id: string;
  area: string;
  note: string;
  status: 'Menunggu Developer' | 'Selesai';
  createdAt: string;
}

export interface TrialRequestData {
  fullName: string;
  businessName: string;
  whatsappNumber: string;
  websiteCategory: string;
  selectedFeatures: string[];
  submittedAt: string;
}

export interface TrialState {
  status: 'idle' | 'pending_developer' | 'active' | 'subscribed';
  isActive: boolean;
  startedAtMs: number | null;
  durationMs: number;
  subscribedPlanId: SubscriptionTierId | null;
  billingCycle: 'monthly' | 'annual';
  requestData: TrialRequestData | null;
}
