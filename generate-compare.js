const fs = require('fs');
const path = require('path');

console.log('🔄 Generating SEO-friendly compare pages for crypto cards...\n');

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

// Helper functions
function getCardSlug(card) {
  return card.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function getVsSlug(card1, card2) {
  const slug1 = getCardSlug(card1);
  const slug2 = getCardSlug(card2);
  // Sort alphabetically for consistent URLs
  return slug1 < slug2 ? `${slug1}-vs-${slug2}` : `${slug2}-vs-${slug1}`;
}

function getCardRating(card) {
  const data = cardRatingsData[card.name];
  return data?.composite || 3.5;
}

function parsePercentage(val) {
  if (!val || val === 'TBD' || val === 'N/A') return 0;
  const match = String(val).match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function getCashbackValue(card) {
  if (!card.cashback || card.cashback === 'TBD' || card.cashback === 'N/A') return 0;
  const match = String(card.cashback).match(/(\d+(?:\.\d+)?)/g);
  if (!match) return 0;
  // Return the highest cashback value
  return Math.max(...match.map(Number));
}

function getFxFeeValue(card) {
  return parsePercentage(card.fxFee);
}

// Determine winner for a metric (lower is better for fees, higher for cashback/rating)
function getWinner(card1, card2, metric) {
  let val1, val2;
  let lowerIsBetter = false;
  
  switch (metric) {
    case 'cashback':
      val1 = getCashbackValue(card1);
      val2 = getCashbackValue(card2);
      break;
    case 'fxFee':
      val1 = getFxFeeValue(card1);
      val2 = getFxFeeValue(card2);
      lowerIsBetter = true;
      break;
    case 'rating':
      val1 = getCardRating(card1);
      val2 = getCardRating(card2);
      break;
    default:
      return null;
  }
  
  if (val1 === val2) return 'tie';
  if (lowerIsBetter) {
    return val1 < val2 ? card1.name : card2.name;
  }
  return val1 > val2 ? card1.name : card2.name;
}

// Generate star rating HTML
function generateStars(rating) {
  return [1,2,3,4,5].map(i => 
    `<svg class="w-4 h-4 inline" viewBox="0 0 24 24" fill="${i <= Math.round(rating) ? '#FBBF24' : '#374151'}"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
  ).join('');
}

// Common header HTML
function getHeaderHTML() {
  return `
  <header class="sticky top-0 z-50 backdrop-blur-md bg-gray-950/80 border-b border-gray-800">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <img src="https://imagedelivery.net/uYHlHjMhbvNHB1x4JZscLw/spendbase-icon-v2/public" alt="Spendbase" class="h-8 w-8 rounded-lg">
        <span class="font-bold text-lg hidden sm:inline">Spendbase</span>
      </a>
      <nav class="flex items-center gap-4 text-sm">
        <a href="/#tools" class="text-gray-400 hover:text-white">Tools</a>
        <a href="/#research" class="text-gray-400 hover:text-white">Research</a>
        <a href="/compare/" class="text-gray-400 hover:text-white">Compare</a>
        <a href="/" class="bg-pink-500 hover:bg-pink-600 px-4 py-1.5 rounded-full font-medium">Subscribe</a>
      </nav>
    </div>
  </header>`;
}

// Common footer HTML
function getFooterHTML() {
  return `
  <footer class="border-t border-gray-800 mt-12 py-8">
    <div class="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
      <p>© 2026 Spendbase. Crypto card comparison platform.</p>
      <p class="mt-2">Not financial advice. DYOR.</p>
    </div>
  </footer>`;
}

// Generate head-to-head comparison page
function generateVsPage(card1, card2) {
  const slug = getVsSlug(card1, card2);
  const rating1 = getCardRating(card1);
  const rating2 = getCardRating(card2);
  const cashbackWinner = getWinner(card1, card2, 'cashback');
  const fxFeeWinner = getWinner(card1, card2, 'fxFee');
  const ratingWinner = getWinner(card1, card2, 'rating');
  
  const title = `${card1.name} vs ${card2.name} Comparison 2026 | Spendbase`;
  const description = `Compare ${card1.name} and ${card2.name} crypto cards. See cashback rates, FX fees, custody type, and features side-by-side.`;
  
  // Structured data for comparison
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "Product",
          "position": 1,
          "name": `${card1.name} Crypto Card`,
          "description": `${card1.name} offers ${card1.cashback || 'TBD'} cashback with ${card1.custody || 'custodial'} custody.`,
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": rating1, "reviewCount": 100 }
        },
        {
          "@type": "Product",
          "position": 2,
          "name": `${card2.name} Crypto Card`,
          "description": `${card2.name} offers ${card2.cashback || 'TBD'} cashback with ${card2.custody || 'custodial'} custody.`,
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": rating2, "reviewCount": 100 }
        }
      ]
    }
  };
  
  // FAQ structured data
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Which is better: ${card1.name} or ${card2.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Both cards have their strengths. ${card1.name} offers ${card1.cashback || 'competitive'} cashback on ${card1.chain || 'multiple chains'}, while ${card2.name} provides ${card2.cashback || 'competitive'} cashback on ${card2.chain || 'multiple chains'}. Your choice depends on which blockchain ecosystem you prefer and whether you value ${card1.custody === 'Non-Custodial' ? 'self-custody' : 'convenience'} or ${card2.custody === 'Non-Custodial' ? 'self-custody' : 'convenience'}.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the cashback difference between ${card1.name} and ${card2.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${card1.name} offers ${card1.cashback || 'TBD'} cashback in ${card1.cashbackToken || 'crypto'}, while ${card2.name} offers ${card2.cashback || 'TBD'} cashback in ${card2.cashbackToken || 'crypto'}.`
        }
      },
      {
        "@type": "Question",
        "name": `Are ${card1.name} and ${card2.name} self-custody cards?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${card1.name} is ${card1.custody === 'Non-Custodial' ? 'a self-custody (non-custodial) card where you control your keys' : 'a custodial card where the provider holds your funds'}. ${card2.name} is ${card2.custody === 'Non-Custodial' ? 'a self-custody (non-custodial) card' : 'a custodial card'}.`
        }
      }
    ]
  };

  const winnerBadge = (cardName) => cardName !== 'tie' ? 
    `<span class="ml-2 px-2 py-0.5 bg-lime-500/20 text-lime-400 text-xs rounded font-medium">Winner</span>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://spendbase.cards/compare/${slug}/">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="https://spendbase.cards/compare/${slug}/">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="https://imagedelivery.net/uYHlHjMhbvNHB1x4JZscLw/cc680d90-ee94-499a-2074-50ec819a2000/public">
  <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
  <script type="application/ld+json">${JSON.stringify(faqData)}</script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-950 text-white min-h-screen">
  ${getHeaderHTML()}

  <main class="max-w-4xl mx-auto px-4 py-6">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <a href="/" class="hover:text-white">Home</a>
      <span>/</span>
      <a href="/compare/" class="hover:text-white">Compare</a>
      <span>/</span>
      <span class="text-white">${card1.name} vs ${card2.name}</span>
    </nav>

    <!-- Hero -->
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">${card1.name} vs ${card2.name}</h1>
      <p class="text-gray-400 text-lg">Complete comparison of features, fees, and rewards</p>
    </div>

    <!-- Quick Summary Cards -->
    <div class="grid md:grid-cols-2 gap-4 mb-8">
      <!-- Card 1 Summary -->
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-4">
          <img src="${card1.logo}" alt="${card1.name}" class="w-12 h-12 rounded-lg object-cover">
          <div>
            <h2 class="font-bold text-lg">${card1.name}</h2>
            <div class="flex items-center gap-1">${generateStars(rating1)}<span class="text-sm text-gray-400 ml-1">${rating1.toFixed(1)}</span></div>
          </div>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-gray-400">Cashback</span><span class="font-medium">${card1.cashback || 'TBD'}</span></div>
          <div class="flex justify-between"><span class="text-gray-400">FX Fee</span><span class="font-medium">${card1.fxFee || '0%'}</span></div>
          <div class="flex justify-between"><span class="text-gray-400">Custody</span><span class="font-medium ${card1.custody === 'Non-Custodial' ? 'text-lime-400' : ''}">${card1.custody || 'Custodial'}</span></div>
          <div class="flex justify-between"><span class="text-gray-400">Chain</span><span class="font-medium">${card1.chain || 'Multi-chain'}</span></div>
        </div>
        <a href="/card/${getCardSlug(card1)}/" class="block mt-4 text-center bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm font-medium">View Full Details →</a>
      </div>

      <!-- Card 2 Summary -->
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-4">
          <img src="${card2.logo}" alt="${card2.name}" class="w-12 h-12 rounded-lg object-cover">
          <div>
            <h2 class="font-bold text-lg">${card2.name}</h2>
            <div class="flex items-center gap-1">${generateStars(rating2)}<span class="text-sm text-gray-400 ml-1">${rating2.toFixed(1)}</span></div>
          </div>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-gray-400">Cashback</span><span class="font-medium">${card2.cashback || 'TBD'}</span></div>
          <div class="flex justify-between"><span class="text-gray-400">FX Fee</span><span class="font-medium">${card2.fxFee || '0%'}</span></div>
          <div class="flex justify-between"><span class="text-gray-400">Custody</span><span class="font-medium ${card2.custody === 'Non-Custodial' ? 'text-lime-400' : ''}">${card2.custody || 'Custodial'}</span></div>
          <div class="flex justify-between"><span class="text-gray-400">Chain</span><span class="font-medium">${card2.chain || 'Multi-chain'}</span></div>
        </div>
        <a href="/card/${getCardSlug(card2)}/" class="block mt-4 text-center bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm font-medium">View Full Details →</a>
      </div>
    </div>

    <!-- Detailed Comparison Table -->
    <section class="mb-8">
      <h2 class="text-xl font-bold mb-4">Feature Comparison</h2>
      <div class="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800">
        <table class="w-full text-sm">
          <thead class="bg-gray-800/50">
            <tr>
              <th class="text-left p-4 font-medium text-gray-400">Feature</th>
              <th class="text-center p-4 font-medium">${card1.name}</th>
              <th class="text-center p-4 font-medium">${card2.name}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr>
              <td class="p-4 text-gray-400">Cashback Rate</td>
              <td class="p-4 text-center font-medium">${card1.cashback || 'TBD'}${cashbackWinner === card1.name ? winnerBadge(cashbackWinner) : ''}</td>
              <td class="p-4 text-center font-medium">${card2.cashback || 'TBD'}${cashbackWinner === card2.name ? winnerBadge(cashbackWinner) : ''}</td>
            </tr>
            <tr>
              <td class="p-4 text-gray-400">Cashback Token</td>
              <td class="p-4 text-center">${card1.cashbackToken || 'TBD'}</td>
              <td class="p-4 text-center">${card2.cashbackToken || 'TBD'}</td>
            </tr>
            <tr>
              <td class="p-4 text-gray-400">FX Fee</td>
              <td class="p-4 text-center font-medium">${card1.fxFee || '0%'}${fxFeeWinner === card1.name ? winnerBadge(fxFeeWinner) : ''}</td>
              <td class="p-4 text-center font-medium">${card2.fxFee || '0%'}${fxFeeWinner === card2.name ? winnerBadge(fxFeeWinner) : ''}</td>
            </tr>
            <tr>
              <td class="p-4 text-gray-400">Annual Fee</td>
              <td class="p-4 text-center">${card1.annualFee || 'TBD'}</td>
              <td class="p-4 text-center">${card2.annualFee || 'TBD'}</td>
            </tr>
            <tr>
              <td class="p-4 text-gray-400">Custody Type</td>
              <td class="p-4 text-center ${card1.custody === 'Non-Custodial' ? 'text-lime-400' : ''}">${card1.custody || 'Custodial'}</td>
              <td class="p-4 text-center ${card2.custody === 'Non-Custodial' ? 'text-lime-400' : ''}">${card2.custody || 'Custodial'}</td>
            </tr>
            <tr>
              <td class="p-4 text-gray-400">Blockchain</td>
              <td class="p-4 text-center">${card1.chain || 'Multi-chain'}</td>
              <td class="p-4 text-center">${card2.chain || 'Multi-chain'}</td>
            </tr>
            <tr>
              <td class="p-4 text-gray-400">Card Network</td>
              <td class="p-4 text-center">${card1.network || 'Visa'}</td>
              <td class="p-4 text-center">${card2.network || 'Visa'}</td>
            </tr>
            <tr>
              <td class="p-4 text-gray-400">User Rating</td>
              <td class="p-4 text-center font-medium">${rating1.toFixed(1)}/5${ratingWinner === card1.name ? winnerBadge(ratingWinner) : ''}</td>
              <td class="p-4 text-center font-medium">${rating2.toFixed(1)}/5${ratingWinner === card2.name ? winnerBadge(ratingWinner) : ''}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Pros and Cons -->
    <section class="grid md:grid-cols-2 gap-6 mb-8">
      <div>
        <h3 class="font-bold text-lg mb-3">${card1.name} Pros</h3>
        <ul class="space-y-2">
          ${card1.perks?.map(perk => `<li class="flex items-start gap-2"><svg class="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg><span class="text-gray-300">${perk}</span></li>`).join('') || '<li class="text-gray-400">No specific perks listed</li>'}
        </ul>
      </div>
      <div>
        <h3 class="font-bold text-lg mb-3">${card2.name} Pros</h3>
        <ul class="space-y-2">
          ${card2.perks?.map(perk => `<li class="flex items-start gap-2"><svg class="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg><span class="text-gray-300">${perk}</span></li>`).join('') || '<li class="text-gray-400">No specific perks listed</li>'}
        </ul>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="mb-8">
      <h2 class="text-xl font-bold mb-4">Frequently Asked Questions</h2>
      <div class="space-y-4">
        <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <h3 class="font-medium mb-2">Which is better: ${card1.name} or ${card2.name}?</h3>
          <p class="text-gray-400 text-sm">Both cards have their strengths. ${card1.name} offers ${card1.cashback || 'competitive'} cashback on ${card1.chain || 'multiple chains'}, while ${card2.name} provides ${card2.cashback || 'competitive'} cashback on ${card2.chain || 'multiple chains'}. Your choice depends on your preferred blockchain ecosystem and custody preferences.</p>
        </div>
        <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <h3 class="font-medium mb-2">What is the cashback difference?</h3>
          <p class="text-gray-400 text-sm">${card1.name} offers ${card1.cashback || 'TBD'} in ${card1.cashbackToken || 'crypto'}, while ${card2.name} offers ${card2.cashback || 'TBD'} in ${card2.cashbackToken || 'crypto'}.</p>
        </div>
        <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <h3 class="font-medium mb-2">Are these self-custody cards?</h3>
          <p class="text-gray-400 text-sm">${card1.name} is ${card1.custody === 'Non-Custodial' ? 'self-custody' : 'custodial'}. ${card2.name} is ${card2.custody === 'Non-Custodial' ? 'self-custody' : 'custodial'}.</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-2xl p-6 text-center">
      <h3 class="text-xl font-bold mb-2">Ready to choose?</h3>
      <p class="text-gray-400 mb-4">Get the full details on each card or compare more options.</p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <a href="/card/${getCardSlug(card1)}/" class="bg-pink-500 hover:bg-pink-600 py-2 px-6 rounded-lg font-medium">Get ${card1.name}</a>
        <a href="/card/${getCardSlug(card2)}/" class="bg-purple-500 hover:bg-purple-600 py-2 px-6 rounded-lg font-medium">Get ${card2.name}</a>
        <a href="/" class="bg-gray-800 hover:bg-gray-700 py-2 px-6 rounded-lg font-medium">Browse All Cards</a>
      </div>
    </section>
  </main>

  ${getFooterHTML()}
</body>
</html>`;
}

// Generate category comparison page
function generateCategoryPage(category) {
  const { slug, title, description, h1, filter, sortBy, limit } = category;
  
  // Filter and sort cards
  let cards = allCards.filter(filter);
  
  if (sortBy === 'cashback') {
    cards.sort((a, b) => getCashbackValue(b) - getCashbackValue(a));
  } else if (sortBy === 'rating') {
    cards.sort((a, b) => getCardRating(b) - getCardRating(a));
  } else if (sortBy === 'fxFee') {
    cards.sort((a, b) => getFxFeeValue(a) - getFxFeeValue(b));
  }
  
  if (limit) {
    cards = cards.slice(0, limit);
  }
  
  // Schema markup
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": title,
    "description": description,
    "numberOfItems": cards.length,
    "itemListElement": cards.map((card, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": `${card.name} Crypto Card`,
        "description": `${card.name} offers ${card.cashback || 'competitive'} cashback. ${card.custody || 'Custodial'} card on ${card.chain || 'multi-chain'}.`,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": getCardRating(card),
          "reviewCount": 100
        }
      }
    }))
  };

  // FAQ data
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the ${h1.toLowerCase()}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Based on our analysis, ${cards[0]?.name || 'multiple cards'} ${cards.length > 1 ? `and ${cards[1]?.name}` : ''} rank among the top options. We compare cashback rates, fees, custody type, and user ratings.`
        }
      },
      {
        "@type": "Question",
        "name": `How many ${h1.toLowerCase().replace('best ', '')}s are there?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `We track ${cards.length}+ cards in this category, comparing features like cashback, FX fees, and custody type to help you choose.`
        }
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://spendbase.cards/compare/${slug}/">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="https://spendbase.cards/compare/${slug}/">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="https://imagedelivery.net/uYHlHjMhbvNHB1x4JZscLw/cc680d90-ee94-499a-2074-50ec819a2000/public">
  <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
  <script type="application/ld+json">${JSON.stringify(faqData)}</script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-950 text-white min-h-screen">
  ${getHeaderHTML()}

  <main class="max-w-4xl mx-auto px-4 py-6">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <a href="/" class="hover:text-white">Home</a>
      <span>/</span>
      <a href="/compare/" class="hover:text-white">Compare</a>
      <span>/</span>
      <span class="text-white">${h1}</span>
    </nav>

    <!-- Hero -->
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">${h1}</h1>
      <p class="text-gray-400 text-lg">${description}</p>
      <p class="text-sm text-gray-500 mt-2">Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
    </div>

    <!-- Rankings Table -->
    <section class="mb-8">
      <div class="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-800/50">
              <tr>
                <th class="text-left p-4 font-medium text-gray-400">#</th>
                <th class="text-left p-4 font-medium text-gray-400">Card</th>
                <th class="text-center p-4 font-medium text-gray-400">Cashback</th>
                <th class="text-center p-4 font-medium text-gray-400">FX Fee</th>
                <th class="text-center p-4 font-medium text-gray-400">Custody</th>
                <th class="text-center p-4 font-medium text-gray-400">Rating</th>
                <th class="text-center p-4 font-medium text-gray-400"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
              ${cards.map((card, index) => `
              <tr class="hover:bg-gray-800/30">
                <td class="p-4 font-bold ${index === 0 ? 'text-lime-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-500'}">${index + 1}</td>
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <img src="${card.logo}" alt="${card.name}" class="w-10 h-10 rounded-lg object-cover">
                    <div>
                      <div class="font-medium">${card.name}</div>
                      <div class="text-xs text-gray-500">${card.chain || 'Multi-chain'}</div>
                    </div>
                  </div>
                </td>
                <td class="p-4 text-center font-medium">${card.cashback || 'TBD'}</td>
                <td class="p-4 text-center">${card.fxFee || '0%'}</td>
                <td class="p-4 text-center ${card.custody === 'Non-Custodial' ? 'text-lime-400' : ''}">${card.custody === 'Non-Custodial' ? 'Self' : 'Custodial'}</td>
                <td class="p-4 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="#FBBF24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span>${getCardRating(card).toFixed(1)}</span>
                  </div>
                </td>
                <td class="p-4 text-center">
                  <a href="/card/${getCardSlug(card)}/" class="text-pink-400 hover:text-pink-300 text-sm">Details →</a>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Card Details Grid -->
    <section class="mb-8">
      <h2 class="text-xl font-bold mb-4">Card Details</h2>
      <div class="grid gap-4">
        ${cards.slice(0, 5).map((card, index) => `
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <span class="text-2xl font-bold ${index === 0 ? 'text-lime-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-500'}">#${index + 1}</span>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <img src="${card.logo}" alt="${card.name}" class="w-12 h-12 rounded-lg object-cover">
                <div>
                  <h3 class="font-bold text-lg">${card.name}</h3>
                  <div class="flex items-center gap-1">${generateStars(getCardRating(card))}<span class="text-sm text-gray-400 ml-1">${getCardRating(card).toFixed(1)}</span></div>
                </div>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                <div><span class="text-gray-400">Cashback:</span> <span class="font-medium">${card.cashback || 'TBD'}</span></div>
                <div><span class="text-gray-400">FX Fee:</span> <span class="font-medium">${card.fxFee || '0%'}</span></div>
                <div><span class="text-gray-400">Custody:</span> <span class="font-medium ${card.custody === 'Non-Custodial' ? 'text-lime-400' : ''}">${card.custody || 'Custodial'}</span></div>
                <div><span class="text-gray-400">Chain:</span> <span class="font-medium">${card.chain || 'Multi-chain'}</span></div>
              </div>
              ${card.perks ? `
              <div class="flex flex-wrap gap-2 mb-4">
                ${card.perks.slice(0, 3).map(perk => `<span class="px-2 py-1 bg-gray-800 rounded text-xs">${perk}</span>`).join('')}
              </div>` : ''}
              <a href="/card/${getCardSlug(card)}/" class="inline-block bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium">View Full Details →</a>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="mb-8">
      <h2 class="text-xl font-bold mb-4">Frequently Asked Questions</h2>
      <div class="space-y-4">
        <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <h3 class="font-medium mb-2">What is the ${h1.toLowerCase()}?</h3>
          <p class="text-gray-400 text-sm">Based on our analysis, ${cards[0]?.name || 'multiple cards'} ${cards.length > 1 ? `and ${cards[1]?.name}` : ''} rank among the top options. We compare cashback rates, fees, custody type, and user ratings.</p>
        </div>
        <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <h3 class="font-medium mb-2">How many options are available?</h3>
          <p class="text-gray-400 text-sm">We track ${cards.length}+ cards in this category, comparing features like cashback, FX fees, and custody type to help you choose.</p>
        </div>
        <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <h3 class="font-medium mb-2">How do we rank these cards?</h3>
          <p class="text-gray-400 text-sm">Our rankings consider cashback rates, FX fees, custody type (self-custody vs custodial), user ratings, and overall feature set. We update these rankings regularly.</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-gradient-to-r from-lime-500/20 to-green-500/20 border border-lime-500/30 rounded-2xl p-6 text-center">
      <h3 class="text-xl font-bold mb-2">Compare More Cards</h3>
      <p class="text-gray-400 mb-4">Browse our full database of 70+ crypto cards.</p>
      <a href="/" class="inline-block bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold py-3 px-8 rounded-lg">View All Cards</a>
    </section>
  </main>

  ${getFooterHTML()}
</body>
</html>`;
}

// Generate compare index page
function generateCompareIndex(categories, vsPages) {
  const title = 'Compare Crypto Cards 2026 | Spendbase';
  const description = 'Compare the best crypto debit cards side-by-side. Find USDC cards, self-custody cards, high cashback cards, and more.';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://spendbase.cards/compare/">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="https://spendbase.cards/compare/">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="https://imagedelivery.net/uYHlHjMhbvNHB1x4JZscLw/cc680d90-ee94-499a-2074-50ec819a2000/public">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-950 text-white min-h-screen">
  ${getHeaderHTML()}

  <main class="max-w-4xl mx-auto px-4 py-6">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <a href="/" class="hover:text-white">Home</a>
      <span>/</span>
      <span class="text-white">Compare</span>
    </nav>

    <!-- Hero -->
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">Compare Crypto Cards</h1>
      <p class="text-gray-400 text-lg">Find the perfect crypto card with our detailed comparisons</p>
    </div>

    <!-- Category Comparisons -->
    <section class="mb-10">
      <h2 class="text-xl font-bold mb-4">Best Cards by Category</h2>
      <div class="grid sm:grid-cols-2 gap-4">
        ${categories.map(cat => `
        <a href="/compare/${cat.slug}/" class="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors group">
          <h3 class="font-bold text-lg group-hover:text-lime-400 transition-colors">${cat.h1}</h3>
          <p class="text-gray-400 text-sm mt-1">${cat.shortDesc || cat.description.slice(0, 80) + '...'}</p>
          <span class="inline-block mt-3 text-sm text-pink-400">View comparison →</span>
        </a>`).join('')}
      </div>
    </section>

    <!-- Popular Head-to-Head Comparisons -->
    <section class="mb-10">
      <h2 class="text-xl font-bold mb-4">Popular Card Matchups</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${vsPages.slice(0, 12).map(vs => `
        <a href="/compare/${vs.slug}/" class="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
          <div class="flex items-center gap-3">
            <img src="${vs.card1.logo}" alt="" class="w-8 h-8 rounded-lg">
            <span class="text-gray-400 text-sm">vs</span>
            <img src="${vs.card2.logo}" alt="" class="w-8 h-8 rounded-lg">
          </div>
          <p class="text-sm font-medium mt-2">${vs.card1.name} vs ${vs.card2.name}</p>
        </a>`).join('')}
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-2xl p-6 text-center">
      <h3 class="text-xl font-bold mb-2">Can't find what you're looking for?</h3>
      <p class="text-gray-400 mb-4">Browse all 70+ crypto cards in our database.</p>
      <a href="/" class="inline-block bg-pink-500 hover:bg-pink-600 py-3 px-8 rounded-lg font-medium">View All Cards</a>
    </section>
  </main>

  ${getFooterHTML()}
</body>
</html>`;
}

// Define category comparisons
const categories = [
  {
    slug: 'best-usdc-card',
    title: 'Best USDC Card 2026 | Compare Top USDC Spending Cards | Spendbase',
    description: 'Compare the best USDC spending cards. Find crypto cards that support USDC stablecoins with the lowest fees and best cashback.',
    h1: 'Best USDC Cards 2026',
    shortDesc: 'Top cards for spending USDC stablecoins',
    filter: (card) => {
      const chain = (card.chain || '').toLowerCase();
      const token = (card.cashbackToken || '').toLowerCase();
      const features = (card.features || []).join(' ').toLowerCase();
      const perks = (card.perks || []).join(' ').toLowerCase();
      return chain.includes('base') || chain.includes('ethereum') || chain.includes('solana') || 
             chain.includes('multi') || token.includes('usdc') || 
             features.includes('usdc') || features.includes('stablecoin') ||
             perks.includes('usdc') || perks.includes('stablecoin');
    },
    sortBy: 'rating',
    limit: 15
  },
  {
    slug: 'best-self-custody-card',
    title: 'Best Self-Custody Crypto Card 2026 | Non-Custodial Cards | Spendbase',
    description: 'Compare the best self-custody and non-custodial crypto cards. Keep your keys, spend your crypto.',
    h1: 'Best Self-Custody Cards 2026',
    shortDesc: 'Non-custodial cards - your keys, your crypto',
    filter: (card) => card.custody === 'Non-Custodial',
    sortBy: 'rating',
    limit: 15
  },
  {
    slug: 'best-cashback-crypto-card',
    title: 'Best Cashback Crypto Card 2026 | Highest Rewards | Spendbase',
    description: 'Compare crypto cards with the highest cashback rewards. Up to 15% back on purchases in BTC, ETH, and more.',
    h1: 'Best Cashback Crypto Cards 2026',
    shortDesc: 'Highest cashback rewards in crypto',
    filter: (card) => getCashbackValue(card) > 0,
    sortBy: 'cashback',
    limit: 15
  },
  {
    slug: 'best-no-fee-crypto-card',
    title: 'Best No Fee Crypto Card 2026 | 0% FX Fee Cards | Spendbase',
    description: 'Compare crypto cards with 0% FX fees. No foreign transaction fees for international spending.',
    h1: 'Best No Fee Crypto Cards 2026',
    shortDesc: '0% FX fee cards for global spending',
    filter: (card) => getFxFeeValue(card) === 0,
    sortBy: 'rating',
    limit: 15
  },
  {
    slug: 'usdc-spending-card',
    title: 'USDC Spending Card 2026 | Best Cards for USDC | Spendbase',
    description: 'Find the best USDC spending cards. Compare cards that let you spend USDC stablecoins anywhere.',
    h1: 'USDC Spending Cards 2026',
    shortDesc: 'Spend your USDC anywhere',
    filter: (card) => {
      const chain = (card.chain || '').toLowerCase();
      const token = (card.cashbackToken || '').toLowerCase();
      const features = (card.features || []).join(' ').toLowerCase();
      return chain.includes('base') || chain.includes('ethereum') || chain.includes('solana') || 
             chain.includes('multi') || token.includes('usdc') || features.includes('usdc') || features.includes('stablecoin');
    },
    sortBy: 'rating',
    limit: 15
  },
  {
    slug: 'best-bitcoin-debit-card',
    title: 'Best Bitcoin Debit Card 2026 | Spend BTC Anywhere | Spendbase',
    description: 'Compare the best Bitcoin debit cards. Earn BTC cashback and spend Bitcoin at any merchant.',
    h1: 'Best Bitcoin Debit Cards 2026',
    shortDesc: 'Spend BTC, earn Bitcoin cashback',
    filter: (card) => {
      const chain = (card.chain || '').toLowerCase();
      const token = (card.cashbackToken || '').toLowerCase();
      return chain.includes('bitcoin') || token.includes('btc') || token.includes('sats');
    },
    sortBy: 'rating',
    limit: 10
  },
  {
    slug: 'best-solana-crypto-card',
    title: 'Best Solana Crypto Card 2026 | SOL Spending Cards | Spendbase',
    description: 'Compare the best Solana ecosystem crypto cards. Spend SOL and Solana tokens anywhere.',
    h1: 'Best Solana Crypto Cards 2026',
    shortDesc: 'Cards for the Solana ecosystem',
    filter: (card) => {
      const chain = (card.chain || '').toLowerCase();
      return chain.includes('solana');
    },
    sortBy: 'rating',
    limit: 10
  },
  {
    slug: 'best-defi-crypto-card',
    title: 'Best DeFi Crypto Card 2026 | DeFi-Native Cards | Spendbase',
    description: 'Compare DeFi-native crypto cards. Borrow against your crypto, earn yield, and spend from DeFi protocols.',
    h1: 'Best DeFi Crypto Cards 2026',
    shortDesc: 'DeFi-native spending solutions',
    filter: (card) => card.archetype === 'defi',
    sortBy: 'rating',
    limit: 10
  }
];

// Generate popular head-to-head matchups
function generateVsMatchups() {
  const matchups = [];
  
  // Get top-rated cards
  const topCards = [...allCards]
    .filter(c => !c.comingSoon)
    .sort((a, b) => getCardRating(b) - getCardRating(a))
    .slice(0, 25);
  
  // Generate matchups between similar cards (same category or archetype)
  for (let i = 0; i < topCards.length; i++) {
    for (let j = i + 1; j < topCards.length; j++) {
      const card1 = topCards[i];
      const card2 = topCards[j];
      
      // Create matchups for cards in similar categories or archetypes
      const sameBrand = card1.brand && card1.brand === card2.brand;
      if (sameBrand) continue; // Skip same brand comparisons
      
      const sameCategory = card1.category === card2.category;
      const sameArchetype = card1.archetype === card2.archetype;
      const bothSelfCustody = card1.custody === 'Non-Custodial' && card2.custody === 'Non-Custodial';
      const bothHighCashback = getCashbackValue(card1) >= 3 && getCashbackValue(card2) >= 3;
      
      if (sameCategory || sameArchetype || bothSelfCustody || bothHighCashback) {
        const slug = getVsSlug(card1, card2);
        // Avoid duplicates
        if (!matchups.find(m => m.slug === slug)) {
          matchups.push({
            slug,
            card1: card1,
            card2: card2
          });
        }
      }
    }
  }
  
  // Add some popular cross-category matchups manually
  const popularPairs = [
    ['Crypto.com Jade Green', 'Coinbase'],
    ['MetaMask Card', 'Gnosis Pay'],
    ['Ether.fi Cash', 'Plutus'],
    ['Bybit', 'Binance Card'],
    ['Fold', 'Crypto.com Ruby Steel'],
    ['Phantom Card', 'Solayer Emerald'],
    ['Nexo', 'Gemini'],
    ['KAST Standard', 'Ready'],
    ['Solflare', 'Phantom Card'],
    ['Bleap', 'Holyheld']
  ];
  
  for (const [name1, name2] of popularPairs) {
    const card1 = allCards.find(c => c.name === name1);
    const card2 = allCards.find(c => c.name === name2);
    if (card1 && card2) {
      const slug = getVsSlug(card1, card2);
      if (!matchups.find(m => m.slug === slug)) {
        matchups.push({ slug, card1, card2 });
      }
    }
  }
  
  return matchups.slice(0, 50); // Limit to 50 matchups
}

// Create compare directory
const compareDir = './compare';
if (!fs.existsSync(compareDir)) {
  fs.mkdirSync(compareDir, { recursive: true });
}

// Generate VS pages
const vsMatchups = generateVsMatchups();
let vsCount = 0;
for (const matchup of vsMatchups) {
  const dir = `${compareDir}/${matchup.slug}`;
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const html = generateVsPage(matchup.card1, matchup.card2);
    fs.writeFileSync(`${dir}/index.html`, html);
    console.log(`✓ Generated: /compare/${matchup.slug}/`);
    vsCount++;
  } catch (error) {
    console.error(`✗ Error generating ${matchup.slug}: ${error.message}`);
  }
}

// Generate category pages
let categoryCount = 0;
for (const category of categories) {
  const dir = `${compareDir}/${category.slug}`;
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const html = generateCategoryPage(category);
    fs.writeFileSync(`${dir}/index.html`, html);
    console.log(`✓ Generated: /compare/${category.slug}/`);
    categoryCount++;
  } catch (error) {
    console.error(`✗ Error generating ${category.slug}: ${error.message}`);
  }
}

// Generate compare index page
try {
  const indexHtml = generateCompareIndex(categories, vsMatchups);
  fs.writeFileSync(`${compareDir}/index.html`, indexHtml);
  console.log(`✓ Generated: /compare/index.html`);
} catch (error) {
  console.error(`✗ Error generating compare index: ${error.message}`);
}

// Update sitemap.xml
console.log('\n📝 Updating sitemap.xml...');
try {
  let sitemap = fs.readFileSync('./sitemap.xml', 'utf8');
  
  // Remove old compare entries if they exist
  sitemap = sitemap.replace(/\s*<!-- Compare Pages -->[\s\S]*?(?=\s*<\/urlset>)/, '');
  
  // Build new compare entries
  const today = new Date().toISOString().split('T')[0];
  let compareUrls = '\n  <!-- Compare Pages -->\n';
  compareUrls += `  <url><loc>https://spendbase.cards/compare/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
  
  // Add category pages
  for (const category of categories) {
    compareUrls += `  <url><loc>https://spendbase.cards/compare/${category.slug}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
  }
  
  // Add VS pages
  for (const matchup of vsMatchups) {
    compareUrls += `  <url><loc>https://spendbase.cards/compare/${matchup.slug}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
  }
  
  // Insert before </urlset>
  sitemap = sitemap.replace('</urlset>', compareUrls + '</urlset>');
  
  fs.writeFileSync('./sitemap.xml', sitemap);
  console.log(`✅ Updated sitemap.xml with ${categories.length + vsMatchups.length + 1} compare URLs`);
} catch (error) {
  console.error(`✗ Error updating sitemap: ${error.message}`);
}

console.log(`\n🎉 Generation complete!`);
console.log(`   ✅ Category pages: ${categoryCount}`);
console.log(`   ✅ VS pages: ${vsCount}`);
console.log(`   ✅ Index page: 1`);
console.log(`   📍 Total compare pages: ${categoryCount + vsCount + 1}`);
