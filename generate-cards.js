const fs = require('fs');
const path = require('path');

console.log('🚀 Generating static HTML pages for crypto cards (v2 - SPA-matching design)...\n');

// Read the main HTML file to extract card data
const htmlContent = fs.readFileSync('./index.html', 'utf8');

// Extract allCards array
const allCardsStart = htmlContent.indexOf('const allCards = [');
const allCardsEnd = htmlContent.indexOf('];', allCardsStart) + 2;
const allCardsCode = htmlContent.substring(allCardsStart, allCardsEnd);

// Extract cardRatingsData object
const ratingsStart = htmlContent.indexOf('const cardRatingsData = {');
const ratingsEnd = htmlContent.indexOf('};', ratingsStart) + 2;
const ratingsCode = htmlContent.substring(ratingsStart, ratingsEnd);

let allCards, cardRatingsData;
try {
  const getAllCards = new Function('return ' + allCardsCode.replace('const allCards = ', ''));
  const getRatingsData = new Function('return ' + ratingsCode.replace('const cardRatingsData = ', ''));
  allCards = getAllCards();
  cardRatingsData = getRatingsData();
  console.log(`✅ Parsed ${allCards.length} cards`);
} catch (error) {
  console.error('Parse error:', error.message);
  process.exit(1);
}

function getCardSlug(card) {
  return card.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Generate SPA-matching HTML for a card
function generateCardHTML(card) {
  const slug = getCardSlug(card);
  const ratingsData = cardRatingsData[card.name] || {};
  const rating = ratingsData.composite || 3.5;
  
  const categoryLabels = { cryptoNative: 'Crypto-Native', onchain: 'Onchain', neobank: 'Neobank', exchange: 'Exchange', fintech: 'Fintech' };
  const archetypeLabels = { exchange: 'Exchange', wallet: 'Wallet', defi: 'DeFi', stablecoin: 'Stablecoin', bank: 'Bank', fintech: 'Fintech' };
  const categoryLabel = categoryLabels[card.category] || card.category || '';
  const archetypeLabel = archetypeLabels[card.archetype] || card.archetype || '';
  
  const xHandle = card.xHandle || card.tg || '';
  const xAvatarUrl = xHandle ? `https://unavatar.io/x/${xHandle}` : card.logo;
  const xBanner = card.xBanner || '';
  
  // Background gradient
  let bgStyle = '';
  if (card.bg === 'holographic') {
    bgStyle = 'background: linear-gradient(135deg, #a8edea 0%, #fed6e3 25%, #d299c2 50%, #a8c0ff 75%, #c2ffd8 100%);';
  } else if (card.bg?.includes('from-')) {
    // Convert Tailwind gradient to CSS
    const fromMatch = card.bg.match(/from-\[([^\]]+)\]/);
    const toMatch = card.bg.match(/to-\[([^\]]+)\]/);
    if (fromMatch && toMatch) {
      bgStyle = `background: linear-gradient(135deg, ${fromMatch[1]} 0%, ${toMatch[1]} 100%);`;
    } else {
      bgStyle = 'background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);';
    }
  } else {
    bgStyle = 'background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);';
  }

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${card.name} Crypto Card`,
    "description": `${card.name} is a ${card.custody?.toLowerCase() || ''} crypto card on ${card.chain || 'multi-chain'} offering ${card.cashback || 'TBD'} cashback.`,
    "image": card.cardImage || card.logo,
    "brand": { "@type": "Brand", "name": card.brand || card.name },
    "offers": { "@type": "Offer", "price": 0, "priceCurrency": "USD" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": rating, "reviewCount": 100 }
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${card.name} Crypto Card Review 2026 | ${card.cashback || 'TBD'} Cashback | Spendbase</title>
  <meta name="description" content="${card.name} offers ${card.cashback || 'TBD'} cashback. ${card.custody || 'Self-custody'} card on ${card.chain || 'multi-chain'} with ${card.fxFee || '0%'} FX fees.">
  <link rel="canonical" href="https://spendbase.cards/card/${slug}/">
  <meta property="og:title" content="${card.name} Crypto Card Review">
  <meta property="og:description" content="${card.cashback || 'TBD'} cashback on ${card.chain || 'multi-chain'}. ${card.custody || ''}.">
  <meta property="og:image" content="${card.cardImage || card.logo}">
  <meta property="og:url" content="https://spendbase.cards/card/${slug}/">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@spendbasecards">
  <link rel="icon" href="https://imagedelivery.net/uYHlHjMhbvNHB1x4JZscLw/cc680d90-ee94-499a-2074-50ec819a2000/public">
  <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .card-gradient { ${bgStyle} }
  </style>
</head>
<body class="bg-gray-950 text-white min-h-screen">
  <!-- Header -->
  <header class="sticky top-0 z-50 backdrop-blur-md bg-gray-950/80 border-b border-gray-800">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <img src="https://imagedelivery.net/uYHlHjMhbvNHB1x4JZscLw/spendbase-icon-v2/public" alt="Spendbase" class="h-8 w-8 rounded-lg">
        <span class="font-bold text-lg hidden sm:inline">Spendbase</span>
      </a>
      <nav class="flex items-center gap-4 text-sm">
        <a href="/#tools" class="text-gray-400 hover:text-white">Tools</a>
        <a href="/#research" class="text-gray-400 hover:text-white">Research</a>
        <a href="/#video-rewards" class="text-gray-400 hover:text-white">Video Rewards</a>
        <a href="/" class="bg-pink-500 hover:bg-pink-600 px-4 py-1.5 rounded-full font-medium">Subscribe</a>
      </nav>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-6">
    <!-- Back Button -->
    <a href="/" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Back to Cards
    </a>

    <!-- Hero Card Section -->
    <div class="rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 mb-6">
      <!-- Banner/Gradient Area -->
      <div class="relative h-48 sm:h-64">
        ${xBanner ? `<img src="${xBanner}" alt="" class="w-full h-full object-cover">` : `<div class="w-full h-full card-gradient"></div>`}
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        
        <!-- X Follow Button -->
        ${xHandle ? `
        <a href="https://x.com/${xHandle}" target="_blank" rel="noopener" class="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 hover:bg-black/70 backdrop-blur rounded-full text-white text-xs font-medium">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Follow
        </a>` : ''}
      </div>

      <!-- Card Visual + Info -->
      <div class="px-6 pb-6 -mt-20 relative">
        <div class="flex flex-col sm:flex-row gap-6">
          <!-- Card Visual -->
          <div class="w-48 h-32 rounded-xl overflow-hidden shadow-2xl border-4 border-gray-900 flex-shrink-0 card-gradient flex items-center justify-center">
            ${card.cardImage ? `<img src="${card.cardImage}" alt="${card.name}" class="w-full h-full object-cover">` : `
            <div class="text-center p-4">
              <img src="${card.logo}" alt="${card.name}" class="w-12 h-12 mx-auto mb-2 rounded-lg">
              <div class="text-white text-sm font-bold">${card.brand || card.name}</div>
            </div>`}
          </div>
          
          <!-- Name + Rating -->
          <div class="flex-1">
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-2xl font-bold">${card.name}</h1>
                <div class="flex items-center gap-2 mt-1 flex-wrap">
                  ${categoryLabel ? `<span class="px-2 py-0.5 bg-lime-500/20 text-lime-400 rounded text-xs font-medium">${categoryLabel}</span>` : ''}
                  ${archetypeLabel ? `<span class="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">${archetypeLabel}</span>` : ''}
                </div>
              </div>
              <div class="text-right">
                <div class="flex items-center gap-1">
                  ${[1,2,3,4,5].map(i => `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="${i <= Math.round(rating) ? '#FBBF24' : '#374151'}"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`).join('')}
                </div>
                <div class="text-xs text-gray-400 mt-0.5">${rating.toFixed(1)} Score</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div class="bg-gray-800/50 rounded-lg p-3 text-center">
            <div class="text-xs text-gray-400 mb-1">Cashback</div>
            <div class="font-bold text-lg">${card.cashback || 'TBD'}</div>
          </div>
          <div class="bg-gray-800/50 rounded-lg p-3 text-center">
            <div class="text-xs text-gray-400 mb-1">FX Fee</div>
            <div class="font-bold text-lg">${card.fxFee || '0%'}</div>
          </div>
          <div class="bg-gray-800/50 rounded-lg p-3 text-center">
            <div class="text-xs text-gray-400 mb-1">Annual Fee</div>
            <div class="font-bold text-lg">${card.annualFee || 'TBD'}</div>
          </div>
          <div class="bg-gray-800/50 rounded-lg p-3 text-center">
            <div class="text-xs text-gray-400 mb-1">Custody</div>
            <div class="font-bold text-lg ${card.custody === 'Non-Custodial' ? 'text-lime-400' : ''}">${card.custody === 'Non-Custodial' ? 'Self' : 'Custodial'}</div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="flex gap-3 mt-6">
          ${card.website ? `<a href="${card.website}" target="_blank" rel="noopener" class="flex-1 bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold py-3 px-6 rounded-lg text-center flex items-center justify-center gap-2">
            Get Card <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>` : ''}
          ${xHandle ? `<a href="https://x.com/${xHandle}" target="_blank" rel="noopener" class="bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>` : ''}
        </div>
      </div>
    </div>

    <!-- Tabs (Static) -->
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
      <span class="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium text-sm">Overview</span>
      <span class="px-4 py-2 text-gray-400 hover:text-white rounded-lg text-sm cursor-pointer">Ratings</span>
      <span class="px-4 py-2 text-gray-400 hover:text-white rounded-lg text-sm cursor-pointer">Reviews</span>
      <span class="px-4 py-2 text-gray-400 hover:text-white rounded-lg text-sm cursor-pointer">Where</span>
    </div>

    <!-- Best For Section -->
    ${card.perks && card.perks.length > 0 ? `
    <section class="mb-8">
      <h2 class="text-xl font-bold mb-4">Best For</h2>
      <div class="flex flex-wrap gap-2">
        ${card.perks.map(perk => `<span class="px-3 py-1.5 bg-gray-800 rounded-full text-sm">${perk}</span>`).join('')}
      </div>
    </section>` : ''}

    <!-- Features Section -->
    ${card.features && card.features.length > 0 ? `
    <section class="mb-8">
      <h2 class="text-xl font-bold mb-4">Key Features</h2>
      <div class="grid sm:grid-cols-2 gap-3">
        ${card.features.map(feature => `
        <div class="flex items-start gap-3 bg-gray-900/50 p-4 rounded-lg">
          <svg class="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span>${feature}</span>
        </div>`).join('')}
      </div>
    </section>` : ''}

    <!-- Specs Table -->
    <section class="mb-8">
      <h2 class="text-xl font-bold mb-4">Specifications</h2>
      <div class="bg-gray-900/50 rounded-lg overflow-hidden">
        <div class="grid grid-cols-2 sm:grid-cols-4 text-sm">
          <div class="p-4 border-b border-r border-gray-800"><div class="text-gray-400 text-xs mb-1">Network</div><div class="font-medium">${card.network || 'TBD'}</div></div>
          <div class="p-4 border-b border-r border-gray-800"><div class="text-gray-400 text-xs mb-1">Chain</div><div class="font-medium">${card.chain || 'Multi-chain'}</div></div>
          <div class="p-4 border-b border-r border-gray-800"><div class="text-gray-400 text-xs mb-1">Regions</div><div class="font-medium">${(card.regions || ['Global']).join(', ')}</div></div>
          <div class="p-4 border-b border-gray-800"><div class="text-gray-400 text-xs mb-1">Cashback Token</div><div class="font-medium">${card.cashbackToken || 'TBD'}</div></div>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="bg-gradient-to-r from-lime-500/20 to-green-500/20 border border-lime-500/30 rounded-2xl p-6 text-center">
      <h3 class="text-xl font-bold mb-2">Ready to get started?</h3>
      <p class="text-gray-400 mb-4">Compare ${card.name} with other cards or apply directly.</p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        ${card.website ? `<a href="${card.website}" target="_blank" class="bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold py-3 px-8 rounded-lg">Get ${card.name}</a>` : ''}
        <a href="/" class="bg-gray-800 hover:bg-gray-700 py-3 px-8 rounded-lg font-medium">Compare Cards</a>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="border-t border-gray-800 mt-12 py-8">
    <div class="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
      <p>© 2026 Spendbase. Crypto card comparison platform.</p>
      <p class="mt-2">Not financial advice. DYOR.</p>
    </div>
  </footer>
</body>
</html>`;
}

// Generate all card pages
let successCount = 0;
let errorCount = 0;

for (const card of allCards) {
  const slug = getCardSlug(card);
  const dir = `./card/${slug}`;
  
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const html = generateCardHTML(card);
    fs.writeFileSync(`${dir}/index.html`, html);
    console.log(`✓ Generated: /card/${slug}/index.html`);
    successCount++;
  } catch (error) {
    console.error(`✗ Error generating ${card.name}: ${error.message}`);
    errorCount++;
  }
}

console.log(`\n🎉 Generation complete!`);
console.log(`   ✅ Successfully generated: ${successCount} cards`);
console.log(`   ❌ Errors: ${errorCount}`);
