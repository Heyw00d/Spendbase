import React, { useState, useEffect } from 'react';

// ============================================
// ARTEMIS REPORT DATA - Market Insights (Jan 2026)
// ============================================
const marketData = {
  totalVolume: '$18B',
  volumeGrowth: '106% CAGR',
  p2pVolume: '$19B',
  visaShare: '90%+',
  stablecoinSettlement: '$3.5B',
  stablecoinGrowth: '460% YoY',
  totalStablecoinSupply: '$308B'
};

// ============================================
// SPENDBASE CATEGORY SYSTEM (3-Tier)
// ============================================

// Category 1: Crypto-native cards (PRIMARY FOCUS)
// - Wallet-first or crypto-first
// - Often non-custodial or hybrid custody
// - Card is an interface to onchain funds
// - USDC / stablecoin led
// This is Spendbase's home turf - eligible for "Best crypto card" rankings

// Category 2: Neobanks with crypto features (INCLUDED, LABELED)
// - Bank or EMI first, crypto is a feature not the core
// - Often fully custodial, card spends fiat not directly onchain
// Labeled as: Bank-led · Custodial · Fiat-settled

// Category 3: Onchain / stablecoin accounts (THE FUTURE)
// - Stablecoin balances as primary account
// - Card abstracts away conversion
// - Often no traditional bank account, sometimes non-custodial
// Highlighted as "Next-gen stablecoin spending" - thought leadership territory

const spendbaseCategories = {
  cryptoNative: {
    label: 'Crypto-Native',
    color: 'lime',
    bgColor: 'bg-lime-500/20',
    textColor: 'text-lime-400',
    borderColor: 'border-lime-500/30',
    description: 'Wallet-first, onchain interface',
    badge: 'CRYPTO CARD',
    isPrimary: true
  },
  neobank: {
    label: 'Neobank + Crypto',
    color: 'blue',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    description: 'Bank-led · Custodial · Fiat-settled',
    badge: 'NEOBANK',
    isPrimary: false
  },
  stablecoinFirst: {
    label: 'Stablecoin-First',
    color: 'purple',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    description: 'Next-gen stablecoin spending',
    badge: 'NEXT-GEN',
    isPrimary: true
  }
};

// Strategic Archetypes (secondary classification)
const strategicArchetypes = {
  exchange: { label: 'Exchange Card', color: 'blue', description: 'User acquisition funnel' },
  wallet: { label: 'Wallet Card', color: 'orange', description: 'ARPU maximizer' },
  emerging: { label: 'Last-Mile Access', color: 'purple', description: 'Dollar access provider' },
  defi: { label: 'DeFi Protocol', color: 'cyan', description: 'TVL driver' },
  neobank: { label: 'Neobank', color: 'green', description: 'Full banking experience' }
};

// Geographic regions based on Artemis insights
const regions = {
  global: { label: 'Global', abbr: 'GLB' },
  americas: { label: 'Americas', abbr: 'AMR' },
  europe: { label: 'Europe', abbr: 'EU' },
  apac: { label: 'Asia-Pacific', abbr: 'APAC' },
  latam: { label: 'Latin America', abbr: 'LATAM' },
  india: { label: 'India', abbr: 'IN' },
  argentina: { label: 'Argentina', abbr: 'AR' }
};

// UTM Configuration for tracking
const UTM_SOURCE = 'spendbase';
const UTM_MEDIUM = 'aggregator';
const UTM_CAMPAIGN = 'card_apply';

// Helper function to add UTM params to URLs
const addUtmParams = (url, cardName) => {
  const separator = url.includes('?') ? '&' : '?';
  const utmContent = encodeURIComponent(cardName.toLowerCase().replace(/\s+/g, '_'));
  return `${url}${separator}utm_source=${UTM_SOURCE}&utm_medium=${UTM_MEDIUM}&utm_campaign=${UTM_CAMPAIGN}&utm_content=${utmContent}`;
};

// Official Network Logo URLs (SVG preferred for quality)
const networkLogos = {
  Visa: {
    light: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
    dark: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
    // Fallback to inline SVG if external fails
    fallbackColor: '#1A1F71'
  },
  Mastercard: {
    light: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
    dark: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
    fallbackColor: '#EB001B'
  }
};

// Supported currencies
const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'USDC', symbol: '$', name: 'USD Coin' },
  { code: 'USDT', symbol: '$', name: 'Tether' },
  { code: 'BTC', symbol: '₿', name: 'Bitcoin' },
  { code: 'ETH', symbol: 'Ξ', name: 'Ethereum' },
  { code: 'SOL', symbol: '◎', name: 'Solana' }
];

// Default ratings (simulated community ratings)
const defaultRatings = {
  1: { average: 4.5, count: 1250 },    // Revolut
  2: { average: 4.2, count: 856 },     // SoFi
  3: { average: 4.3, count: 2100 },    // Cash App
  4: { average: 3.9, count: 1800 },    // PayPal
  5: { average: 4.1, count: 920 },     // Robinhood
  6: { average: 4.0, count: 650 },     // N26
  7: { average: 3.8, count: 420 },     // Wirex
  8: { average: 4.4, count: 3200 },    // Nubank
  101: { average: 4.7, count: 380 },   // Ready
  102: { average: 4.6, count: 520 },   // KAST K Card
  1021: { average: 4.5, count: 180 },  // KAST X Card
  1022: { average: 4.8, count: 45 },   // KAST Founders
  103: { average: 4.3, count: 290 },   // Avici
  104: { average: 4.4, count: 410 },   // Gnosis Pay
  105: { average: 4.2, count: 890 },   // MetaMask Card
  106: { average: 4.6, count: 320 },   // Ether.fi Cash
  107: { average: 4.0, count: 4500 },  // Crypto.com
  108: { average: 4.1, count: 3800 },  // Coinbase
  109: { average: 4.3, count: 1200 },  // Nexo
  110: { average: 4.2, count: 580 },   // Plutus
  111: { average: 4.0, count: 210 },   // Holyheld
  112: { average: 4.5, count: 150 },   // Solflare
  113: { average: 3.9, count: 980 },   // Bybit
  114: { average: 4.4, count: 670 },   // Fold
  115: { average: 4.6, count: 1100 },  // Phantom Card
  116: { average: 3.7, count: 890 },   // Redotpay
  117: { average: 4.5, count: 280 },   // Bleap
  118: { average: 3.8, count: 340 },   // WhiteBIT Nova
  119: { average: 4.0, count: 560 },   // Uphold
  120: { average: 3.6, count: 720 },   // BitPay
  121: { average: 4.1, count: 2800 }   // Binance Card
};

// High-quality logo sources for crypto brands
// Using multiple CDN sources for reliability
const logoSources = {
  // Clearbit works well for traditional companies
  clearbit: (domain) => `https://logo.clearbit.com/${domain}`,
  // CryptoLogos.cc for crypto-specific brands (PNG)
  cryptoLogos: (symbol) => `https://cryptologos.cc/logos/${symbol}-logo.png`,
  // Alternative: use company's official CDN when available
};

// NEOBANK CARDS - Traditional Banking + Crypto Features (Category 2)
// Bank-led · Custodial · Fiat-settled - Adjacent, not competitors
const neobankCards = [
  {
    id: 1,
    name: 'Revolut',
    logoUrl: 'https://logo.clearbit.com/revolut.com',
    cardBg: 'from-gray-900 to-black',
    network: 'Mastercard',
    category: 'neobank',
    archetype: 'neobank',
    regions: ['europe', 'americas', 'apac', 'india'],
    custody: 'Custodial',
    blockchain: 'N/A',
    cryptoCount: '100+',
    cashback: '1%',
    cashbackToken: 'RevPoints',
    hasToken: false,
    annualFee: '$0',
    fxFee: '0%',
    atmFree: '$1,200/mo',
    mailingFee: 'Free',
    features: ['Crypto trading', 'Stock trading', 'Multi-currency', 'Staking'],
    perks: ['100+ cryptos', 'MiCA licensed', '65M users'],
    funding: '$1.7B+',
    users: '65M',
    affiliateUrl: 'https://www.revolut.com/referral/?referral-code=ONCHAIN2025',
    affiliateCode: 'ONCHAIN2025',
    twitterUrl: 'https://x.com/RevolutApp'
  },
  {
    id: 2,
    name: 'SoFi',
    logoUrl: 'https://logo.clearbit.com/sofi.com',
    cardBg: 'from-indigo-600 to-indigo-900',
    network: 'Visa',
    category: 'neobank',
    archetype: 'neobank',
    regions: ['americas'],
    custody: 'Custodial',
    blockchain: 'N/A',
    cryptoCount: '25+',
    cashback: '2%',
    cashbackToken: 'USD',
    hasToken: false,
    annualFee: '$0',
    fxFee: '0%',
    atmFree: '55k+ ATMs',
    mailingFee: 'Free',
    features: ['SoFiUSD stablecoin', 'Banking', 'Investing', 'Loans'],
    perks: ['First US bank w/ crypto', 'Own stablecoin', '4.3% APY'],
    funding: 'Public (SOFI)',
    users: '12.6M',
    affiliateUrl: 'https://www.sofi.com/credit-card/',
    affiliateCode: null,
    twitterUrl: 'https://x.com/SoFi'
  },
  {
    id: 3,
    name: 'Cash App',
    logoUrl: 'https://logo.clearbit.com/cash.app',
    cardBg: 'from-lime-400 to-green-500',
    network: 'Visa',
    category: 'neobank',
    archetype: 'neobank',
    regions: ['americas'],
    custody: 'Custodial',
    blockchain: 'Bitcoin',
    cryptoCount: 'BTC only',
    cashback: 'Boosts',
    cashbackToken: 'USD',
    hasToken: false,
    annualFee: '$0',
    fxFee: '3%',
    atmFree: 'Green status',
    mailingFee: 'Free',
    features: ['Bitcoin', 'Lightning Network', 'Stocks', 'Direct deposit'],
    perks: ['Bitcoin-first', 'Lightning payments', '57M users'],
    funding: 'Block Inc',
    users: '57M',
    affiliateUrl: 'https://cash.app/help/us/en-us/3080-cash-card-get-started',
    affiliateCode: null,
    twitterUrl: 'https://x.com/CashApp'
  },
  {
    id: 4,
    name: 'PayPal',
    logoUrl: 'https://logo.clearbit.com/paypal.com',
    cardBg: 'from-blue-600 to-blue-900',
    network: 'Mastercard',
    category: 'neobank',
    archetype: 'neobank',
    regions: ['global'],
    custody: 'Custodial',
    blockchain: 'Multi-chain',
    cryptoCount: '100+',
    cashback: '4% APY',
    cashbackToken: 'PYUSD',
    hasToken: true,
    tokenName: 'PYUSD',
    annualFee: '$0',
    fxFee: '0.99%',
    atmFree: 'Varies',
    mailingFee: 'Free',
    features: ['PYUSD stablecoin', '100+ cryptos', 'P2P transfers'],
    perks: ['Largest processor', 'Own stablecoin', '400M+ users'],
    funding: 'Public (PYPL)',
    users: '400M+',
    affiliateUrl: 'https://www.paypal.com/credit-application/paypal-credit-card/da/us/landing',
    affiliateCode: null,
    twitterUrl: 'https://x.com/PayPal'
  },
  {
    id: 5,
    name: 'Robinhood',
    logoUrl: 'https://logo.clearbit.com/robinhood.com',
    cardBg: 'from-green-500 to-emerald-700',
    network: 'Mastercard',
    category: 'neobank',
    archetype: 'exchange',
    regions: ['americas'],
    custody: 'Custodial',
    blockchain: 'Multi-chain',
    cryptoCount: '40+',
    cashback: 'N/A',
    cashbackToken: 'N/A',
    hasToken: false,
    annualFee: '$5/mo Gold',
    fxFee: '0%',
    atmFree: 'In-network',
    mailingFee: 'Free',
    features: ['ETH/SOL staking', 'Stocks', 'Options', 'Banking'],
    perks: ['First brokerage staking', '4% APY savings', '$2.5M FDIC'],
    funding: 'Public (HOOD)',
    users: '23M',
    affiliateUrl: 'https://robinhood.com/creditcard/',
    affiliateCode: null,
    twitterUrl: 'https://x.com/RobinhoodApp'
  },
  {
    id: 6,
    name: 'N26',
    logoUrl: 'https://logo.clearbit.com/n26.com',
    cardBg: 'from-teal-500 to-teal-700',
    network: 'Mastercard',
    category: 'neobank',
    archetype: 'neobank',
    regions: ['europe'],
    custody: 'Custodial',
    blockchain: 'Via Bitpanda',
    cryptoCount: '400+',
    cashback: '0.1%',
    cashbackToken: 'EUR',
    hasToken: false,
    annualFee: '$0-€16.90',
    fxFee: '0%',
    atmFree: '3-5 free/mo',
    mailingFee: 'Free',
    features: ['400+ cryptos', 'Spaces', 'Insurance', 'Investment plans'],
    perks: ['Full EU banking license', 'Bitpanda powered', '8M users'],
    funding: '$1.7B+',
    users: '8M',
    affiliateUrl: 'https://n26.com/en-eu/bank-account',
    affiliateCode: null,
    twitterUrl: 'https://x.com/n26'
  },
  {
    id: 7,
    name: 'Wirex',
    logoUrl: 'https://logo.clearbit.com/wirexapp.com',
    cardBg: 'from-orange-500 to-red-600',
    network: 'Visa',
    category: 'neobank',
    archetype: 'neobank',
    regions: ['europe', 'apac'],
    custody: 'Hybrid',
    blockchain: 'Multi-chain',
    cryptoCount: '685+',
    cashback: '0.5-8%',
    cashbackToken: 'WXT',
    hasToken: true,
    tokenName: 'WXT',
    annualFee: '$0-$29.99/mo',
    fxFee: '0%',
    atmFree: '$250/mo',
    mailingFee: '$9.99',
    features: ['0% crypto loans', 'X-Accounts', '25% APY', 'Base L2'],
    perks: ['685+ cryptos', '0% interest loans', 'Up to 8% cashback'],
    funding: '$50M+',
    users: '6M',
    affiliateUrl: 'https://wirexapp.com/r/ONCHAIN',
    affiliateCode: 'ONCHAIN',
    twitterUrl: 'https://x.com/wirexapp'
  },
  {
    id: 8,
    name: 'Nubank',
    logoUrl: 'https://logo.clearbit.com/nubank.com.br',
    cardBg: 'from-purple-600 to-purple-900',
    network: 'Mastercard',
    category: 'neobank',
    archetype: 'neobank',
    regions: ['latam', 'argentina'],
    custody: 'Custodial',
    blockchain: 'N/A',
    cryptoCount: '20+',
    cashback: '4% APY',
    cashbackToken: 'USDC',
    hasToken: false,
    annualFee: '$0',
    fxFee: 'Varies',
    atmFree: 'Brazil network',
    mailingFee: 'Free',
    features: ['Crypto trading', 'USDC rewards', 'Stablecoin payments'],
    perks: ['Largest LatAm bank', '100M+ users', '4% USDC yield'],
    funding: 'Public (NU)',
    users: '100M+',
    affiliateUrl: 'https://nubank.com.br/cartao-de-credito/',
    affiliateCode: null,
    twitterUrl: 'https://x.com/nubank'
  }
];

// CRYPTO-NATIVE CARDS (Category 1) - PRIMARY FOCUS
// Wallet-first, onchain interface, eligible for "Best crypto card" rankings
const onchainCards = [
  {
    id: 101,
    name: 'Ready',
    logoUrl: 'https://logo.clearbit.com/ready.co',
    cardBg: 'from-violet-600 to-purple-900',
    network: 'Mastercard',
    category: 'cryptoNative',
    archetype: 'emerging',
    regions: ['global', 'latam', 'india'],
    custody: 'Self-Custody',
    blockchain: 'Starknet',
    cryptoCount: 'USDC',
    cashback: '0.5-3%',
    cashbackToken: 'STRK',
    hasToken: false,
    annualFee: '$0 / $120',
    fxFee: '0%',
    atmFree: '$200-800/mo',
    mailingFee: '$10',
    features: ['Account Abstraction', 'Zero FX', 'ZK proofs', 'DeFi native'],
    perks: ['True self-custody', 'Best conversion rate', '$56M funding'],
    funding: '$56M',
    users: 'Growing',
    affiliateUrl: 'https://ready.co/download-ready',
    affiliateCode: 'TELUGU',
    twitterUrl: 'https://x.com/ready_co'
  },
  // KAST - Multi-tier cards (Stablecoin-First Category)
  {
    id: 102,
    name: 'KAST K Card',
    tier: 'Standard',
    logoUrl: 'https://pbs.twimg.com/profile_images/1869032741351448576/LRJ3GHIJ_400x400.jpg',
    fallbackLogoUrl: 'https://logo.clearbit.com/kast.xyz',
    cardBg: 'from-purple-600 to-pink-600',
    network: 'Visa',
    category: 'stablecoinFirst',
    archetype: 'emerging',
    regions: ['global', 'latam', 'argentina'],
    custody: 'Custodial',
    blockchain: 'Solana',
    cryptoCount: 'USDC/USDT/USDe',
    cashback: '2-6%',
    cashbackToken: 'KAST Points',
    hasToken: true,
    tokenName: 'KAST',
    annualFee: '$20/year',
    fxFee: '0%',
    atmFree: 'Unlimited',
    mailingFee: '$20',
    features: ['Virtual card free', 'Stablecoin native', 'No conversion fee', 'ACH/Wire'],
    perks: ['160+ countries', 'Season 5 rewards', 'Token Q2 2026'],
    funding: 'Private',
    users: 'Growing',
    affiliateUrl: 'https://kast.xyz',
    affiliateCode: null,
    twitterUrl: 'https://x.com/KAST_official',
    cardGifUrl: 'https://x.com/i/status/2009632452395126887'
  },
  {
    id: 1021,
    name: 'KAST X Card',
    tier: 'Premium',
    logoUrl: 'https://pbs.twimg.com/profile_images/1869032741351448576/LRJ3GHIJ_400x400.jpg',
    fallbackLogoUrl: 'https://logo.clearbit.com/kast.xyz',
    cardBg: 'from-pink-600 to-rose-700',
    network: 'Visa',
    category: 'stablecoinFirst',
    archetype: 'emerging',
    regions: ['global', 'latam', 'argentina'],
    custody: 'Custodial',
    blockchain: 'Solana',
    cryptoCount: 'USDC/USDT/USDe',
    cashback: '5-12%',
    cashbackToken: 'KAST Points',
    hasToken: true,
    tokenName: 'KAST',
    annualFee: '$1,000/year',
    fxFee: '0%',
    atmFree: 'Unlimited',
    mailingFee: 'Included',
    features: ['Premium metal card', 'Higher limits', 'Priority support', 'Exclusive perks'],
    perks: ['Up to 12% rewards', 'Unlimited transactions', 'VIP access'],
    funding: 'Private',
    users: 'Growing',
    affiliateUrl: 'https://kast.xyz',
    affiliateCode: null,
    twitterUrl: 'https://x.com/KAST_official',
    cardGifUrl: 'https://x.com/i/status/2009632452395126887'
  },
  {
    id: 1022,
    name: 'KAST Founders',
    tier: 'Elite',
    logoUrl: 'https://pbs.twimg.com/profile_images/1869032741351448576/LRJ3GHIJ_400x400.jpg',
    fallbackLogoUrl: 'https://logo.clearbit.com/kast.xyz',
    cardBg: 'from-amber-500 to-yellow-600',
    network: 'Visa',
    category: 'stablecoinFirst',
    archetype: 'emerging',
    regions: ['global', 'latam', 'argentina'],
    custody: 'Custodial',
    blockchain: 'Solana',
    cryptoCount: 'USDC/USDT/USDe',
    cashback: 'Up to 15%',
    cashbackToken: 'KAST Points',
    hasToken: true,
    tokenName: 'KAST',
    annualFee: '$10,000 one-time',
    fxFee: '0%',
    atmFree: 'Unlimited',
    mailingFee: 'Included',
    features: ['Exclusive founders edition', 'Lifetime benefits', 'Max rewards', 'Concierge'],
    perks: ['Up to 15% rewards', 'Free replacements', 'Max SOL staking'],
    funding: 'Private',
    users: 'Limited Edition',
    affiliateUrl: 'https://kast.xyz',
    affiliateCode: null,
    twitterUrl: 'https://x.com/KAST_official',
    cardGifUrl: 'https://x.com/i/status/2009632452395126887'
  },
  {
    id: 103,
    name: 'Avici',
    logoUrl: 'https://logo.clearbit.com/avici.money',
    cardBg: 'from-cyan-500 to-blue-700',
    network: 'Visa',
    category: 'cryptoNative',
    archetype: 'wallet',
    regions: ['global'],
    custody: 'Self-Custody',
    blockchain: 'Solana',
    cryptoCount: 'USDC/SOL/ETH',
    cashback: '1.5-2%',
    cashbackToken: 'AVICI',
    hasToken: true,
    tokenName: 'AVICI',
    annualFee: '$0',
    fxFee: '0-3%',
    atmFree: '$1 + 0.65%',
    mailingFee: '$15',
    features: ['Smart wallet', 'Passkey login', 'USD/EUR accounts', '0% APR'],
    perks: ['Self-custody Solana', 'AVICI token live', 'Gas sponsored'],
    funding: 'MetaDAO',
    users: '4,000+ MAU',
    affiliateUrl: 'https://avici.money',
    affiliateCode: null,
    twitterUrl: 'https://x.com/AviciMoney'
  },
  {
    id: 104,
    name: 'Gnosis Pay',
    logoUrl: 'https://raw.githubusercontent.com/gnosis/gnosis-media-kit/main/Gnosis/Gnosis%20Logo/RGB/gnosis-logo-symbol.svg',
    fallbackLogoUrl: 'https://logo.clearbit.com/gnosispay.com',
    cardBg: 'from-emerald-600 to-green-800',
    network: 'Visa',
    category: 'cryptoNative',
    archetype: 'defi',
    regions: ['europe'],
    custody: 'Self-Custody',
    blockchain: 'Gnosis Chain',
    cryptoCount: 'EURe/GBPe/USDCe',
    cashback: '1-5%',
    cashbackToken: 'GNO',
    hasToken: true,
    tokenName: 'GNO',
    annualFee: '€30 issuance',
    fxFee: '~1.5%',
    atmFree: '5 free/mo',
    mailingFee: '€30',
    features: ['Safe wallet', 'SEPA/IBAN', 'Multi-sig', 'Tiered cashback'],
    perks: ['First self-custody Visa', 'Need 10+ GNO for profit', 'Weekly airdrop'],
    funding: 'Gnosis',
    users: 'Growing',
    affiliateUrl: 'https://gnosispay.com',
    affiliateCode: null,
    twitterUrl: 'https://x.com/gnosispay'
  },
  {
    id: 105,
    name: 'MetaMask Card',
    logoUrl: 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg',
    fallbackLogoUrl: 'https://logo.clearbit.com/metamask.io',
    cardBg: 'from-orange-500 to-amber-700',
    network: 'Mastercard',
    category: 'cryptoNative',
    archetype: 'wallet',
    regions: ['global', 'americas', 'europe'],
    custody: 'Self-Custody',
    blockchain: 'Linea/Base',
    cryptoCount: 'USDC/USDT/wETH',
    cashback: '1%',
    cashbackToken: 'USDC',
    hasToken: false,
    annualFee: '$0 / $199',
    fxFee: '0%',
    atmFree: 'Varies',
    mailingFee: '$199 metal',
    features: ['Direct wallet spend', 'Smart contracts', 'Linea L2', 'Metal card'],
    perks: ['Largest wallet base', '<5 sec transactions', '$0.01 fees'],
    funding: 'Consensys',
    users: '30M+ wallet',
    affiliateUrl: 'https://metamask.io/card',
    affiliateCode: null,
    twitterUrl: 'https://x.com/MetaMask'
  },
  {
    id: 106,
    name: 'Ether.fi Cash',
    logoUrl: 'https://logo.clearbit.com/ether.fi',
    cardBg: 'from-blue-600 to-indigo-800',
    network: 'Visa',
    category: 'cryptoNative',
    archetype: 'defi',
    regions: ['global', 'americas', 'europe'],
    custody: 'Self-Custody',
    blockchain: 'Scroll',
    cryptoCount: 'ETH/BTC/USDC',
    cashback: '4.08%',
    cashbackToken: 'SCR',
    hasToken: true,
    tokenName: 'ETHFI',
    annualFee: '$0',
    fxFee: '0%',
    atmFree: 'Varies',
    mailingFee: 'Free',
    features: ['Borrow vs stake', 'DeFi credit', 'Liquid vaults', 'No selling'],
    perks: ['#1 ranked 2025', '$9.7B TVL backing', 'Buy now pay never'],
    funding: '$32M+',
    users: '80K+ txns',
    affiliateUrl: 'https://ether.fi/cash',
    affiliateCode: null,
    twitterUrl: 'https://x.com/ether_fi'
  },
  {
    id: 107,
    name: 'Crypto.com',
    logoUrl: 'https://crypto.com/price/coin-data/icon/CRO/color_icon.png',
    fallbackLogoUrl: 'https://logo.clearbit.com/crypto.com',
    cardBg: 'from-gray-800 to-black',
    network: 'Visa',
    category: 'cryptoNative',
    archetype: 'exchange',
    regions: ['global'],
    custody: 'Custodial',
    blockchain: 'Cronos',
    cryptoCount: '400+',
    cashback: '1-8%',
    cashbackToken: 'CRO',
    hasToken: true,
    tokenName: 'CRO',
    annualFee: '$0-$4.99/mo',
    fxFee: '0%',
    atmFree: 'Tier based',
    mailingFee: '$50',
    features: ['Level Up program', 'DeFi wallet', 'NFTs', 'Exchange'],
    perks: ['100M+ users', '400+ cryptos', 'Up to 8% CRO'],
    funding: '$1B+',
    users: '100M+',
    affiliateUrl: 'https://crypto.com/app',
    affiliateCode: 'ONCHAIN25',
    twitterUrl: 'https://x.com/cryptocom'
  },
  {
    id: 108,
    name: 'Coinbase',
    logoUrl: 'https://images.ctfassets.net/c5bd0wqjc7v0/7bTMi38xHNMlzGDLfWj4h2/7e30e8b50dbf8d7a4714f6f1f2b5a9b7/coinbase-logo.svg',
    fallbackLogoUrl: 'https://logo.clearbit.com/coinbase.com',
    cardBg: 'from-blue-500 to-blue-800',
    network: 'Visa',
    category: 'cryptoNative',
    archetype: 'exchange',
    regions: ['americas'],
    custody: 'Custodial',
    blockchain: 'Base',
    cryptoCount: '100+',
    cashback: '1-4%',
    cashbackToken: 'BTC/ETH/DOGE',
    hasToken: false,
    annualFee: '$0',
    fxFee: '2.49%',
    atmFree: 'No CB fee',
    mailingFee: 'Free',
    features: ['Choose reward crypto', 'Coinbase One Amex', 'Base L2', 'Staking'],
    perks: ['Largest US exchange', 'Public company', '4% in GRT/XLM'],
    funding: 'Public (COIN)',
    users: '100M+',
    affiliateUrl: 'https://coinbase.com/join',
    affiliateCode: null,
    twitterUrl: 'https://x.com/coinbase'
  },
  {
    id: 109,
    name: 'Nexo',
    logoUrl: 'https://logo.clearbit.com/nexo.com',
    cardBg: 'from-cyan-600 to-cyan-900',
    network: 'Mastercard',
    category: 'cryptoNative',
    archetype: 'defi',
    regions: ['global', 'europe'],
    custody: 'Custodial',
    blockchain: 'Multi-chain',
    cryptoCount: '1,500+ pairs',
    cashback: '0.5-2%',
    cashbackToken: 'NEXO',
    hasToken: true,
    tokenName: 'NEXO',
    annualFee: '$0',
    fxFee: '0-0.5%',
    atmFree: '€200-2,000/mo',
    mailingFee: 'Free',
    features: ['Credit + Debit mode', 'Crypto loans', 'Up to 14% APY', 'Futures'],
    perks: ['Dual card modes', 'Borrow @ 2.9%', '$11B+ AUM'],
    funding: '$52M',
    users: '7M+',
    affiliateUrl: 'https://nexo.com/ref',
    affiliateCode: 'ONCHAIN',
    twitterUrl: 'https://x.com/Nexo'
  },
  {
    id: 110,
    name: 'Plutus',
    logoUrl: 'https://logo.clearbit.com/plutus.it',
    cardBg: 'from-gray-700 to-gray-950',
    network: 'Visa',
    category: 'cryptoNative',
    archetype: 'defi',
    regions: ['europe'],
    custody: 'Self-Custody',
    blockchain: 'Base',
    cryptoCount: 'PLU',
    cashback: '3-9%',
    cashbackToken: 'PLU',
    hasToken: true,
    tokenName: 'PLU',
    annualFee: '$0-€14.99/mo',
    fxFee: '0%',
    atmFree: 'Varies',
    mailingFee: '€14.99',
    features: ['DeFi card', 'PLU staking', '50+ perks', 'On-chain rewards'],
    perks: ['True DeFi card', 'Up to 9% PLU', 'Netflix/Spotify perks'],
    funding: 'Private',
    users: 'Growing',
    affiliateUrl: 'https://plutus.it/ref',
    affiliateCode: null,
    twitterUrl: 'https://x.com/paborhood'
  },
  {
    id: 111,
    name: 'Holyheld',
    logoUrl: 'https://logo.clearbit.com/holyheld.com',
    cardBg: 'from-amber-500 to-orange-700',
    network: 'Mastercard',
    category: 'cryptoNative',
    archetype: 'emerging',
    regions: ['europe'],
    custody: 'Self-Custody',
    blockchain: '14 chains',
    cryptoCount: '1,200+',
    cashback: '0.5-1%',
    cashbackToken: 'USDC',
    hasToken: false,
    annualFee: '€29-€199',
    fxFee: '2.5%',
    atmFree: '2.5% fee',
    mailingFee: '€29-€199',
    features: ['Zero gas fees', 'Personal IBAN', 'SEPA', 'Multi-chain'],
    perks: ['Gas subsidized', '14 chains supported', 'Metal €199'],
    funding: 'Toyota Ventures',
    users: 'Growing',
    affiliateUrl: 'https://holyheld.com',
    affiliateCode: null,
    twitterUrl: 'https://x.com/holyheld'
  },
  {
    id: 112,
    name: 'Solflare',
    logoUrl: 'https://logo.clearbit.com/solflare.com',
    cardBg: 'from-orange-400 to-yellow-600',
    network: 'Mastercard',
    category: 'cryptoNative',
    archetype: 'wallet',
    regions: ['global'],
    custody: 'Self-Custody',
    blockchain: 'Solana',
    cryptoCount: 'USDC',
    cashback: 'TBD',
    cashbackToken: 'TBD',
    hasToken: false,
    annualFee: 'TBD',
    fxFee: '0%',
    atmFree: 'TBD',
    mailingFee: 'TBD',
    features: ['First Solana self-custody', '3FA security', 'No top-ups', 'Google Pay'],
    perks: ['True self-custody', 'Solana native', '115K+ waitlist'],
    funding: 'Private',
    users: '115K waitlist',
    affiliateUrl: 'https://solflare.com/crypto-card',
    affiliateCode: null,
    twitterUrl: 'https://x.com/solflare_wallet'
  },
  {
    id: 113,
    name: 'Bybit',
    logoUrl: 'https://logo.clearbit.com/bybit.com',
    cardBg: 'from-yellow-500 to-amber-700',
    network: 'Mastercard',
    category: 'cryptoNative',
    archetype: 'exchange',
    regions: ['europe', 'apac'],
    custody: 'Custodial',
    blockchain: 'Exchange',
    cryptoCount: '10+',
    cashback: '2-10%',
    cashbackToken: 'USDT',
    hasToken: false,
    annualFee: '€10',
    fxFee: '0.9%',
    atmFree: '€100/mo',
    mailingFee: '€10',
    features: ['VIP rebates', 'Up to 8% APY', 'Netflix/Spotify', '100% sub rebates'],
    perks: ['Up to 10% cashback', 'Full sub rebates', '2M+ cards'],
    funding: 'Private',
    users: '2M+ cards',
    affiliateUrl: 'https://bybit.com/card',
    affiliateCode: null,
    twitterUrl: 'https://x.com/Bybit_Official'
  },
  {
    id: 114,
    name: 'Fold',
    logoUrl: 'https://logo.clearbit.com/foldapp.com',
    cardBg: 'from-orange-600 to-red-700',
    network: 'Visa',
    category: 'cryptoNative',
    archetype: 'neobank',
    regions: ['americas'],
    custody: 'Custodial',
    blockchain: 'Bitcoin',
    cryptoCount: 'BTC only',
    cashback: 'Up to 15%',
    cashbackToken: 'BTC/Sats',
    hasToken: false,
    annualFee: '$0 / $100',
    fxFee: '0%',
    atmFree: 'Fold+ free',
    mailingFee: 'Free',
    features: ['Bitcoin rewards', 'Spin wheel', 'Boosts', 'Round-ups'],
    perks: ['First BTC on NASDAQ', 'Win up to 1 BTC', 'Bitcoin only'],
    funding: 'Public (FLD)',
    users: 'Growing',
    affiliateUrl: 'https://foldapp.com',
    affiliateCode: null,
    twitterUrl: 'https://x.com/fold_app'
  },
  {
    id: 115,
    name: 'Phantom Card',
    logoUrl: 'https://phantom.app/img/phantom-logo.svg',
    fallbackLogoUrl: 'https://logo.clearbit.com/phantom.app',
    cardBg: 'from-purple-700 to-indigo-900',
    network: 'Visa',
    category: 'cryptoNative',
    archetype: 'wallet',
    regions: ['americas', 'global'],
    custody: 'Self-Custody',
    blockchain: 'Solana',
    cryptoCount: 'CASH/USDC/SOL',
    cashback: '2%',
    cashbackToken: 'CASH',
    hasToken: false,
    annualFee: '$0',
    fxFee: '0%',
    atmFree: 'Varies',
    mailingFee: 'Free',
    features: ['$CASH stablecoin', 'Self-custody', 'Solana native', 'Wallet integrated'],
    perks: ['$100M CASH supply', 'Growing steadily', 'Native stablecoin'],
    funding: 'Private',
    users: 'Growing',
    affiliateUrl: 'https://phantom.app',
    affiliateCode: null,
    twitterUrl: 'https://x.com/phantom'
  },
  {
    id: 116,
    name: 'Redotpay',
    logoUrl: 'https://logo.clearbit.com/redotpay.com',
    cardBg: 'from-red-600 to-rose-800',
    network: 'Visa',
    category: 'cryptoNative',
    archetype: 'emerging',
    regions: ['apac', 'global', 'latam'],
    custody: 'Custodial',
    blockchain: 'Multi-chain',
    cryptoCount: 'USDT/USDC/BTC',
    cashback: '1%',
    cashbackToken: 'USD',
    hasToken: false,
    annualFee: '$0',
    fxFee: '1.2%',
    atmFree: 'With fees',
    mailingFee: '$5',
    features: ['Credit lines', '1M+ users', 'Global reach', 'USDT focus'],
    perks: ['Emerging market leader', 'USDT-friendly', 'Low barriers'],
    funding: 'Private',
    users: '1M+',
    affiliateUrl: 'https://redotpay.com',
    affiliateCode: null,
    twitterUrl: 'https://x.com/RedotPay'
  },
  {
    id: 117,
    name: 'Bleap',
    logoUrl: 'https://logo.clearbit.com/bleap.finance',
    cardBg: 'from-indigo-500 to-purple-700',
    network: 'Mastercard',
    category: 'cryptoNative',
    archetype: 'wallet',
    regions: ['europe', 'global'],
    custody: 'Self-Custody',
    blockchain: 'Multi-chain',
    cryptoCount: 'BTC/ETH/SOL/USDC',
    cashback: '2%',
    cashbackToken: 'USDC',
    hasToken: false,
    annualFee: '$0',
    fxFee: '0%',
    atmFree: '€400/mo',
    mailingFee: 'Free',
    features: ['Non-custodial MPC', 'Apple Pay', 'Zero fees', 'Metal coming'],
    perks: ['2% real cashback', 'No FX fees', '100% non-custodial'],
    funding: 'Private',
    users: 'Growing',
    affiliateUrl: 'https://bleap.finance',
    affiliateCode: null,
    twitterUrl: 'https://x.com/BleapApp'
  },
  {
    id: 118,
    name: 'WhiteBIT Nova',
    logoUrl: 'https://logo.clearbit.com/whitebit.com',
    cardBg: 'from-green-500 to-teal-700',
    network: 'Visa',
    category: 'cryptoNative',
    archetype: 'exchange',
    regions: ['europe', 'global'],
    custody: 'Custodial',
    blockchain: 'Exchange',
    cryptoCount: 'BTC/ETH/USDC/SOL',
    cashback: 'Up to 10%',
    cashbackToken: 'BTC',
    hasToken: true,
    tokenName: 'WBT',
    annualFee: '$0',
    fxFee: 'Varies',
    atmFree: 'With fees',
    mailingFee: 'Free virtual',
    features: ['Choose cashback category', 'Instant BTC rewards', '11 cryptos', 'Apple/Google Pay'],
    perks: ['Up to 10% cashback', 'Max €25/purchase', 'Free virtual card'],
    funding: 'Private',
    users: 'Growing',
    affiliateUrl: 'https://whitebit.com/card',
    affiliateCode: null,
    twitterUrl: 'https://x.com/WhiteBit'
  },
  {
    id: 119,
    name: 'Uphold',
    logoUrl: 'https://logo.clearbit.com/uphold.com',
    cardBg: 'from-green-600 to-emerald-800',
    network: 'Visa',
    category: 'cryptoNative',
    archetype: 'exchange',
    regions: ['americas'],
    custody: 'Custodial',
    blockchain: 'Multi-chain',
    cryptoCount: '250+',
    cashback: '2-4%',
    cashbackToken: 'XRP',
    hasToken: false,
    annualFee: '$0',
    fxFee: 'Varies',
    atmFree: 'With fees',
    mailingFee: 'Free',
    features: ['Spend from balances', 'XRP rewards', '250+ assets', 'Staking'],
    perks: ['4% first 90 days', '2% after', 'US only'],
    funding: 'Private',
    users: '10M+',
    affiliateUrl: 'https://uphold.com/card',
    affiliateCode: null,
    twitterUrl: 'https://x.com/UpholdInc'
  },
  {
    id: 120,
    name: 'BitPay',
    logoUrl: 'https://logo.clearbit.com/bitpay.com',
    cardBg: 'from-blue-800 to-indigo-950',
    network: 'Mastercard',
    category: 'cryptoNative',
    archetype: 'wallet',
    regions: ['americas'],
    custody: 'Custodial',
    blockchain: 'Multi-chain',
    cryptoCount: '15+',
    cashback: '0%',
    cashbackToken: 'N/A',
    hasToken: false,
    annualFee: '$0',
    fxFee: '2% + $0.25',
    atmFree: '$2.50/txn',
    mailingFee: '$10',
    features: ['Instant reload', 'Apple Pay', 'Google Pay', 'Samsung Pay'],
    perks: ['OG crypto card', 'Wide crypto support', 'US only'],
    funding: 'Private',
    users: '1M+',
    affiliateUrl: 'https://bitpay.com/card',
    affiliateCode: null,
    twitterUrl: 'https://x.com/BitPay'
  },
  {
    id: 121,
    name: 'Binance Card',
    logoUrl: 'https://public.bnbstatic.com/image/cms/blog/20230220/6e52e589-5c12-441e-91e3-1a11ed6e6f20.png',
    fallbackLogoUrl: 'https://logo.clearbit.com/binance.com',
    cardBg: 'from-yellow-500 to-amber-600',
    network: 'Visa',
    category: 'cryptoNative',
    archetype: 'exchange',
    regions: ['europe', 'apac', 'latam'],
    custody: 'Custodial',
    blockchain: 'BNB Chain',
    cryptoCount: '15+',
    cashback: 'Up to 8%',
    cashbackToken: 'BNB',
    hasToken: true,
    tokenName: 'BNB',
    annualFee: '$0',
    fxFee: '0.9%',
    atmFree: 'With fees',
    mailingFee: 'Free',
    features: ['Auto-convert', 'Real-time conversion', 'BNB staking rewards', 'Global'],
    perks: ['8% with 600 BNB', 'No issuance fee', 'Largest exchange'],
    funding: 'Binance',
    users: '200M+',
    affiliateUrl: 'https://binance.com/card',
    affiliateCode: null,
    twitterUrl: 'https://x.com/binance'
  }
];

const allCards = [...neobankCards, ...onchainCards];

// Updated filter categories for 3-tier system
const categoryFilters = ['All Cards', 'Crypto-Native', 'Stablecoin-First', 'Neobank + Crypto'];
const custodyFilters = ['All Custody', 'Self-Custody', 'Custodial'];
const networkFilters = ['All Networks', 'Visa', 'Mastercard'];
const regionFilters = ['All Regions', 'Americas', 'Europe', 'Asia-Pacific', 'Latin America', 'India', 'Argentina', 'Global'];
const archetypeFilters = ['All Types', 'Exchange', 'Wallet', 'DeFi', 'Neobank', 'Last-Mile'];
const tokenFilters = ['All Tokens', 'Own Token', 'No Token'];

// Map filter values to data values
const regionMap = {
  'Americas': 'americas',
  'Europe': 'europe',
  'Asia-Pacific': 'apac',
  'Latin America': 'latam',
  'India': 'india',
  'Argentina': 'argentina',
  'Global': 'global'
};

const archetypeMap = {
  'Exchange': 'exchange',
  'Wallet': 'wallet',
  'DeFi': 'defi',
  'Neobank': 'neobank',
  'Last-Mile': 'emerging'
};

// X/Twitter Icon Component
function TwitterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

// Network Logo Component (Visa/Mastercard) - Official SVG logos
// variant: 'color' (default, colored), 'white' (white/transparent for dark backgrounds)
function NetworkLogo({ network, size = 'md', variant = 'color' }) {
  const sizeClasses = size === 'lg' ? 'h-6' : size === 'sm' ? 'h-4' : 'h-5';
  const widthClasses = size === 'lg' ? 'w-14' : size === 'sm' ? 'w-10' : 'w-12';

  const isWhite = variant === 'white';

  // Official Visa logo
  if (network === 'Visa') {
    const fillColor = isWhite ? 'rgba(255,255,255,0.9)' : '#1A1F71';
    const accentColor = isWhite ? 'rgba(255,255,255,0.7)' : '#F9A533';
    return (
      <svg className={`${sizeClasses} ${widthClasses}`} viewBox="0 0 750 471" fill="none">
        <path d="M278.198 334.228L311.556 138.464H364.058L330.7 334.228H278.198Z" fill={fillColor}/>
        <path d="M524.307 142.687C513.105 138.878 495.197 134.65 472.988 134.65C421.202 134.65 384.812 162.234 384.541 201.915C384.007 231.442 411.325 247.925 431.642 257.863C452.502 268.062 459.604 274.605 459.604 283.586C459.339 297.295 443.001 303.57 427.729 303.57C406.347 303.57 394.875 300.34 377.176 292.523L370.079 289.167L362.451 332.398C375.039 338.096 398.858 343.123 423.473 343.388C478.513 343.388 514.108 316.225 514.639 273.948C514.904 250.623 500.226 232.596 469.363 217.677C450.635 207.739 439.169 201.196 439.169 191.416C439.434 182.435 449.308 173.189 471.251 173.189C489.42 172.924 502.761 176.464 513.105 180.273L518.339 182.7L526.172 140.676L524.307 142.687Z" fill={fillColor}/>
        <path d="M661.615 138.464H622.168C609.584 138.464 600.244 142.008 594.744 155.182L517.528 334.228H572.569L583.776 303.841L650.143 303.841C651.743 311.923 657.245 334.228 657.245 334.228H706.215L661.615 138.464ZM599.177 263.877C603.084 253.409 619.687 210.074 619.687 210.074C619.422 210.603 623.593 199.606 626.169 192.799L629.289 208.487C629.289 208.487 639.425 255.561 641.563 263.877H599.177Z" fill={fillColor}/>
        <path d="M232.903 138.464L181.383 267.157L175.883 240.252C166.543 208.752 137.621 174.514 105.16 157.561L151.899 333.963H207.469L288.473 138.464H232.903Z" fill={fillColor}/>
        <path d="M131.92 138.464H47.9352L47.1377 142.802C113.24 159.715 157.577 199.343 175.883 240.257L157.048 155.452C153.672 142.543 144.334 138.999 131.92 138.464Z" fill={accentColor}/>
      </svg>
    );
  }

  // Official Mastercard logo (interlocking circles)
  if (network === 'Mastercard') {
    if (isWhite) {
      // White/transparent version - just the circles with white tint
      return (
        <svg className={`${sizeClasses} ${widthClasses}`} viewBox="0 0 152 100" fill="none">
          <circle cx="50" cy="50" r="50" fill="rgba(255,255,255,0.8)"/>
          <circle cx="102" cy="50" r="50" fill="rgba(255,255,255,0.6)"/>
          <path d="M76 16.6C67.8 23.5 62 33.5 60.3 45H91.7C90 33.5 84.2 23.5 76 16.6Z" fill="rgba(255,255,255,0.9)"/>
          <path d="M76 83.4C84.2 76.5 90 66.5 91.7 55H60.3C62 66.5 67.8 76.5 76 83.4Z" fill="rgba(255,255,255,0.9)"/>
        </svg>
      );
    }
    return (
      <svg className={`${sizeClasses} ${widthClasses}`} viewBox="0 0 152 100" fill="none">
        <circle cx="50" cy="50" r="50" fill="#EB001B"/>
        <circle cx="102" cy="50" r="50" fill="#F79E1B"/>
        <path d="M76 16.6C67.8 23.5 62 33.5 60.3 45H91.7C90 33.5 84.2 23.5 76 16.6Z" fill="#FF5F00"/>
        <path d="M76 83.4C84.2 76.5 90 66.5 91.7 55H60.3C62 66.5 67.8 76.5 76 83.4Z" fill="#FF5F00"/>
      </svg>
    );
  }

  // Fallback text
  return <span className={`text-xs font-medium ${isWhite ? 'text-white/80' : ''}`}>{network}</span>;
}

// Star Rating Component
function StarRating({ rating, onRate, size = 'md', showCount = false, count = 0, interactive = true }) {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClasses = size === 'lg' ? 'w-6 h-6' : size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  const renderStar = (index) => {
    const filled = hoverRating > 0 ? index <= hoverRating : index <= rating;
    const halfFilled = !filled && index - 0.5 <= rating && index > rating;

    return (
      <button
        key={index}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (interactive && onRate) onRate(index);
        }}
        onMouseEnter={() => interactive && setHoverRating(index)}
        onMouseLeave={() => setHoverRating(0)}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        disabled={!interactive}
      >
        <svg className={sizeClasses} viewBox="0 0 24 24" fill="none">
          {halfFilled ? (
            <>
              <defs>
                <linearGradient id={`half-${index}`}>
                  <stop offset="50%" stopColor="#FBBF24" />
                  <stop offset="50%" stopColor="#374151" />
                </linearGradient>
              </defs>
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={`url(#half-${index})`}
                stroke="#FBBF24"
                strokeWidth="1"
              />
            </>
          ) : (
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={filled ? '#FBBF24' : '#374151'}
              stroke={filled ? '#FBBF24' : '#4B5563'}
              strokeWidth="1"
            />
          )}
        </svg>
      </button>
    );
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(renderStar)}
      </div>
      {showCount && (
        <span className="text-gray-400 text-xs ml-1">
          {rating.toFixed(1)} ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}

// Compact Star Display (non-interactive)
function StarDisplay({ rating, count }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className="w-3 h-3" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={star <= rating ? '#FBBF24' : star - 0.5 <= rating ? '#FBBF24' : '#374151'}
              stroke={star <= rating ? '#FBBF24' : '#4B5563'}
              strokeWidth="1"
            />
          </svg>
        ))}
      </div>
      <span className="text-gray-400 text-[10px]">{rating.toFixed(1)}</span>
    </div>
  );
}

// Card Logo Component - handles both URL and fallback with multiple sources
function CardLogo({ card, size = 'md' }) {
  const [logoIndex, setLogoIndex] = useState(0);
  const sizeClasses = size === 'lg' ? 'w-8 h-8' : size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';

  // Build array of logo URLs to try (primary + fallbacks)
  const logoUrls = [card.logoUrl];

  // Add fallback URLs for crypto-specific brands
  if (card.fallbackLogoUrl) {
    logoUrls.push(card.fallbackLogoUrl);
  }

  // Fallback to initials when all logos fail
  const getInitials = (name) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  const handleError = () => {
    if (logoIndex < logoUrls.length - 1) {
      setLogoIndex(logoIndex + 1);
    } else {
      setLogoIndex(-1); // Show initials fallback
    }
  };

  if (logoIndex === -1 || !logoUrls[0]) {
    return (
      <div className={`${sizeClasses} flex items-center justify-center bg-gray-700 rounded text-white font-bold text-xs`}>
        {getInitials(card.name)}
      </div>
    );
  }

  return (
    <img
      src={logoUrls[logoIndex]}
      alt={card.name}
      className={`${sizeClasses} rounded object-contain bg-white/10`}
      onError={handleError}
      crossOrigin="anonymous"
    />
  );
}

// AI Providers Configuration with official logos
const aiProviders = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    getUrl: (query) => `https://chat.openai.com/?q=${encodeURIComponent(query)}`
  },
  {
    id: 'claude',
    name: 'Claude',
    color: 'from-orange-400 to-amber-500',
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg',
    getUrl: (query) => `https://claude.ai/new?q=${encodeURIComponent(query)}`
  },
  {
    id: 'gemini',
    name: 'Gemini',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
    getUrl: (query) => `https://gemini.google.com/app?q=${encodeURIComponent(query)}`
  },
  {
    id: 'grok',
    name: 'Grok',
    color: 'from-gray-400 to-gray-600',
    bgColor: 'bg-gray-500/20',
    textColor: 'text-gray-300',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png',
    getUrl: (query) => `https://x.com/i/grok?q=${encodeURIComponent(query)}`
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    color: 'from-cyan-400 to-teal-500',
    bgColor: 'bg-cyan-500/20',
    textColor: 'text-cyan-400',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.svg',
    getUrl: (query) => `https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`
  }
];

// Ask AI Widget Component
function AskAIWidget({ cardName, onClick }) {
  const [isOpen, setIsOpen] = useState(false);

  const query = `Tell me about ${cardName} crypto card: What are the fees, cashback rewards, supported cryptocurrencies, and how does it compare to competitors?`;

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleProviderClick = (e, provider) => {
    e.stopPropagation();
    window.open(provider.getUrl(query), '_blank');
    setIsOpen(false);
  };

  return (
    <div className="relative flex-shrink-0">
      {/* Main Button */}
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-all ${
          isOpen
            ? 'bg-gray-700 text-white'
            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
        }`}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
        <span>Ask AI</span>
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-gray-800 border border-gray-700 rounded-lg p-2 shadow-xl z-50">
          <p className="text-[10px] text-gray-400 mb-2 text-center">Choose your AI assistant</p>
          <div className="grid grid-cols-5 gap-1">
            {aiProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={(e) => handleProviderClick(e, provider)}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-lg ${provider.bgColor} hover:opacity-80 transition-opacity`}
                title={`Ask ${provider.name}`}
              >
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                  <img
                    src={provider.logoUrl}
                    alt={provider.name}
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <span
                    className={`w-full h-full items-center justify-center text-[8px] font-bold hidden bg-gradient-to-br ${provider.color} text-white rounded-full`}
                  >
                    {provider.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <span className={`text-[8px] ${provider.textColor} font-medium`}>{provider.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Flippable Card Component - with mobile tap support
function FlipCard({ card, isSelected, onSelect, ratings, onRate }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRating = ratings[card.id] || { average: 0, count: 0 };

  // Detect mobile device (screen width only - desktop hover always works)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle tap to flip on mobile
  const handleTapFlip = (e) => {
    if (isMobile) {
      e.stopPropagation();
      setIsFlipped(!isFlipped);
    }
  };

  // Credit card aspect ratio: 85.6mm x 53.98mm = 1.586:1
  // On flip, expand height by 50% to show more content
  const baseHeight = 252; // ~400px width / 1.586 aspect ratio
  const expandedHeight = Math.round(baseHeight * 1.5); // 50% taller when flipped

  return (
    <div
      style={{
        perspective: '1000px',
        height: isFlipped ? `${expandedHeight}px` : `${baseHeight}px`,
        transition: 'height 0.5s ease-in-out'
      }}
      className="cursor-pointer w-full max-w-[400px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s, height 0.5s ease-in-out',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front of Card */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          <div className={`relative w-full h-full bg-gradient-to-br ${card.cardBg} rounded-2xl p-4 text-white shadow-xl border-2 ${
            isSelected ? 'border-lime-400 shadow-lime-400/20' : 'border-transparent'
          }`}>
            {/* Mobile Flip Button - + icon in circle */}
            {isMobile && !isFlipped && (
              <button
                onClick={handleTapFlip}
                className="absolute bottom-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10 border border-white/30"
                aria-label="Tap to see details"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}

            {/* Selection Badge */}
            {isSelected && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-lime-400 rounded-full flex items-center justify-center z-20">
                <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {/* Tier Badge only on front (Category badge moved to back) */}
            {card.tier && (
              <div className="absolute top-2 right-2">
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                  card.tier === 'Elite' ? 'bg-yellow-500/30 text-yellow-300' :
                  card.tier === 'Premium' ? 'bg-pink-500/30 text-pink-300' :
                  'bg-gray-500/30 text-gray-300'
                }`}>
                  {card.tier}
                </span>
              </div>
            )}

            {/* Card Header - Name left, Brand Logo top right */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-base tracking-wide">{card.name}</span>
              <a
                href={card.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:scale-110 transition-transform"
                title={`Follow ${card.name} on X`}
              >
                <CardLogo card={card} size="lg" />
              </a>
            </div>

            {/* EMV Chip - Realistic Design */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-8 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-md shadow-inner relative overflow-hidden">
                {/* Chip contact pads */}
                <div className="absolute inset-0.5 grid grid-cols-2 grid-rows-3 gap-px">
                  <div className="bg-yellow-300/60 rounded-sm"></div>
                  <div className="bg-yellow-300/60 rounded-sm"></div>
                  <div className="bg-yellow-300/40 rounded-sm"></div>
                  <div className="bg-yellow-300/40 rounded-sm"></div>
                  <div className="bg-yellow-300/60 rounded-sm"></div>
                  <div className="bg-yellow-300/60 rounded-sm"></div>
                </div>
                {/* Chip center line */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-yellow-600/40 transform -translate-y-1/2"></div>
              </div>
              {(card.custody === 'Self-Custody') && (
                <span className="text-xs px-2 py-0.5 rounded bg-lime-400/20 text-lime-300 border border-lime-400/30">Self-Custody</span>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div className="bg-black/20 rounded px-2 py-1">
                <span className="text-white/50">Cashback</span>
                <p className="font-bold text-lime-400">{card.cashback}</p>
              </div>
              <div className="bg-black/20 rounded px-2 py-1">
                <span className="text-white/50">FX Fee</span>
                <p className={`font-bold ${card.fxFee === '0%' ? 'text-green-400' : 'text-white'}`}>{card.fxFee}</p>
              </div>
            </div>

            {/* Blockchain Tag & Rating */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs bg-black/20 text-cyan-300 px-2 py-1 rounded">{card.blockchain}</span>
              <StarDisplay rating={cardRating.average} count={cardRating.count} />
            </div>

            {/* Bottom Row: Network Logo */}
            <div className="flex items-center justify-end mt-auto">
              {/* Network Logo - Transparent */}
              <div className="opacity-80">
                <NetworkLogo network={card.network} size="md" variant="white" />
              </div>
            </div>

            {/* Hover/Tap Hint - changes based on device */}
            {!isMobile && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-white/30 text-[10px] flex items-center gap-1">
                <span>Hover for details</span>
              </div>
            )}
          </div>
        </div>

        {/* Back of Card */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className={`w-full h-full bg-gray-900 rounded-2xl p-4 text-white shadow-xl border-2 flex flex-col ${
            isSelected ? 'border-lime-400' : 'border-gray-700'
          }`}>
            {/* Mobile Close Button - X icon to flip back */}
            {isMobile && isFlipped && (
              <button
                onClick={handleTapFlip}
                className="absolute top-2 right-2 w-7 h-7 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors z-10"
                aria-label="Close details"
              >
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Back Header - Brand Icon (clickable to X) + Name */}
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <a
                href={card.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                title="Follow on X"
              >
                <CardLogo card={card} size="sm" />
                <span className="font-bold text-sm">{card.name}</span>
              </a>
              {/* Category Badge on Back */}
              {card.category && spendbaseCategories[card.category] && (
                <div className="flex flex-col items-end">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${spendbaseCategories[card.category].bgColor} ${spendbaseCategories[card.category].textColor}`}>
                    {spendbaseCategories[card.category].badge}
                  </span>
                  {/* Neobank descriptor */}
                  {card.category === 'neobank' && (
                    <span className="text-[8px] text-gray-500 mt-0.5">Bank-led · Fiat-settled</span>
                  )}
                </div>
              )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {/* Business Type & Region Tags */}
              <div className="flex flex-wrap gap-1 mb-2">
                {card.tier && (
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    card.tier === 'Elite' ? 'bg-yellow-500/20 text-yellow-400' :
                    card.tier === 'Premium' ? 'bg-pink-500/20 text-pink-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {card.tier} Tier
                  </span>
                )}
                {card.archetype && (
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    card.archetype === 'exchange' ? 'bg-blue-500/20 text-blue-400' :
                    card.archetype === 'wallet' ? 'bg-orange-500/20 text-orange-400' :
                    card.archetype === 'defi' ? 'bg-cyan-500/20 text-cyan-400' :
                    card.archetype === 'emerging' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {strategicArchetypes[card.archetype]?.label || card.archetype}
                  </span>
                )}
                {card.regions && card.regions.slice(0, 2).map((region, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                    {regions[region]?.abbr || regions[region]?.label}
                  </span>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                <div className="bg-gray-800 rounded-lg p-2">
                  <p className="text-gray-400">Cashback</p>
                  <p className="font-bold text-lime-400">{card.cashback}</p>
                  <p className="text-gray-500 text-[10px]">{card.cashbackToken}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-2">
                  <p className="text-gray-400">FX Fee</p>
                  <p className={`font-bold ${card.fxFee === '0%' ? 'text-green-400' : 'text-white'}`}>{card.fxFee}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-2">
                  <p className="text-gray-400">Annual Fee</p>
                  <p className="font-bold text-white text-[11px]">{card.annualFee}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-2">
                  <p className="text-gray-400">Card Delivery</p>
                  <p className={`font-bold text-[11px] ${card.mailingFee === 'Free' || card.mailingFee === '$0' || card.mailingFee === 'Included' ? 'text-green-400' : 'text-white'}`}>{card.mailingFee || 'Varies'}</p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-2">
                <p className="text-gray-400 text-xs mb-1">Features</p>
                <div className="flex flex-wrap gap-1">
                  {card.features.slice(0, 4).map((feature, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-gray-800 text-gray-300 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Perks */}
              <div className="mb-2">
                <p className="text-gray-400 text-xs mb-1">Key Perks</p>
                <div className="flex flex-wrap gap-1">
                  {card.perks.slice(0, 3).map((perk, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-lime-400/10 text-lime-300 rounded">
                      {perk}
                    </span>
                  ))}
                </div>
              </div>

              {/* User Rating */}
              <div className="mb-2 bg-gray-800 rounded-lg p-2">
                <p className="text-gray-400 text-xs mb-1">Rate this card</p>
                <div className="flex items-center justify-between">
                  <StarRating
                    rating={cardRating.average}
                    onRate={(r) => onRate(card.id, r)}
                    size="md"
                    interactive={true}
                  />
                  <span className="text-gray-500 text-[10px]">
                    {cardRating.count.toLocaleString()} reviews
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons - Fixed at bottom */}
            <div className="flex gap-2 mt-2 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(card);
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {isSelected ? 'Selected' : '+ Compare'}
              </button>
              <a
                href={addUtmParams(card.affiliateUrl, card.name)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 py-2 px-3 bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 rounded-lg text-xs font-bold text-center hover:opacity-90 transition-opacity"
              >
                Apply Now
              </a>
            </div>

            {/* Ask AI Widget */}
            <div className="mt-2">
              <AskAIWidget cardName={card.name} />
            </div>

            {/* Affiliate Code Badge */}
            {card.affiliateCode && (
              <div className="mt-2 text-center flex-shrink-0">
                <span className="text-[10px] text-gray-400">Use code: </span>
                <span className="text-[10px] font-mono bg-lime-400/20 text-lime-400 px-2 py-0.5 rounded">
                  {card.affiliateCode}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Spendbase Logo Component (S with credit card and path)
function SpendbaseLogo({ size = 'md', className = '' }) {
  const sizeClasses = size === 'lg' ? 'w-10 h-10' : size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';
  return (
    <svg className={`${sizeClasses} ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="spendbaseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#00CC66" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#spendbaseGradient)"/>
      {/* Card shape */}
      <rect x="18" y="28" width="45" height="32" rx="4" fill="rgba(255,255,255,0.3)" transform="rotate(-8 18 28)"/>
      {/* Chip */}
      <rect x="24" y="36" width="10" height="8" rx="1" fill="rgba(255,255,255,0.8)" transform="rotate(-8 24 36)"/>
      {/* S path */}
      <path d="M45 30 Q70 30, 70 45 Q70 55, 50 55 Q30 55, 30 65 Q30 78, 55 78" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// Theme Toggle Component
function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
        isDark ? 'bg-gray-700' : 'bg-blue-100'
      }`}
      aria-label="Toggle theme"
    >
      <div className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center ${
        isDark ? 'left-8 bg-gray-900' : 'left-1 bg-yellow-400'
      }`}>
        {isDark ? (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  );
}

// ============================================
// SUBSCRIBE MODAL - Email Capture
// ============================================
function SubscribeModal({ isOpen, onClose, theme = {}, isDarkMode = true }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    monthlySpend: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Fallback theme values
  const themeClasses = {
    muted: theme.muted || (isDarkMode ? 'text-gray-400' : 'text-gray-500')
  };

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Spain', 'Italy', 'Netherlands', 'Switzerland', 'Singapore',
    'Hong Kong', 'Japan', 'South Korea', 'Brazil', 'Mexico', 'Argentina',
    'India', 'United Arab Emirates', 'South Africa', 'Nigeria', 'Other'
  ];

  const spendRanges = [
    'Less than $500',
    '$500 - $1,000',
    '$1,000 - $2,500',
    '$2,500 - $5,000',
    '$5,000 - $10,000',
    'More than $10,000'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.country) {
      setError('Please select your country');
      return;
    }
    if (!formData.monthlySpend) {
      setError('Please select your monthly card spend');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call (replace with actual endpoint)
    try {
      // In production, this would POST to your backend/email service
      console.log('Subscriber data:', formData);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSubmitted(true);
      setFormData({ name: '', email: '', country: '', monthlySpend: '' });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-lime-400 to-emerald-500 p-6 text-gray-900">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold">Stay Updated</h2>
          <p className="text-gray-800 mt-1 text-sm">Get the latest crypto card news, exclusive deals, and new card launches.</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-lime-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">You're In!</h3>
              <p className={`${themeClasses.muted} text-sm mb-6`}>
                Thanks for subscribing. We'll keep you updated on the best crypto cards and exclusive offers.
              </p>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-medium px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Continue Exploring
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.muted} mb-1`}>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className={`w-full px-4 py-3 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent`}
                />
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.muted} mb-1`}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent`}
                />
              </div>

              {/* Country */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.muted} mb-1`}>Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent`}
                >
                  <option value="">Select your country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Monthly Spend */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.muted} mb-1`}>Monthly Card Spend (USD)</label>
                <select
                  value={formData.monthlySpend}
                  onChange={(e) => setFormData({ ...formData, monthlySpend: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent`}
                >
                  <option value="">Select your monthly spend</option>
                  {spendRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subscribing...
                  </>
                ) : (
                  'Subscribe for Updates'
                )}
              </button>

              <p className={`text-xs ${themeClasses.muted} text-center`}>
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// LEARN SECTION - Educational Content
// ============================================
function LearnSection({ theme = {}, isDarkMode = true, onNavigate, cardCount }) {
  const themeClasses = { muted: theme.muted || (isDarkMode ? 'text-gray-400' : 'text-gray-500') };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
          The Complete Guide to Crypto Cards
        </h1>
        <p className={`text-xl ${themeClasses.muted}`}>Everything you need to know about cryptocurrency debit cards and stablecoin spending.</p>
      </header>

      <div className="grid gap-6">
        <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl p-6 border`}>
          <h2 className="text-xl font-bold mb-3 text-lime-400">What Is a Crypto Card?</h2>
          <p className={themeClasses.muted}>A crypto card lets you spend cryptocurrency anywhere Visa or Mastercard is accepted. Your crypto converts to local currency at the point of sale.</p>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl p-6 border`}>
          <h2 className="text-xl font-bold mb-3 text-purple-400">Understanding Stablecoins</h2>
          <p className={themeClasses.muted}>Stablecoins like USDC are pegged 1:1 to the US dollar. No volatility risk - perfect for everyday spending with all the benefits of crypto.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className={`${isDarkMode ? 'bg-lime-400/10 border-lime-400/20' : 'bg-lime-50 border-lime-200'} rounded-xl p-4 border`}>
            <p className="text-2xl font-bold text-lime-400">$18B+</p>
            <p className={`text-sm ${themeClasses.muted}`}>Annual Volume</p>
          </div>
          <div className={`${isDarkMode ? 'bg-purple-400/10 border-purple-400/20' : 'bg-purple-50 border-purple-200'} rounded-xl p-4 border`}>
            <p className="text-2xl font-bold text-purple-400">$308B</p>
            <p className={`text-sm ${themeClasses.muted}`}>Stablecoin Supply</p>
          </div>
          <div className={`${isDarkMode ? 'bg-cyan-400/10 border-cyan-400/20' : 'bg-cyan-50 border-cyan-200'} rounded-xl p-4 border`}>
            <p className="text-2xl font-bold text-cyan-400">460%</p>
            <p className={`text-sm ${themeClasses.muted}`}>YoY Growth</p>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl p-6 border`}>
          <h2 className="text-xl font-bold mb-4">Card Types</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3"><span className="w-3 h-3 bg-lime-400 rounded-full"></span><span className="font-medium">Crypto-Native</span><span className={themeClasses.muted}>- Wallet-first, self-custody</span></div>
            <div className="flex items-center gap-3"><span className="w-3 h-3 bg-blue-400 rounded-full"></span><span className="font-medium">Neobank + Crypto</span><span className={themeClasses.muted}>- Bank-led with crypto features</span></div>
            <div className="flex items-center gap-3"><span className="w-3 h-3 bg-purple-400 rounded-full"></span><span className="font-medium">Stablecoin-First</span><span className={themeClasses.muted}>- Next-gen digital dollar</span></div>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gradient-to-r from-lime-400/10 to-emerald-400/10 border-lime-400/20' : 'bg-lime-50 border-lime-200'} rounded-2xl p-6 border text-center`}>
          <h3 className="text-xl font-bold mb-2">Ready to Find Your Card?</h3>
          <p className={`${themeClasses.muted} mb-4`}>Compare {cardCount || 20}+ crypto cards side by side.</p>
          <button onClick={() => onNavigate && onNavigate('discover')} className="bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-bold px-6 py-3 rounded-xl">
            Browse All Cards
          </button>
        </div>
      </div>
    </div>
  );
}
export default function Spendbase() {
  const [activeView, setActiveView] = useState('discover');
  const [selectedCards, setSelectedCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Cards');
  const [custodyFilter, setCustodyFilter] = useState('All Custody');
  const [networkFilter, setNetworkFilter] = useState('All Networks');
  const [regionFilter, setRegionFilter] = useState('All Regions');
  const [archetypeFilter, setArchetypeFilter] = useState('All Types');
  const [currencyFilter, setCurrencyFilter] = useState('All Currencies');
  const [tokenFilter, setTokenFilter] = useState('All Tokens');
  const [sortBy, setSortBy] = useState('rating-high');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ratings, setRatings] = useState(defaultRatings);
  const [userRatings, setUserRatings] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  // Handle user rating
  const handleRate = (cardId, rating) => {
    // Store user's rating
    setUserRatings(prev => ({ ...prev, [cardId]: rating }));

    // Update the average (simplified - in production this would be server-side)
    setRatings(prev => {
      const current = prev[cardId] || { average: 0, count: 0 };
      const newCount = current.count + 1;
      const newAverage = ((current.average * current.count) + rating) / newCount;
      return {
        ...prev,
        [cardId]: { average: Math.round(newAverage * 10) / 10, count: newCount }
      };
    });
  };

  // Currency mapping for cards
  const cardCurrencies = {
    // USD-focused
    1: ['USD', 'EUR', 'GBP', 'USDC'], // Revolut
    2: ['USD'], // SoFi
    3: ['USD', 'BTC'], // Cash App
    4: ['USD', 'EUR', 'GBP', 'USDC'], // PayPal
    5: ['USD'], // Robinhood
    6: ['EUR'], // N26
    7: ['USD', 'EUR', 'GBP', 'USDC', 'USDT'], // Wirex
    8: ['USD', 'USDC'], // Nubank
    101: ['USDC'], // Ready
    102: ['USDC', 'USDT', 'USD'], // KAST K
    1021: ['USDC', 'USDT', 'USD'], // KAST X
    1022: ['USDC', 'USDT', 'USD'], // KAST Founders
    103: ['USDC', 'SOL', 'ETH'], // Avici
    104: ['EUR', 'GBP', 'USDC'], // Gnosis Pay
    105: ['USDC', 'USDT', 'ETH'], // MetaMask
    106: ['USDC', 'ETH', 'BTC'], // Ether.fi
    107: ['USD', 'EUR', 'USDC', 'USDT', 'BTC'], // Crypto.com
    108: ['USD', 'USDC', 'BTC', 'ETH'], // Coinbase
    109: ['USD', 'EUR', 'GBP', 'USDC', 'USDT'], // Nexo
    110: ['EUR', 'GBP'], // Plutus
    111: ['EUR', 'USDC'], // Holyheld
    112: ['USDC', 'SOL'], // Solflare
    113: ['EUR', 'USDT'], // Bybit
    114: ['USD', 'BTC'], // Fold
    115: ['USDC', 'SOL'], // Phantom
    116: ['USD', 'USDT', 'USDC', 'BTC'], // Redotpay
    117: ['EUR', 'GBP', 'USDC'], // Bleap
    118: ['EUR', 'BTC', 'USDC'], // WhiteBIT
    119: ['USD', 'USDC'], // Uphold
    120: ['USD', 'BTC', 'ETH'], // BitPay
    121: ['EUR', 'USDT', 'BTC'] // Binance
  };

  const toggleCardSelection = (card) => {
    if (selectedCards.find(c => c.id === card.id)) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    } else if (selectedCards.length < 6) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const filteredCards = allCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase())) ||
      card.blockchain.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filtering for 3-tier system
    let matchesCategory = true;
    if (categoryFilter === 'Crypto-Native') matchesCategory = card.category === 'cryptoNative';
    if (categoryFilter === 'Stablecoin-First') matchesCategory = card.category === 'stablecoinFirst';
    if (categoryFilter === 'Neobank + Crypto') matchesCategory = card.category === 'neobank';

    let matchesCustody = true;
    if (custodyFilter === 'Self-Custody') matchesCustody = card.custody === 'Self-Custody';
    if (custodyFilter === 'Custodial') matchesCustody = card.custody === 'Custodial';

    let matchesNetwork = true;
    if (networkFilter === 'Visa') matchesNetwork = card.network === 'Visa';
    if (networkFilter === 'Mastercard') matchesNetwork = card.network === 'Mastercard';

    let matchesRegion = true;
    if (regionFilter !== 'All Regions') {
      const regionKey = regionMap[regionFilter];
      matchesRegion = card.regions && card.regions.includes(regionKey);
    }

    let matchesArchetype = true;
    if (archetypeFilter !== 'All Types') {
      const archetypeKey = archetypeMap[archetypeFilter];
      matchesArchetype = card.archetype === archetypeKey;
    }

    let matchesCurrency = true;
    if (currencyFilter !== 'All Currencies') {
      const cardCurrencyList = cardCurrencies[card.id] || [];
      matchesCurrency = cardCurrencyList.includes(currencyFilter);
    }

    let matchesToken = true;
    if (tokenFilter === 'Own Token') matchesToken = card.hasToken === true;
    if (tokenFilter === 'No Token') matchesToken = card.hasToken === false;

    return matchesSearch && matchesCategory && matchesCustody && matchesNetwork && matchesRegion && matchesArchetype && matchesCurrency && matchesToken;
  });

  // Sort cards based on selected sort option
  const sortedCards = [...filteredCards].sort((a, b) => {
    const ratingA = ratings[a.id]?.average || 0;
    const ratingB = ratings[b.id]?.average || 0;
    const countA = ratings[a.id]?.count || 0;
    const countB = ratings[b.id]?.count || 0;

    switch (sortBy) {
      case 'rating-high':
        return ratingB - ratingA;
      case 'rating-low':
        return ratingA - ratingB;
      case 'reviews':
        return countB - countA;
      case 'name-az':
        return a.name.localeCompare(b.name);
      case 'name-za':
        return b.name.localeCompare(a.name);
      default:
        return ratingB - ratingA; // Default to highest rated
    }
  });

  const hybridCount = allCards.filter(c => c.category === 'hybrid').length;
  const onchainCount = allCards.filter(c => c.category === 'onchain').length;
  const selfCustodyCount = allCards.filter(c => c.custody === 'Self-Custody').length;
  const exchangeCount = allCards.filter(c => c.archetype === 'exchange').length;
  const walletCount = allCards.filter(c => c.archetype === 'wallet').length;
  const defiCount = allCards.filter(c => c.archetype === 'defi').length;
  const emergingCount = allCards.filter(c => c.archetype === 'emerging').length;

  // Theme classes
  const theme = {
    bg: isDarkMode ? 'bg-gray-950' : 'bg-gray-50',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    sidebar: isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
    card: isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
    cardHover: isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
    input: isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
    muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    border: isDarkMode ? 'border-gray-800' : 'border-gray-200',
  };

  // Alias for consistency with child components
  const themeClasses = theme;

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} flex transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-16'} ${theme.sidebar} border-r p-4 flex flex-col transition-all duration-300 flex-shrink-0`}>
        {/* Toggle Button / Logo */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 hover:scale-105 transition-transform cursor-pointer mb-6"
          title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <SpendbaseLogo size="lg" />
        </button>

        {sidebarOpen && (
          <div className="mb-6">
            <h1 className="font-bold text-xl leading-tight">Spendbase</h1>
            <p className={`${themeClasses.muted} text-xs leading-snug`}>The comparison layer for stablecoin-powered spending.</p>
            {/* Theme Toggle */}
            <div className="mt-3 flex items-center gap-2">
              <span className={`text-xs ${themeClasses.muted}`}>Theme</span>
              <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
            </div>
          </div>
        )}

        {/* Navigation - condensed when sidebar closed */}
        <nav className="flex flex-col gap-2 mb-6">
          <button
            onClick={() => setActiveView('discover')}
            className={`flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-left transition-all ${
              activeView === 'discover'
                ? 'bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-medium'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            title="Discover Cards"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            {sidebarOpen && 'Discover Cards'}
          </button>

          <button
            onClick={() => setActiveView('comparison')}
            className={`flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-left transition-all relative ${
              activeView === 'comparison'
                ? 'bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-medium'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            title="Compare Cards"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            {sidebarOpen && 'Compare'}
            {selectedCards.length > 0 && (
              <span className={`bg-lime-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full ${sidebarOpen ? 'ml-auto' : 'absolute -top-1 -right-1'}`}>
                {selectedCards.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('learn')}
            className={`flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-left transition-all ${
              activeView === 'learn'
                ? 'bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-medium'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            title="Learn About Crypto Cards"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {sidebarOpen && 'Learn'}
          </button>

          {/* Subscribe button in nav (shown when sidebar collapsed) */}
          {!sidebarOpen && (
            <button
              onClick={() => setShowSubscribeModal(true)}
              className="flex items-center justify-center py-3 rounded-xl text-gray-300 hover:bg-purple-500/20 transition-all"
              title="Subscribe for Updates"
            >
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          )}
        </nav>

        {/* Stats - only show when sidebar is open */}
        {sidebarOpen && (
          <>
            {/* Market Stats - From Artemis Report */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Market Data (Jan 2026)</p>
              <div className="bg-gradient-to-br from-lime-400/10 to-emerald-400/10 rounded-xl p-4 border border-lime-400/20">
                <p className="text-xs text-gray-400 mb-1">Annual Volume</p>
                <p className="text-2xl font-bold text-lime-400">{marketData.totalVolume}</p>
                <p className="text-xs text-emerald-400 mt-1">↑ {marketData.volumeGrowth}</p>
              </div>
            </div>

            {/* Card Type Stats */}
            <div className="space-y-2 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">By Category</p>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Hybrid</span>
                  <span className="text-lime-400 font-bold">{hybridCount}</span>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Onchain</span>
                  <span className="text-emerald-400 font-bold">{onchainCount}</span>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Self-Custody</span>
                  <span className="text-cyan-400 font-bold">{selfCustodyCount}</span>
                </div>
              </div>
            </div>

            {/* Business Types */}
            <div className="space-y-2 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">By Business Type</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                  <p className="text-blue-400 font-bold">{exchangeCount}</p>
                  <p className="text-gray-500 text-xs">Exchange</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                  <p className="text-orange-400 font-bold">{walletCount}</p>
                  <p className="text-gray-500 text-xs">Wallet</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                  <p className="text-cyan-400 font-bold">{defiCount}</p>
                  <p className="text-gray-500 text-xs">DeFi</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                  <p className="text-purple-400 font-bold">{emergingCount}</p>
                  <p className="text-gray-500 text-xs">Last-Mile</p>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-4">
              {/* Subscribe CTA */}
              <button
                onClick={() => setShowSubscribeModal(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl p-4 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Subscribe for Updates</p>
                    <p className="text-xs text-white/70">New cards, deals & insights</p>
                  </div>
                </div>
              </button>

              {/* Total Cards */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Total Cards Indexed</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
                  {allCards.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Source: Artemis Research</p>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {activeView === 'discover' ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Explore Crypto Cards</h2>
                <p className={`${themeClasses.muted} mt-1`}>Hover over each crypto card to see and compare details. Apply to unlock your stablecoins.</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, blockchain, or feature..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent text-white placeholder-gray-500"
              />
            </div>

            {/* Filters Row 1 */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">Category:</span>
                {categoryFilters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setCategoryFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      categoryFilter === filter
                        ? 'bg-lime-400 text-gray-900 font-medium'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">Custody:</span>
                {custodyFilters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setCustodyFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      custodyFilter === filter
                        ? 'bg-emerald-400 text-gray-900 font-medium'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">Network:</span>
                {networkFilters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setNetworkFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      networkFilter === filter
                        ? 'bg-cyan-400 text-gray-900 font-medium'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters Row 2 - Region & Business Type */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className={`${themeClasses.muted} text-sm`}>Region:</span>
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className={`${theme.input} px-4 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-purple-400`}
                >
                  {regionFilters.map(filter => (
                    <option key={filter} value={filter}>{filter}</option>
                  ))}
                </select>
                {regionFilter === 'India' && (
                  <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">$338B Crypto Inflows</span>
                )}
                {regionFilter === 'Argentina' && (
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">46.6% USDC Market</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`${themeClasses.muted} text-sm`}>Business Type:</span>
                <select
                  value={archetypeFilter}
                  onChange={(e) => setArchetypeFilter(e.target.value)}
                  className={`${theme.input} px-4 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-purple-400`}
                >
                  {archetypeFilters.map(filter => (
                    <option key={filter} value={filter}>{filter}</option>
                  ))}
                </select>
                {archetypeFilter === 'Exchange' && (
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">User Acquisition</span>
                )}
                {archetypeFilter === 'Wallet' && (
                  <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">ARPU Maximizer</span>
                )}
                {archetypeFilter === 'DeFi' && (
                  <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">TVL Driver</span>
                )}
                {archetypeFilter === 'Last-Mile' && (
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Dollar Access</span>
                )}
              </div>
            </div>

            {/* Filters Row 3 - Currency, Sort & Clear */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">Currency:</span>
                <select
                  value={currencyFilter}
                  onChange={(e) => setCurrencyFilter(e.target.value)}
                  className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="All Currencies">All Currencies</option>
                  {currencies.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className={`${themeClasses.muted} text-sm`}>Own Token:</span>
                <select
                  value={tokenFilter}
                  onChange={(e) => setTokenFilter(e.target.value)}
                  className={`${theme.input} px-4 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                >
                  {tokenFilters.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className={`${themeClasses.muted} text-sm`}>Rating:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`${theme.input} px-4 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                >
                  <option value="rating-high">Highest Rated</option>
                  <option value="rating-low">Lowest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="name-az">Name A-Z</option>
                  <option value="name-za">Name Z-A</option>
                </select>
              </div>

              {/* Clear all filters */}
              {(regionFilter !== 'All Regions' || archetypeFilter !== 'All Types' || categoryFilter !== 'All Cards' || custodyFilter !== 'All Custody' || networkFilter !== 'All Networks' || currencyFilter !== 'All Currencies' || tokenFilter !== 'All Tokens' || sortBy !== 'rating-high') && (
                <button
                  onClick={() => {
                    setRegionFilter('All Regions');
                    setArchetypeFilter('All Types');
                    setCategoryFilter('All Cards');
                    setCustodyFilter('All Custody');
                    setNetworkFilter('All Networks');
                    setCurrencyFilter('All Currencies');
                    setTokenFilter('All Tokens');
                    setSortBy('rating-high');
                  }}
                  className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear filters
                </button>
              )}

              {/* Results count */}
              <span className="text-gray-500 text-sm ml-auto">
                {sortedCards.length} cards found
              </span>
            </div>

            {/* Category 1: Crypto-Native Cards (PRIMARY FOCUS) */}
            {(categoryFilter === 'All Cards' || categoryFilter === 'Crypto-Native') && sortedCards.some(c => c.category === 'cryptoNative') && (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-lime-400 mb-2 flex items-center gap-2">
                    Crypto-Native Cards
                    <span className="text-xs px-2 py-0.5 bg-lime-500/20 text-lime-400 rounded font-medium">PRIMARY</span>
                  </h3>
                  <p className="text-gray-500 text-sm">Wallet-first, onchain interface - eligible for "Best crypto card" rankings</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 justify-items-center">
                  {sortedCards.filter(c => c.category === 'cryptoNative').map(card => (
                    <FlipCard
                      key={card.id}
                      card={card}
                      isSelected={selectedCards.some(c => c.id === card.id)}
                      onSelect={toggleCardSelection}
                      ratings={ratings}
                      onRate={handleRate}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Category 3: Stablecoin-First Cards (THE FUTURE) */}
            {(categoryFilter === 'All Cards' || categoryFilter === 'Stablecoin-First') && sortedCards.some(c => c.category === 'stablecoinFirst') && (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-purple-400 mb-2 flex items-center gap-2">
                    Stablecoin-First Cards
                    <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded font-medium">NEXT-GEN</span>
                  </h3>
                  <p className="text-gray-500 text-sm">Next-gen stablecoin spending - the future of crypto cards</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 justify-items-center">
                  {sortedCards.filter(c => c.category === 'stablecoinFirst').map(card => (
                    <FlipCard
                      key={card.id}
                      card={card}
                      isSelected={selectedCards.some(c => c.id === card.id)}
                      onSelect={toggleCardSelection}
                      ratings={ratings}
                      onRate={handleRate}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Category 2: Neobank + Crypto Cards (INCLUDED, LABELED) */}
            {(categoryFilter === 'All Cards' || categoryFilter === 'Neobank + Crypto') && sortedCards.some(c => c.category === 'neobank') && (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-blue-400 mb-2 flex items-center gap-2">
                    Neobanks with Crypto
                    <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded font-medium">ADJACENT</span>
                  </h3>
                  <p className="text-gray-500 text-sm">Bank-led · Custodial · Fiat-settled - traditional banking with crypto features</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-items-center">
                  {sortedCards.filter(c => c.category === 'neobank').map(card => (
                    <FlipCard
                      key={card.id}
                      card={card}
                      isSelected={selectedCards.some(c => c.id === card.id)}
                      onSelect={toggleCardSelection}
                      ratings={ratings}
                      onRate={handleRate}
                    />
                  ))}
                </div>
              </>
            )}

            {sortedCards.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No cards match your filters</p>
              </div>
            )}
          </>
        ) : (
          /* Comparison View */
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Compare Cards</h2>
                <p className="text-gray-400 mt-1">Side-by-side comparison of selected cards</p>
              </div>
              {selectedCards.length > 0 && (
                <button
                  onClick={() => setSelectedCards([])}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Clear all
                </button>
              )}
            </div>

            {selectedCards.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-24 h-24 bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-4xl">💳</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">No cards selected</h3>
                <p className="text-gray-400 text-center max-w-md mb-6">
                  Hover over cards in Discover and click "+ Compare" to add up to 6 cards for comparison.
                </p>
                <button
                  onClick={() => setActiveView('discover')}
                  className="bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-medium px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Go to Discover
                </button>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left p-4 font-medium text-gray-400 bg-gray-900/50 sticky left-0 min-w-[140px]">Feature</th>
                        {selectedCards.map(card => (
                          <th key={card.id} className="p-4 min-w-[220px]">
                            <div className={`bg-gradient-to-br ${card.cardBg} rounded-xl p-4 text-white text-center`}>
                              <CardLogo card={card} size="lg" />
                              <span className="font-bold block mt-2">{card.name}</span>
                              <div className="flex justify-center gap-1 mt-2">
                                <span className="px-2 py-0.5 bg-white/20 rounded text-xs">{card.category}</span>
                                {card.tier && <span className="px-2 py-0.5 bg-white/20 rounded text-xs">{card.tier}</span>}
                              </div>
                              <div className="flex justify-center gap-2 mt-3">
                                {card.twitterUrl && (
                                  <a
                                    href={card.twitterUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                  >
                                    <TwitterIcon className="w-4 h-4" />
                                  </a>
                                )}
                                <a
                                  href={addUtmParams(card.affiliateUrl, card.name)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 py-2 bg-lime-400 text-gray-900 rounded-lg text-xs font-bold hover:bg-lime-300 transition-colors"
                                >
                                  Apply Now
                                </a>
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      <tr>
                        <td className="p-4 font-medium text-gray-400 bg-gray-900/50 sticky left-0">⭐ Rating</td>
                        {selectedCards.map(card => {
                          const cardRating = ratings[card.id] || { average: 0, count: 0 };
                          return (
                            <td key={card.id} className="p-4 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <StarRating rating={cardRating.average} interactive={false} size="sm" />
                                <span className="text-yellow-400 font-bold">{cardRating.average.toFixed(1)}</span>
                                <span className="text-gray-500 text-xs">{cardRating.count.toLocaleString()} reviews</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-gray-400 bg-gray-900/50 sticky left-0">Category</td>
                        {selectedCards.map(card => (
                          <td key={card.id} className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              card.category === 'hybrid' ? 'bg-lime-400/20 text-lime-400' : 'bg-emerald-400/20 text-emerald-400'
                            }`}>
                              {card.category === 'hybrid' ? 'Hybrid' : 'Onchain'}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-gray-400 bg-gray-900/50 sticky left-0">Custody</td>
                        {selectedCards.map(card => (
                          <td key={card.id} className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              card.custody === 'Self-Custody'
                                ? 'bg-cyan-400/20 text-cyan-400'
                                : 'bg-gray-700 text-gray-300'
                            }`}>
                              {card.custody}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-gray-400 bg-gray-900/50 sticky left-0">Network</td>
                        {selectedCards.map(card => (
                          <td key={card.id} className="p-4 text-center">
                            <div className="flex justify-center">
                              <NetworkLogo network={card.network} size="sm" variant="color" />
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-gray-400 bg-gray-900/50 sticky left-0">Blockchain</td>
                        {selectedCards.map(card => (
                          <td key={card.id} className="p-4 text-center text-gray-300">{card.blockchain}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-gray-400 bg-gray-900/50 sticky left-0">Cashback</td>
                        {selectedCards.map(card => (
                          <td key={card.id} className="p-4 text-center">
                            <span className="font-bold text-lime-400 text-lg">{card.cashback}</span>
                            <span className="block text-xs text-gray-500">{card.cashbackToken}</span>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-gray-400 bg-gray-900/50 sticky left-0">Annual Fee</td>
                        {selectedCards.map(card => (
                          <td key={card.id} className="p-4 text-center text-gray-300">{card.annualFee}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-gray-400 bg-gray-900/50 sticky left-0">FX Fee</td>
                        {selectedCards.map(card => (
                          <td key={card.id} className="p-4 text-center">
                            <span className={card.fxFee === '0%' ? 'text-green-400 font-bold' : 'text-gray-300'}>
                              {card.fxFee}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-gray-400 bg-gray-900/50 sticky left-0">Free ATM</td>
                        {selectedCards.map(card => (
                          <td key={card.id} className="p-4 text-center text-gray-300">{card.atmFree}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-gray-400 bg-gray-900/50 sticky left-0">Crypto Support</td>
                        {selectedCards.map(card => (
                          <td key={card.id} className="p-4 text-center text-gray-300">{card.cryptoCount}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-gray-400 bg-gray-900/50 sticky left-0">Key Features</td>
                        {selectedCards.map(card => (
                          <td key={card.id} className="p-4">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {card.features.map((f, i) => (
                                <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-gray-400 bg-gray-900/50 sticky left-0">Top Perks</td>
                        {selectedCards.map(card => (
                          <td key={card.id} className="p-4">
                            <ul className="text-sm text-gray-300 space-y-1">
                              {card.perks.map((p, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-lime-400">Yes</span>
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-gray-400 bg-gray-900/50 sticky left-0">Referral Code</td>
                        {selectedCards.map(card => (
                          <td key={card.id} className="p-4 text-center">
                            {card.affiliateCode ? (
                              <span className="font-mono bg-lime-400/20 text-lime-400 px-3 py-1 rounded">
                                {card.affiliateCode}
                              </span>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : activeView === 'learn' ? (
          <LearnSection
            theme={theme}
            isDarkMode={isDarkMode}
            onNavigate={setActiveView}
            cardCount={allCards.length}
          />
        ) : null}
      </main>

      {/* Subscribe Modal */}
      <SubscribeModal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        theme={theme}
        isDarkMode={isDarkMode}
      />

      {/* Custom scrollbar styles */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}
