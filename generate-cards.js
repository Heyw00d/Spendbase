const fs = require('fs');
const path = require('path');

console.log('🚀 Generating static HTML pages for crypto cards...\n');

// Read the main HTML file
const htmlContent = fs.readFileSync('./index.html', 'utf8');

// Extract allCards array using more precise matching
const allCardsStart = htmlContent.indexOf('const allCards = [');
const allCardsEnd = htmlContent.indexOf('];', allCardsStart) + 2;
if (allCardsStart === -1 || allCardsEnd === -1) {
  throw new Error('Could not find allCards array boundaries in index.html');
}
const allCardsCode = htmlContent.substring(allCardsStart, allCardsEnd);

// Extract cardRatingsData object
const ratingsStart = htmlContent.indexOf('const cardRatingsData = {');
const ratingsEnd = htmlContent.indexOf('};', ratingsStart) + 2;
if (ratingsStart === -1 || ratingsEnd === -1) {
  throw new Error('Could not find cardRatingsData object boundaries in index.html');
}
const ratingsCode = htmlContent.substring(ratingsStart, ratingsEnd);

// Parse the extracted data by creating a function that returns the objects
let allCards, cardRatingsData;

try {
  // Create functions that return the data when called
  const getAllCards = new Function('return ' + allCardsCode.replace('const allCards = ', ''));
  const getRatingsData = new Function('return ' + ratingsCode.replace('const cardRatingsData = ', ''));
  
  allCards = getAllCards();
  cardRatingsData = getRatingsData();
  
  console.log(`✅ Successfully parsed ${allCards.length} cards`);
  console.log(`✅ Successfully parsed ratings for ${Object.keys(cardRatingsData).length} cards\n`);
} catch (error) {
  console.error('Parse error:', error.message);
  throw new Error('Failed to parse card data: ' + error.message);
}

// Slug generation function
function getCardSlug(card) {
  return card.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// KAST tier configuration for navigation
const kastTiers = {
  standard: { label: 'Standard', color: 'purple', fee: '$20/year', cashback: '2%' },
  premium: { label: 'Premium', color: 'pink', fee: '$1,000/year', cashback: '5%' },
  limited: { label: 'Limited', color: 'amber', fee: '$10,000 one-time', cashback: '5%' },
  luxe: { label: 'Luxe', color: 'yellow', fee: 'Invite Only', cashback: '8%' }
};

// Get all KAST cards grouped by tier
function getKastCardsByTier() {
  const kastCards = allCards.filter(c => c.brand === 'KAST');
  const grouped = {};
  for (const card of kastCards) {
    const tier = card.tierGroup || 'standard';
    if (!grouped[tier]) grouped[tier] = [];
    grouped[tier].push(card);
  }
  return grouped;
}

// Generate KAST family banner HTML
function generateKastBanner(card) {
  if (card.brand !== 'KAST') return '';
  const tierInfo = kastTiers[card.tierGroup] || kastTiers.standard;
  return `
  <!-- KAST Card Family Banner -->
  <div class="container mx-auto px-4 pt-4">
    <a href="/card/kast/" class="block bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-4 hover:border-purple-400/50 transition-colors">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <img src="https://imagedelivery.net/uYHlHjMhbvNHB1x4JZscLw/af067f2d-59c7-4076-797f-26b063088c00/public" alt="KAST" class="h-8 w-8 rounded">
          <div>
            <span class="text-sm text-purple-300 font-medium">Part of the KAST card family</span>
            <span class="text-xs text-gray-400 ml-2">• ${tierInfo.label} Tier</span>
          </div>
        </div>
        <span class="text-purple-400 text-sm">View all 9 KAST cards →</span>
      </div>
    </a>
  </div>`;
}

// Generate KAST tier navigation HTML
function generateKastTierNav(card) {
  if (card.brand !== 'KAST') return '';
  const grouped = getKastCardsByTier();
  const currentTier = card.tierGroup || 'standard';
  
  let html = `
  <!-- KAST Tier Navigation -->
  <section class="mb-8">
    <h2 class="text-xl font-bold mb-4">KAST Card Tiers</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">`;
  
  for (const [tierKey, tierInfo] of Object.entries(kastTiers)) {
    const isActive = tierKey === currentTier;
    const cards = grouped[tierKey] || [];
    html += `
      <div class="p-3 rounded-lg border ${isActive ? 'border-' + tierInfo.color + '-400 bg-' + tierInfo.color + '-500/20' : 'border-gray-700 bg-gray-800/50'} text-center">
        <div class="text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-300'}">${tierInfo.label}</div>
        <div class="text-xs text-gray-400 mt-1">${tierInfo.cashback} cashback</div>
        <div class="text-xs text-gray-500">${tierInfo.fee}</div>
      </div>`;
  }
  
  html += `
    </div>`;
  
  // Show sibling cards in same tier
  const siblings = (grouped[currentTier] || []).filter(c => c.id !== card.id);
  if (siblings.length > 0) {
    html += `
    <div class="bg-gray-800/50 rounded-lg p-4">
      <p class="text-sm text-gray-400 mb-3">Other ${kastTiers[currentTier]?.label || 'KAST'} tier cards:</p>
      <div class="flex flex-wrap gap-3">`;
    for (const sib of siblings) {
      const sibSlug = getCardSlug(sib);
      html += `
        <a href="/card/${sibSlug}/" class="flex items-center space-x-2 bg-gray-700/50 hover:bg-gray-600/50 px-3 py-2 rounded-lg transition-colors">
          <img src="${sib.logo}" alt="${sib.name}" class="w-6 h-6 rounded">
          <span class="text-sm">${sib.name}</span>
        </a>`;
    }
    html += `
      </div>
    </div>`;
  }
  
  html += `
  </section>`;
  
  return html;
}

// Generate Real Return Calculator HTML
function generateRealReturnCalc(card) {
  // Parse cashback rate (take first number from rates like "2%", "5%", "8%", "2-6%", "Up to 15%")
  const cashbackMatch = card.cashback.match(/([\d.]+)/);
  const cashbackRate = cashbackMatch ? parseFloat(cashbackMatch[1]) : 0;
  
  // Parse annual fee
  let annualFeeNum = 0;
  let feeNote = '';
  if (card.annualFee.includes('Invite')) {
    feeNote = 'Invite only — fee not publicly disclosed';
  } else {
    const feeMatch = card.annualFee.match(/([\d,]+)/);
    annualFeeNum = feeMatch ? parseFloat(feeMatch[1].replace(',', '')) : 0;
    if (card.annualFee.includes('one-time')) {
      feeNote = 'One-time fee (amortized over 5 years for calculation)';
      annualFeeNum = annualFeeNum / 5; // Amortize over 5 years
    }
  }
  
  if (cashbackRate === 0 && annualFeeNum === 0) return ''; // Skip if no useful data
  
  return `
  <!-- Real Return Calculator -->
  <section class="mb-8">
    <h2 class="text-2xl font-bold mb-4">💰 Real Return Calculator</h2>
    <p class="text-gray-400 text-sm mb-4">See your actual net return after fees. No hype — real numbers.</p>
    <div class="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
      <div class="mb-6">
        <label class="block text-sm text-gray-400 mb-2">Monthly spending</label>
        <div class="flex items-center space-x-3">
          <span class="text-gray-400">$</span>
          <input type="range" id="calc-spend-${card.id}" min="100" max="20000" step="100" value="1000"
            class="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            oninput="updateCalc${card.id}(this.value)">
          <span id="calc-spend-val-${card.id}" class="text-xl font-bold w-24 text-right">$1,000</span>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-gray-800/80 p-4 rounded-lg text-center">
          <div class="text-xs text-gray-400 mb-1">Monthly Cashback</div>
          <div id="calc-cashback-${card.id}" class="text-xl font-bold text-green-400">$${(1000 * cashbackRate / 100).toFixed(0)}</div>
          <div class="text-xs text-gray-500">${cashbackRate}% rate</div>
        </div>
        <div class="bg-gray-800/80 p-4 rounded-lg text-center">
          <div class="text-xs text-gray-400 mb-1">Monthly Fee Cost</div>
          <div id="calc-fee-${card.id}" class="text-xl font-bold text-red-400">-$${(annualFeeNum / 12).toFixed(0)}</div>
          <div class="text-xs text-gray-500">${card.annualFee}</div>
        </div>
        <div class="bg-gray-800/80 p-4 rounded-lg text-center">
          <div class="text-xs text-gray-400 mb-1">Net Monthly</div>
          <div id="calc-net-${card.id}" class="text-xl font-bold text-blue-400">$${((1000 * cashbackRate / 100) - (annualFeeNum / 12)).toFixed(0)}</div>
          <div class="text-xs text-gray-500">cashback − fees</div>
        </div>
        <div class="bg-gray-800/80 p-4 rounded-lg text-center">
          <div class="text-xs text-gray-400 mb-1">Annual Net Return</div>
          <div id="calc-annual-${card.id}" class="text-xl font-bold text-purple-400">$${((1000 * cashbackRate / 100 * 12) - annualFeeNum).toFixed(0)}</div>
          <div class="text-xs text-gray-500">per year</div>
        </div>
      </div>
      ${feeNote ? `<p class="text-xs text-gray-500 mt-3 italic">* ${feeNote}</p>` : ''}
    </div>
    <script>
    function updateCalc${card.id}(spend) {
      spend = parseFloat(spend);
      document.getElementById('calc-spend-val-${card.id}').textContent = '$' + spend.toLocaleString();
      const cashback = spend * ${cashbackRate} / 100;
      const monthlyFee = ${annualFeeNum} / 12;
      const net = cashback - monthlyFee;
      const annual = (cashback * 12) - ${annualFeeNum};
      document.getElementById('calc-cashback-${card.id}').textContent = '$' + Math.round(cashback).toLocaleString();
      document.getElementById('calc-fee-${card.id}').textContent = '-$' + Math.round(monthlyFee).toLocaleString();
      const netEl = document.getElementById('calc-net-${card.id}');
      netEl.textContent = (net >= 0 ? '$' : '-$') + Math.abs(Math.round(net)).toLocaleString();
      netEl.className = 'text-xl font-bold ' + (net >= 0 ? 'text-green-400' : 'text-red-400');
      const annualEl = document.getElementById('calc-annual-${card.id}');
      annualEl.textContent = (annual >= 0 ? '$' : '-$') + Math.abs(Math.round(annual)).toLocaleString();
      annualEl.className = 'text-xl font-bold ' + (annual >= 0 ? 'text-green-400' : 'text-red-400');
    }
    </script>
  </section>`;
}

// Generate static HTML for a card
function generateCardHTML(card) {
  const slug = getCardSlug(card);
  const ratingsData = cardRatingsData[card.name] || {};
  const rating = ratingsData.composite || 3.5;
  
  // Category and archetype labels
  const categoryLabels = { 
    cryptoNative: 'Crypto-Native', 
    onchain: 'Onchain', 
    neobank: 'Neobank' 
  };
  const archetypeLabels = { 
    exchange: 'Exchange', 
    wallet: 'Wallet', 
    defi: 'DeFi', 
    stablecoin: 'Stablecoin', 
    bank: 'Bank' 
  };

  const categoryLabel = categoryLabels[card.category] || card.category;
  const archetypeLabel = archetypeLabels[card.archetype] || card.archetype;
  
  // SEO Data (basic for now, can be enhanced)
  const seoData = {
    overview: `${card.name} is a ${categoryLabel.toLowerCase()} crypto card offering ${card.cashback} cashback in ${card.cashbackToken || 'crypto'}. ${card.custody === 'Non-Custodial' ? 'Self-custody' : 'Custodial'} solution on ${card.chain} with ${card.fxFee} FX fees.`,
    pros: [
      card.cashback !== '0%' ? `${card.cashback} cashback rewards` : null,
      card.fxFee === '0%' ? 'No foreign exchange fees' : null,
      card.custody === 'Non-Custodial' ? 'Self-custody (you own your keys)' : null,
      card.annualFee === '$0' ? 'No annual fee' : null,
      card.features ? card.features[0] : null
    ].filter(Boolean),
    cons: [
      card.fxFee !== '0%' ? `${card.fxFee} FX fees` : null,
      card.annualFee !== '$0' ? `${card.annualFee} annual fee` : null,
      card.regions?.length === 1 ? `Limited to ${card.regions[0]} region` : null,
      !card.website ? 'Website not available' : null
    ].filter(Boolean),
    faqs: [
      {
        question: `What is ${card.name}?`,
        answer: `${card.name} is a ${categoryLabel.toLowerCase()} crypto debit card that allows you to spend your cryptocurrency at merchants worldwide. It operates on the ${card.network} network and supports ${card.chain} blockchain.`
      },
      {
        question: `How much cashback does ${card.name} offer?`,
        answer: `${card.name} offers ${card.cashback} cashback rewards ${card.cashbackToken ? `in ${card.cashbackToken}` : 'in cryptocurrency'}.`
      },
      {
        question: `Is ${card.name} self-custody?`,
        answer: `${card.name} is ${card.custody.toLowerCase()}, meaning ${card.custody === 'Non-Custodial' ? 'you maintain control of your private keys and funds' : 'the platform holds and manages your cryptocurrency'}.`
      },
      {
        question: `Where can I use ${card.name}?`,
        answer: `${card.name} is available in ${card.regions ? card.regions.join(', ') : 'select regions'} and can be used anywhere ${card.network} is accepted.`
      }
    ]
  };

  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${card.name} Crypto Card`,
    "description": seoData.overview,
    "image": card.logo,
    "brand": {
      "@type": "Brand",
      "name": card.name
    },
    "category": "Cryptocurrency Debit Card",
    "offers": {
      "@type": "Offer",
      "price": card.annualFee === '$0' ? 0 : card.annualFee,
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": ratingsData.reviews || 100,
      "bestRating": 5,
      "worstRating": 1
    },
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Network", "value": card.network },
      { "@type": "PropertyValue", "name": "Cashback", "value": card.cashback },
      { "@type": "PropertyValue", "name": "FX Fee", "value": card.fxFee },
      { "@type": "PropertyValue", "name": "Custody", "value": card.custody }
    ]
  };

  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://spendbase.cards"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Cards",
        "item": "https://spendbase.cards/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": card.name,
        "item": `https://spendbase.cards/card/${slug}/`
      }
    ]
  };

  // FAQ structured data
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": seoData.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO Meta Tags -->
  <title>${card.name} Crypto Card Review 2026 | ${card.cashback} Cashback | Spendbase</title>
  <meta name="description" content="${seoData.overview} Read our comprehensive review of ${card.name}.">
  <meta name="keywords" content="${card.name.toLowerCase()}, crypto card, ${card.cashbackToken ? card.cashbackToken.toLowerCase() : 'cryptocurrency'} card, ${card.network.toLowerCase()} card, ${card.custody.toLowerCase()} crypto card">
  <meta name="author" content="Spendbase">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://spendbase.cards/card/${slug}/">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://spendbase.cards/card/${slug}/">
  <meta property="og:title" content="${card.name} Crypto Card Review | ${card.cashback} Cashback">
  <meta property="og:description" content="${seoData.overview}">
  <meta property="og:image" content="${card.logo}">
  <meta property="og:site_name" content="Spendbase">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@spendbasecards">
  <meta name="twitter:url" content="https://spendbase.cards/card/${slug}/">
  <meta name="twitter:title" content="${card.name} Crypto Card Review | ${card.cashback} Cashback">
  <meta name="twitter:description" content="${seoData.overview}">
  <meta name="twitter:image" content="${card.logo}">
  
  <link rel="icon" type="image/png" href="https://imagedelivery.net/uYHlHjMhbvNHB1x4JZscLw/cc680d90-ee94-499a-2074-50ec819a2000/public">
  
  <!-- Structured Data - Product -->
  <script type="application/ld+json">
  ${JSON.stringify(structuredData, null, 2)}
  </script>
  
  <!-- Structured Data - Breadcrumbs -->
  <script type="application/ld+json">
  ${JSON.stringify(breadcrumbData, null, 2)}
  </script>
  
  <!-- Structured Data - FAQ -->
  <script type="application/ld+json">
  ${JSON.stringify(faqData, null, 2)}
  </script>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <style>
    .kosh-gradient { background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 25%, #45B7D1 50%, #96CEB4 75%, #FFEAA7 100%); }
    .bleap-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .redotpay-gradient { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); }
    .holographic { background: linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ee82ee, #98fb98, #ff69b4); }
  </style>
</head>

<body class="bg-gray-950 text-white min-h-screen">
  <!-- Header -->
  <header class="border-b border-gray-800">
    <div class="container mx-auto px-4 py-4">
      <nav class="flex items-center justify-between">
        <a href="/" class="flex items-center space-x-2">
          <img src="https://imagedelivery.net/uYHlHjMhbvNHB1x4JZscLw/cc680d90-ee94-499a-2074-50ec819a2000/public" alt="Spendbase" class="h-8 w-8">
          <span class="text-xl font-bold">Spendbase</span>
        </a>
        <a href="/" class="text-blue-400 hover:text-blue-300">← Back to all cards</a>
      </nav>
    </div>
  </header>

  <!-- Breadcrumbs -->
  <div class="container mx-auto px-4 py-3">
    <nav class="text-sm text-gray-400">
      <a href="/" class="hover:text-white">Home</a> > 
      ${card.brand === 'KAST' ? '<a href="/card/kast/" class="hover:text-white ml-1">KAST Cards</a> > ' : '<a href="/" class="hover:text-white ml-1">Cards</a> > '}
      <span class="text-white ml-1">${card.name}</span>
    </nav>
  </div>

  ${generateKastBanner(card)}

  <main class="container mx-auto px-4 py-8">
    <article>
      <!-- Hero Section -->
      <header class="mb-8">
        <div class="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
          <div class="flex items-center space-x-4">
            <img src="${card.logo}" alt="${card.name}" class="w-16 h-16 md:w-20 md:h-20 rounded-lg">
            <div>
              <h1 class="text-3xl md:text-4xl font-bold">${card.name}</h1>
              <div class="flex items-center space-x-3 mt-2">
                <span class="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">${categoryLabel}</span>
                <span class="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">${archetypeLabel}</span>
                ${card.comingSoon ? '<span class="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">Coming Soon</span>' : ''}
              </div>
            </div>
          </div>
          
          <!-- Rating -->
          <div class="flex items-center space-x-2 ml-auto">
            <div class="flex">
              ${Array.from({length: 5}, (_, i) => 
                `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="${i <= Math.round(rating) ? '#FBBF24' : '#374151'}">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>`
              ).join('')}
            </div>
            <span class="text-white/80">${rating.toFixed(1)} Score</span>
          </div>
        </div>
        
        <!-- Card Image -->
        ${card.cardImage ? `
        <div class="my-6">
          <img src="${card.cardImage}" alt="${card.name} card" class="max-w-sm w-full rounded-2xl shadow-xl">
        </div>
        ` : ''}
        
        <!-- Quick Actions -->
        <div class="flex flex-wrap gap-3">
          ${card.website ? `<a href="${card.website}" target="_blank" rel="nofollow" class="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">Visit Website</a>` : ''}
          <a href="/?compare=${card.id}" class="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold">View Interactive Comparison →</a>
        </div>
      </header>

      ${generateKastTierNav(card)}

      <!-- Key Specs Table -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Key Specifications</h2>
        <div class="bg-gray-900/50 rounded-lg overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div class="p-4 border-r border-b border-gray-700">
              <div class="text-gray-400 text-sm">Network</div>
              <div class="font-semibold">${card.network}</div>
            </div>
            <div class="p-4 border-r border-b border-gray-700">
              <div class="text-gray-400 text-sm">Category</div>
              <div class="font-semibold">${categoryLabel}</div>
            </div>
            <div class="p-4 border-r border-b border-gray-700">
              <div class="text-gray-400 text-sm">Custody</div>
              <div class="font-semibold">${card.custody}</div>
            </div>
            <div class="p-4 border-b border-gray-700">
              <div class="text-gray-400 text-sm">Chain</div>
              <div class="font-semibold">${card.chain}</div>
            </div>
            <div class="p-4 border-r border-b border-gray-700">
              <div class="text-gray-400 text-sm">Regions</div>
              <div class="font-semibold">${card.regions ? card.regions.join(', ') : 'Not specified'}</div>
            </div>
            <div class="p-4 border-r border-b border-gray-700">
              <div class="text-gray-400 text-sm">Cashback</div>
              <div class="font-semibold">${card.cashback}${card.cashbackToken ? ` in ${card.cashbackToken}` : ''}</div>
            </div>
            <div class="p-4 border-r border-b border-gray-700">
              <div class="text-gray-400 text-sm">FX Fee</div>
              <div class="font-semibold">${card.fxFee}</div>
            </div>
            <div class="p-4 border-b border-gray-700">
              <div class="text-gray-400 text-sm">Annual Fee</div>
              <div class="font-semibold">${card.annualFee}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Overview -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Overview</h2>
        <div class="prose prose-invert max-w-none">
          <p class="text-gray-300 text-lg leading-relaxed">${seoData.overview}</p>
        </div>
      </section>

      <!-- Pros & Cons -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-6">Pros & Cons</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <h3 class="text-xl font-semibold text-green-400 mb-4">✓ Pros</h3>
            <ul class="space-y-2">
              ${seoData.pros.map(pro => `<li class="text-green-300">• ${pro}</li>`).join('')}
            </ul>
          </div>
          <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <h3 class="text-xl font-semibold text-red-400 mb-4">✗ Cons</h3>
            <ul class="space-y-2">
              ${seoData.cons.map(con => `<li class="text-red-300">• ${con}</li>`).join('')}
            </ul>
          </div>
        </div>
      </section>

      <!-- Features & Perks -->
      ${card.features ? `
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Features</h2>
        <div class="grid md:grid-cols-2 gap-4">
          ${card.features.map(feature => 
            `<div class="bg-gray-800/50 p-4 rounded-lg">
              <span class="text-blue-400">✓</span> ${feature}
            </div>`
          ).join('')}
        </div>
      </section>
      ` : ''}

      ${card.perks ? `
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Key Benefits</h2>
        <div class="grid md:grid-cols-2 gap-4">
          ${card.perks.map(perk => 
            `<div class="bg-gray-800/50 p-4 rounded-lg">
              <span class="text-green-400">★</span> ${perk}
            </div>`
          ).join('')}
        </div>
      </section>
      ` : ''}

      <!-- Token Info -->
      ${card.token ? `
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Token Information</h2>
        <div class="bg-gray-900/50 p-6 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-semibold">${card.token.ticker}</h3>
              <p class="text-gray-400">${card.name} Token</p>
            </div>
            ${card.token.live && card.token.cmc ? 
              `<a href="https://coinmarketcap.com/currencies/${card.token.cmc}/" target="_blank" rel="nofollow" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">
                View on CoinMarketCap →
              </a>` : 
              card.token.live ? 
                '<span class="px-4 py-2 bg-green-500/20 text-green-300 rounded text-sm">Live Token</span>' : 
                '<span class="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded text-sm">Token Coming Soon</span>'
            }
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Ratings -->
      ${Object.keys(ratingsData).length > 0 ? `
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">User Ratings</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${ratingsData.ios ? `
          <div class="bg-gray-800/50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-blue-400">${ratingsData.ios.toFixed(1)}</div>
            <div class="text-sm text-gray-400">iOS App Store</div>
          </div>
          ` : ''}
          ${ratingsData.android ? `
          <div class="bg-gray-800/50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-green-400">${ratingsData.android.toFixed(1)}</div>
            <div class="text-sm text-gray-400">Google Play</div>
          </div>
          ` : ''}
          ${ratingsData.trustpilot ? `
          <div class="bg-gray-800/50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold ${ratingsData.trustpilot >= 4 ? 'text-green-400' : ratingsData.trustpilot >= 3 ? 'text-yellow-400' : 'text-red-400'}">${ratingsData.trustpilot.toFixed(1)}</div>
            <div class="text-sm text-gray-400">Trustpilot</div>
          </div>
          ` : ''}
          <div class="bg-gray-800/50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-purple-400">${rating.toFixed(1)}</div>
            <div class="text-sm text-gray-400">Spendbase Score</div>
          </div>
        </div>
      </section>
      ` : ''}

      ${generateRealReturnCalc(card)}

      <!-- FAQ -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div class="space-y-4">
          ${seoData.faqs.map(faq => `
          <details class="bg-gray-800/50 rounded-lg overflow-hidden">
            <summary class="p-4 cursor-pointer hover:bg-gray-700/50 font-semibold">${faq.question}</summary>
            <div class="p-4 pt-0 text-gray-300 border-t border-gray-700">${faq.answer}</div>
          </details>
          `).join('')}
        </div>
      </section>

      <!-- Call to Action -->
      <section class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
        <h2 class="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p class="text-lg mb-6">Compare ${card.name} with other crypto cards to find your perfect match.</p>
        <div class="space-x-4">
          <a href="/" class="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block">Compare All Cards</a>
          ${card.website ? `<a href="${card.website}" target="_blank" rel="nofollow" class="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 inline-block">Visit ${card.name} →</a>` : ''}
        </div>
      </section>
    </article>
  </main>

  <!-- Footer -->
  <footer class="border-t border-gray-800 mt-16">
    <div class="container mx-auto px-4 py-8">
      <div class="grid md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center space-x-2 mb-4">
            <img src="https://imagedelivery.net/uYHlHjMhbvNHB1x4JZscLw/cc680d90-ee94-499a-2074-50ec819a2000/public" alt="Spendbase" class="h-6 w-6">
            <span class="font-bold">Spendbase</span>
          </div>
          <p class="text-gray-400 text-sm">The leading crypto card comparison platform.</p>
        </div>
        <div>
          <h4 class="font-semibold mb-3">Compare</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="/" class="hover:text-white">All Cards</a></li>
            <li><a href="/?category=cryptoNative" class="hover:text-white">Crypto-Native Cards</a></li>
            <li><a href="/?category=onchain" class="hover:text-white">Self-Custody Cards</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-3">Learn</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="/learn" class="hover:text-white">Crypto Card Guide</a></li>
            <li><a href="/ratings" class="hover:text-white">Card Ratings</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-3">Community</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="https://x.com/spendbasecards" target="_blank" class="hover:text-white">Twitter</a></li>
            <li><a href="https://t.me/SpendbaseCards" target="_blank" class="hover:text-white">Telegram</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
        <p>&copy; 2026 Spendbase. Compare crypto cards responsibly.</p>
      </div>
    </div>
  </footer>
</body>
</html>`;

  return html;
}

// Create card directories and generate HTML files
let generatedCount = 0;
let errors = [];

for (const card of allCards) {
  try {
    const slug = getCardSlug(card);
    const dirPath = path.join('./card', slug);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Generate and write HTML file
    const html = generateCardHTML(card);
    const filePath = path.join(dirPath, 'index.html');
    fs.writeFileSync(filePath, html);
    
    generatedCount++;
    console.log(`✓ Generated: /card/${slug}/index.html`);
    
    // Show sample for first card
    if (generatedCount === 1) {
      console.log(`\n📄 Sample page structure for ${card.name}:`);
      console.log(`   URL: https://spendbase.cards/card/${slug}/`);
      console.log(`   Size: ${(html.length / 1024).toFixed(1)}KB`);
      console.log(`   Features: SEO meta tags, structured data, responsive design\n`);
    }
    
  } catch (error) {
    errors.push({ card: card.name, error: error.message });
    console.error(`✗ Error generating ${card.name}: ${error.message}`);
  }
}

console.log(`\n🎉 Generation complete!`);
console.log(`   ✅ Successfully generated: ${generatedCount} cards`);
console.log(`   ❌ Errors: ${errors.length}`);

if (errors.length > 0) {
  console.log('\nErrors encountered:');
  errors.forEach(err => console.log(`   - ${err.card}: ${err.error}`));
}

console.log(`\nNext steps:`);
console.log(`   1. Review sample pages in /card/{slug}/index.html`);
console.log(`   2. Test a few pages locally`);
console.log(`   3. Deploy to GitHub using the API`);
console.log(`   4. Update sitemap.xml to include all card URLs`);