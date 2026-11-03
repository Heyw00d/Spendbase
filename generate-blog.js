const fs = require('fs');
const path = require('path');

console.log('📝 Generating pSEO blog posts...\n');

// Read the main HTML file to extract card data
const htmlContent = fs.readFileSync('./index.html', 'utf8');
const allCardsStart = htmlContent.indexOf('const allCards = [');
const allCardsEnd = htmlContent.indexOf('];', allCardsStart) + 2;
const allCardsCode = htmlContent.substring(allCardsStart, allCardsEnd);
const getAllCards = new Function('return ' + allCardsCode.replace('const allCards = ', ''));
const allCards = getAllCards();

console.log(`✅ Loaded ${allCards.length} cards\n`);

// Helper functions
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getCardSlug(card) {
  return card.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const today = new Date().toISOString().split('T')[0];

// A YYYY-MM-DD day, rendered as the day it actually is.
//
// new Date('2026-02-07') is midnight UTC, and formatting that in any negative-offset locale
// gives 6 February — so every post displayed a date one day earlier than its own datetime
// attribute. Pinned to midday and formatted in UTC so the visible date and the machine
// readable one cannot disagree, wherever the build runs.
//
// `opts` lets the index use a short month while the post keeps the long one.
function formatDay(day, opts = { year: 'numeric', month: 'long', day: 'numeric' }) {
  if (!day) return '';
  return new Date(`${day}T12:00:00Z`).toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' });
}

// Blog post template.
//
// `tags` is optional and the block that renders it is guarded. It used to call tags.map()
// unguarded, so a post without the key threw and took the whole run down with it — and the
// posts arriving from blog/_posts/ do not carry tags. An empty list draws no bordered box
// rather than an empty one.
//
// NOTE FOR ANYONE EDITING THE TEMPLATE BELOW: it is one big template literal, so a backtick
// anywhere inside it — including inside an HTML comment — ends the string and breaks the
// file. Explanations go here, in JS comments, not in the markup.
function generateBlogPost({ slug, title, description, content, publishDate, category, tags }) {
  const canonical = `https://spendbase.cards/blog/${slug}/`;
  const ogImage = 'https://spendbase.cards/og-image.png';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Spendbase</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:site_name" content="Spendbase">
  <meta property="article:published_time" content="${publishDate}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@spendbasecards">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${ogImage}">
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${title}",
    "description": "${description}",
    "url": "${canonical}",
    "datePublished": "${publishDate}",
    "dateModified": "${today}",
    "author": {
      "@type": "Organization",
      "name": "Spendbase"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Spendbase",
      "logo": {
        "@type": "ImageObject",
        "url": "https://spendbase.cards/spendbase-logo-512.png"
      }
    },
    "image": "${ogImage}",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${canonical}"
    }
  }
  </script>
  
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: #0a0a0a; color: #e5e5e5; }
    .prose { max-width: 65ch; }
    .prose h2 { color: #fff; font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
    .prose h3 { color: #fff; font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; }
    .prose p { margin-bottom: 1rem; line-height: 1.75; }
    .prose ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
    .prose li { margin-bottom: 0.5rem; }
    .prose a { color: #22d3ee; text-decoration: underline; }
    .prose strong { color: #fff; }
    .card-link { transition: all 0.2s; }
    .card-link:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  </style>
</head>
<body class="min-h-screen">
  <!-- Header -->
  <header class="border-b border-gray-800">
    <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="/" class="flex items-center space-x-2">
        <img src="/spendbase-logo-512.png" alt="Spendbase" class="h-8 w-8">
        <span class="text-xl font-bold text-white">Spendbase</span>
      </a>
      <nav class="flex items-center space-x-4">
        <a href="/blog/" class="text-gray-400 hover:text-white">Blog</a>
        <a href="/" class="text-cyan-400 hover:text-cyan-300">Compare Cards →</a>
      </nav>
    </div>
  </header>
  
  <!-- Article -->
  <article class="max-w-4xl mx-auto px-4 py-12">
    <div class="mb-8">
      <div class="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <span>${category}</span>
        <span>•</span>
        <time datetime="${publishDate}">${formatDay(publishDate)}</time>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">${title}</h1>
      <p class="text-xl text-gray-400">${description}</p>
    </div>
    
    <div class="prose">
      ${content}
    </div>
    
    ${(tags && tags.length) ? `<div class="mt-12 pt-8 border-t border-gray-800">
      <div class="flex flex-wrap gap-2">
        ${tags.map(tag => `<span class="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-400">${tag}</span>`).join('')}
      </div>
    </div>` : ''}
    
    <!-- Why Free Content -->
    <div class="mt-12 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
      <h3 class="text-lg font-semibold text-white mb-3">💡 Why We Publish This Free</h3>
      <p class="text-gray-400 text-sm mb-3">Traditional SEO agencies charge <strong class="text-white">$300–$1,200 per backlink</strong>. Monthly link-building campaigns run <strong class="text-white">$2,000–$20,000</strong>. That's $24K–$240K/year just to rank.</p>
      <p class="text-gray-400 text-sm">We skip the middleman. By publishing genuinely useful comparisons and guides, we earn organic links and help you make better decisions — no one pays for placement here.</p>
    </div>
    
    <!-- CTA -->
    <div class="mt-8 p-8 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-2xl border border-cyan-500/20">
      <h3 class="text-xl font-bold text-white mb-2">Find Your Perfect Crypto Card</h3>
      <p class="text-gray-400 mb-4">Compare 100+ crypto cards with real data. Filter by cashback, fees, chains, and more.</p>
      <a href="/" class="inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg transition-colors">
        Compare Cards Now →
      </a>
    </div>
  </article>
  
  <!-- Footer -->
  <footer class="border-t border-gray-800 mt-16">
    <div class="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
      <p>© 2026 Spendbase. Independent crypto card comparison.</p>
    </div>
  </footer>
</body>
</html>`;
}

// Generate card comparison HTML
function generateCardBox(card) {
  const slug = getCardSlug(card);
  return `
      <a href="/card/${slug}/" class="card-link block p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700">
        <div class="flex items-center space-x-3 mb-3">
          <img src="${card.logo}" alt="${card.name}" class="w-10 h-10 rounded-lg">
          <div>
            <div class="font-semibold text-white">${card.name}</div>
            <div class="text-sm text-gray-500">${card.chain} • ${card.network}</div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-sm">
          <div>
            <div class="text-gray-500">Cashback</div>
            <div class="text-cyan-400 font-medium">${card.cashback}</div>
          </div>
          <div>
            <div class="text-gray-500">Fee</div>
            <div class="text-white">${card.annualFee}</div>
          </div>
          <div>
            <div class="text-gray-500">Custody</div>
            <div class="text-white">${card.custody}</div>
          </div>
        </div>
      </a>`;
}

// Define blog posts to generate
const posts = [];

// 1. COMPARISON POSTS
const comparisons = [
  { card1: 'Crypto.com Ruby Steel', card2: 'Coinbase', slug: 'cryptocom-vs-coinbase' },
  { card1: 'MetaMask Card', card2: 'Gnosis Pay', slug: 'metamask-vs-gnosis-pay' },
  { card1: 'Ether.fi Cash', card2: 'Gnosis Pay', slug: 'etherfi-vs-gnosis-pay' },
  { card1: 'Bybit Card', card2: 'Crypto.com Ruby Steel', slug: 'bybit-vs-cryptocom' },
];

for (const comp of comparisons) {
  const c1 = allCards.find(c => c.name === comp.card1);
  const c2 = allCards.find(c => c.name === comp.card2);
  if (!c1 || !c2) continue;
  
  const title = `${c1.name.replace(/ Card$/, '')} vs ${c2.name.replace(/ Card$/, '')}: Which Crypto Card is Better in 2026?`;
  const description = `Head-to-head comparison of ${c1.name} and ${c2.name}. Compare cashback rates, fees, custody, and features to find the best crypto card for you.`;
  
  posts.push({
    slug: comp.slug,
    title,
    description,
    category: 'Comparison',
    tags: ['comparison', c1.chain.toLowerCase(), c2.chain.toLowerCase(), 'crypto cards'],
    publishDate: today,
    content: `
      <p>Choosing between <strong>${c1.name}</strong> and <strong>${c2.name}</strong>? Both are popular crypto cards with distinct advantages. Here's a detailed breakdown to help you decide.</p>
      
      <h2>Quick Comparison</h2>
      <div class="grid md:grid-cols-2 gap-4 not-prose my-6">
        ${generateCardBox(c1)}
        ${generateCardBox(c2)}
      </div>
      
      <h2>Cashback & Rewards</h2>
      <p><strong>${c1.name}</strong> offers ${c1.cashback} cashback${c1.cashbackToken !== 'N/A' ? ` paid in ${c1.cashbackToken}` : ''}, while <strong>${c2.name}</strong> provides ${c2.cashback} cashback${c2.cashbackToken !== 'N/A' ? ` in ${c2.cashbackToken}` : ''}.</p>
      ${parseFloat(c1.cashback) > parseFloat(c2.cashback) ? 
        `<p>The ${c1.name} wins on raw cashback percentage, though the value of the reward token matters too.</p>` :
        parseFloat(c1.cashback) < parseFloat(c2.cashback) ?
        `<p>The ${c2.name} offers higher cashback rates, making it potentially more rewarding for heavy spenders.</p>` :
        `<p>Both cards offer similar cashback rates, so the decision comes down to other factors.</p>`
      }
      
      <h2>Fees & Costs</h2>
      <ul>
        <li><strong>${c1.name}:</strong> ${c1.annualFee} annual fee, ${c1.fxFee} FX fee</li>
        <li><strong>${c2.name}:</strong> ${c2.annualFee} annual fee, ${c2.fxFee} FX fee</li>
      </ul>
      
      <h2>Custody & Security</h2>
      <p>${c1.name} is <strong>${c1.custody}</strong> — ${c1.custody === 'Non-Custodial' ? 'you keep control of your keys' : 'the provider holds your funds'}.</p>
      <p>${c2.name} is <strong>${c2.custody}</strong> — ${c2.custody === 'Non-Custodial' ? 'you maintain full custody' : 'convenient but requires trust in the platform'}.</p>
      
      <h2>Blockchain & Ecosystem</h2>
      <p><strong>${c1.name}</strong> runs on <strong>${c1.chain}</strong>, while <strong>${c2.name}</strong> uses <strong>${c2.chain}</strong>. If you're already active on one of these chains, that might tip the decision.</p>
      
      <h2>Key Features</h2>
      <h3>${c1.name}</h3>
      <ul>
        ${c1.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      
      <h3>${c2.name}</h3>
      <ul>
        ${c2.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      
      <h2>Verdict: Which Should You Choose?</h2>
      <p><strong>Choose ${c1.name} if:</strong> You prefer ${c1.custody.toLowerCase()} custody, want exposure to ${c1.chain}, or value ${c1.features[0].toLowerCase()}.</p>
      <p><strong>Choose ${c2.name} if:</strong> You prefer ${c2.custody.toLowerCase()} custody, are active on ${c2.chain}, or want ${c2.features[0].toLowerCase()}.</p>
    `
  });
}

// 2. BEST-OF POSTS (by attribute)
const bestOfPosts = [
  {
    slug: 'best-self-custody-crypto-cards',
    title: 'Best Self-Custody Crypto Cards in 2026',
    description: 'Compare the top non-custodial crypto cards that let you keep control of your keys. MetaMask, Gnosis Pay, Ether.fi, and more.',
    filter: c => c.custody === 'Non-Custodial',
    category: 'Best Of',
    tags: ['self-custody', 'non-custodial', 'defi', 'crypto cards'],
    intro: `<p>Self-custody crypto cards let you spend directly from your own wallet — no exchange deposits, no third-party custody. You keep your keys, you keep control.</p>
    <p>Here are the best non-custodial crypto cards available in 2026.</p>`
  },
  {
    slug: 'best-no-fee-crypto-cards',
    title: 'Best No Annual Fee Crypto Cards in 2026',
    description: 'Top crypto debit cards with $0 annual fees. Compare cashback rates, FX fees, and features for free crypto cards.',
    filter: c => c.annualFee === '$0' || c.annualFee.includes('$0'),
    category: 'Best Of',
    tags: ['no fee', 'free', 'crypto cards', 'beginners'],
    intro: `<p>Why pay an annual fee when you don't have to? These crypto cards offer $0 annual fees while still providing solid cashback and features.</p>
    <p>Perfect for anyone starting out or who doesn't want commitment.</p>`
  },
  {
    slug: 'best-high-cashback-crypto-cards',
    title: 'Best High Cashback Crypto Cards (5%+ Rewards)',
    description: 'Crypto cards with the highest cashback rates — 5% or more. Compare top-tier rewards cards and what it takes to qualify.',
    filter: c => {
      const match = c.cashback.match(/([\d.]+)/);
      return match && parseFloat(match[1]) >= 5;
    },
    category: 'Best Of',
    tags: ['high cashback', 'rewards', 'premium', 'crypto cards'],
    intro: `<p>Want maximum rewards on every purchase? These crypto cards offer 5% cashback or higher — though some require staking or premium tiers.</p>
    <p>Here's how to get the highest crypto cashback rates in 2026.</p>`
  },
  {
    slug: 'best-solana-crypto-cards',
    title: 'Best Solana Crypto Cards in 2026',
    description: 'Spend your SOL with these Solana-native crypto debit cards. Compare cashback, fees, and features for Solana ecosystem cards.',
    filter: c => c.chain === 'Solana' || c.chain.toLowerCase().includes('solana'),
    category: 'Best Of',
    tags: ['solana', 'SOL', 'crypto cards', 'layer 1'],
    intro: `<p>Solana's fast, cheap transactions make it ideal for payments. These cards let you spend directly from the Solana ecosystem.</p>
    <p>Here are the best Solana-native crypto cards in 2026.</p>`
  },
  {
    slug: 'best-ethereum-crypto-cards',
    title: 'Best Ethereum & L2 Crypto Cards in 2026',
    description: 'Top crypto cards for Ethereum users — including Base, Scroll, Linea, and other L2 networks. Compare ETH-native payment cards.',
    filter: c => ['Ethereum', 'Base', 'Scroll', 'Linea', 'Arbitrum', 'Optimism', 'zkSync'].includes(c.chain),
    category: 'Best Of',
    tags: ['ethereum', 'ETH', 'layer 2', 'L2', 'crypto cards'],
    intro: `<p>Ethereum and its L2 ecosystem have the most crypto card options. From Base to Scroll to Linea, here are the best ETH-native cards.</p>`
  }
];

for (const post of bestOfPosts) {
  const matchingCards = allCards.filter(post.filter).slice(0, 8);
  if (matchingCards.length < 2) continue;
  
  posts.push({
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    tags: post.tags,
    publishDate: today,
    content: `
      ${post.intro}
      
      <h2>Top Picks</h2>
      <div class="grid md:grid-cols-2 gap-4 not-prose my-6">
        ${matchingCards.slice(0, 4).map(c => generateCardBox(c)).join('')}
      </div>
      
      <h2>Detailed Breakdown</h2>
      ${matchingCards.slice(0, 6).map((card, i) => `
        <h3>${i + 1}. ${card.name}</h3>
        <p><strong>Cashback:</strong> ${card.cashback}${card.cashbackToken !== 'N/A' ? ` in ${card.cashbackToken}` : ''} | <strong>Fee:</strong> ${card.annualFee} | <strong>Chain:</strong> ${card.chain}</p>
        <ul>
          ${card.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <p><a href="/card/${getCardSlug(card)}/">View full ${card.name} details →</a></p>
      `).join('')}
      
      <h2>How to Choose</h2>
      <p>When comparing these cards, consider:</p>
      <ul>
        <li><strong>Cashback rate</strong> — Higher isn't always better if the token is volatile</li>
        <li><strong>Custody model</strong> — Self-custody means you control your keys</li>
        <li><strong>Chain ecosystem</strong> — Pick a card on a chain you already use</li>
        <li><strong>Fees</strong> — Annual fees, FX fees, and staking requirements add up</li>
      </ul>
    `
  });
}

// 3. USE CASE POSTS
const useCasePosts = [
  {
    slug: 'best-crypto-card-for-travelers',
    title: 'Best Crypto Cards for Travelers in 2026',
    description: 'Top crypto debit cards for international travel. Compare FX fees, lounge access, and worldwide acceptance.',
    filter: c => c.fxFee === '0%' || c.features.some(f => f.toLowerCase().includes('lounge') || f.toLowerCase().includes('travel')),
    category: 'Guide',
    tags: ['travel', 'international', 'no FX fee', 'lounge access'],
    intro: `<p>Traveling with crypto? The right card can save you thousands in FX fees while earning rewards. Here are the best crypto cards for international travelers.</p>`
  },
  {
    slug: 'best-crypto-card-for-beginners',
    title: 'Best Crypto Cards for Beginners in 2026',
    description: 'Easy-to-use crypto debit cards for newcomers. No staking, no complexity — just simple crypto spending.',
    filter: c => c.annualFee === '$0' && !c.features.some(f => f.toLowerCase().includes('stake')),
    category: 'Guide',
    tags: ['beginners', 'easy', 'no staking', 'simple'],
    intro: `<p>New to crypto cards? These beginner-friendly options have no annual fees, no staking requirements, and simple setup. Just add funds and spend.</p>`
  },
  {
    slug: 'best-crypto-card-for-defi-users',
    title: 'Best Crypto Cards for DeFi Users in 2026',
    description: 'Crypto cards built for DeFi. Spend from your wallet, borrow against stakes, and stay non-custodial.',
    filter: c => c.archetype === 'defi' || c.custody === 'Non-Custodial',
    category: 'Guide',
    tags: ['defi', 'self-custody', 'lending', 'staking'],
    intro: `<p>DeFi-native crypto cards let you spend without selling. Borrow against your stakes, maintain custody, and stay on-chain.</p>`
  }
];

for (const post of useCasePosts) {
  const matchingCards = allCards.filter(post.filter).slice(0, 8);
  if (matchingCards.length < 2) continue;
  
  posts.push({
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    tags: post.tags,
    publishDate: today,
    content: `
      ${post.intro}
      
      <h2>Our Top Picks</h2>
      <div class="grid md:grid-cols-2 gap-4 not-prose my-6">
        ${matchingCards.slice(0, 4).map(c => generateCardBox(c)).join('')}
      </div>
      
      <h2>Why These Cards?</h2>
      ${matchingCards.slice(0, 4).map((card, i) => `
        <h3>${i + 1}. ${card.name}</h3>
        <p>${card.perks.join('. ')}.</p>
        <ul>
          ${card.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <p><strong>Cashback:</strong> ${card.cashback} | <strong>Annual Fee:</strong> ${card.annualFee}</p>
        <p><a href="/card/${getCardSlug(card)}/">Learn more about ${card.name} →</a></p>
      `).join('')}
      
      <h2>What to Look For</h2>
      <p>Key factors when choosing a crypto card for this use case:</p>
      <ul>
        <li>Rewards that match your spending patterns</li>
        <li>Fees that don't eat into your benefits</li>
        <li>Chain compatibility with your existing holdings</li>
        <li>Custody model that fits your risk tolerance</li>
      </ul>
    `
  });
}

// FIRST PUBLISH WINS, AND THIS IS NOT COSMETIC.
//
// Every post definition above sets `publishDate: today`, so each run restamped
// datePublished on articles that went out months ago. Measured on the real repo: eleven
// pages moved from February to today, in the JSON-LD, in `article:published_time` and in
// the visible <time> element. That throws away nine months of article age and re-announces
// eleven unchanged pages to Google as new.
//
// The template already got the hard part right — `dateModified` is separate and tracks
// today. Only the input was wrong. A regeneration is not a publication.
function firstPublished(slug, fallback) {
  const f = `./blog/${slug}/index.html`;
  if (!fs.existsSync(f)) return fallback;
  const m = fs.readFileSync(f, 'utf8').match(/"datePublished"\s*:\s*"?(\d{4}-\d{2}-\d{2})/);
  return (m && m[1]) || fallback;
}

// ── POSTS WRITTEN BY SOMETHING OTHER THAN THIS FILE ────────────────────────────────────
//
// blog/_posts/*.md is the drop folder for an external publisher (GetFound). Each file is
// rendered through the same template as everything above, so a post we did not write still
// comes out with this site's head, chrome, schema and canonical.
//
// WHY .md FILES THAT CONTAIN HTML, which looks wrong and is deliberate. GetFound's GitHub
// publisher only recognises .md/.mdx/.markdown — its layout detector ignores every other
// extension, so a folder of index.html files is invisible to it and it will not publish
// there at all. The body it writes is ALREADY HTML: it emits YAML frontmatter and then the
// article's html straight after it. So this reads the frontmatter for metadata and treats
// the body as HTML. There is deliberately no markdown-to-HTML step — nothing in this
// pipeline emits markdown syntax, and a half-working parser would quietly mangle real
// articles rather than fail.
//
// The folder is named `_posts` because that is one of the names GetFound's detector already
// looks for, which makes the connection self-describing instead of a setting to remember.
const POSTS_DIR = './blog/_posts';

// A deliberately small YAML subset: `key: value`, quoted or bare, plus `- item` lists.
// Enough for the frontmatter this pipeline writes and reads, and it fails loudly on a file
// it cannot parse rather than publishing a page with an empty title.
function parseFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { ok: false, error: 'no --- frontmatter block' };
  const data = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const item = line.match(/^\s*-\s+(.*)$/);
    if (item && key) {
      if (!Array.isArray(data[key])) data[key] = [];
      data[key].push(unquote(item[1]));
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!kv) continue;
    key = kv[1];
    data[key] = kv[2].trim() === '' ? [] : unquote(kv[2]);
  }
  return { ok: true, data, body: m[2] };
}

function unquote(v) {
  const s = String(v).trim();
  const q = s.match(/^(['"])([\s\S]*)\1$/);
  return q ? q[2].replace(/\\"/g, '"') : s;
}

function renderMarkdownPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => /\.(md|mdx|markdown)$/i.test(f)).sort();
  if (!files.length) return [];

  console.log(`\n📥 Rendering ${files.length} post(s) from ${POSTS_DIR}/`);
  const out = [];
  for (const file of files) {
    const parsed = parseFrontmatter(fs.readFileSync(`${POSTS_DIR}/${file}`, 'utf8'));
    // REFUSE, DO NOT GUESS. A page written from a file we could not read would go live with
    // an empty title and description, which is worse than this post not appearing yet.
    if (!parsed.ok) { console.log(`  ✗ ${file} — ${parsed.error}, skipped`); continue; }
    const fm = parsed.data;

    // The filename owns the slug, so a URL cannot disagree with the file it came from.
    // GetFound writes YYYY-MM-DD-slug.md, which is the convention its detector reported.
    const slug = file.replace(/\.(md|mdx|markdown)$/i, '').replace(/^\d{4}-\d{2}-\d{2}[-_]/, '');
    const title = fm.title || slug;
    if (!fm.title) console.log(`  ! ${file} — no title in frontmatter, using the slug`);

    const post = {
      slug,
      title,
      description: fm.description || '',
      content: parsed.body.trim(),
      // First publish wins here too: a re-render must not restamp a page already out.
      publishDate: firstPublished(slug, String(fm.date || today).slice(0, 10)),
      category: fm.category || 'Guide',
      tags: Array.isArray(fm.tags) ? fm.tags : (fm.tags ? [fm.tags] : []),
    };

    const dir = `./blog/${slug}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(`${dir}/index.html`, generateBlogPost(post));
    console.log(`  ✓ ${slug}`);
    out.push(post);
  }
  return out;
}

// Generate all posts
console.log(`📄 Generating ${posts.length} blog posts...\n`);

for (const post of posts) {
  const dir = `./blog/${post.slug}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  // Set before the template runs, and on the object the index below also reads, so the page
  // and its listing cannot disagree about when it went out.
  post.publishDate = firstPublished(post.slug, post.publishDate);

  const html = generateBlogPost(post);
  fs.writeFileSync(`${dir}/index.html`, html);
  console.log(`  ✓ ${post.slug}`);
}

// EVERY POST ON DISK, NOT JUST THE ONES THIS SCRIPT GENERATES.
//
// The blog index below is rewritten wholesale from `posts`, so any article added by hand —
// or by anything other than this file — was silently dropped from it on the next run. Five
// of sixteen were in that state: crypto-card-resources, crypto-cashback-token-trap and
// usdc-spending-resources were linked from nowhere, and best-crypto-cards-for-traders,
// best-no-kyc-crypto-cards, crypto-card-resources and usdc-spending-resources were missing
// from the sitemap. All five were live and serving the whole time, which is why nothing
// looked broken: a page Google cannot discover and no link points at still returns 200.
//
// Reading the directory instead of trusting the list means a post only has to EXIST to be
// listed. That also makes this safe to run after an external publisher has added a page.
function discoverPosts(generated) {
  const known = new Set(generated.map(p => p.slug));
  return fs.readdirSync('./blog', { withFileTypes: true })
    .filter(d => d.isDirectory() && !known.has(d.name))
    .filter(d => fs.existsSync(`./blog/${d.name}/index.html`))
    .map(d => {
      const html = fs.readFileSync(`./blog/${d.name}/index.html`, 'utf8');
      const pick = (re) => { const m = html.match(re); return m ? m[1].trim() : ''; };
      // The page's own <head> is the source. A title or description invented here would
      // disagree with what the page actually serves and with its canonical.
      const title = pick(/<title>([^<]*)<\/title>/i).replace(/\s*\|\s*Spendbase\s*$/i, '');
      return {
        slug: d.name,
        title: title || d.name,
        description: pick(/<meta\s+name="description"\s+content="([^"]*)"/i),
        // NULL, NOT TODAY, when the page does not say. Two of these posts carry no
        // datePublished at all, and defaulting to today would print a date they never had
        // and sort them above everything on the strength of it. The index omits the date
        // instead — an unknown date is not a recent one.
        publishDate: pick(/"datePublished"\s*:\s*"?(\d{4}-\d{2}-\d{2})/) || null,
        category: pick(/<meta\s+property="article:section"\s+content="([^"]*)"/i) || 'Guides',
      };
    });
}

// Rendered BEFORE discovery, so a post dropped in blog/_posts/ is a real page by the time
// the index and sitemap are built — otherwise its first run would publish the file and list
// it nowhere, which is the state the five strays above were in.
const fromMarkdown = renderMarkdownPosts();
const generated = [...posts, ...fromMarkdown];

const discovered = discoverPosts(generated);
if (discovered.length) {
  console.log(`\n🔎 Found ${discovered.length} post(s) on disk this script did not generate:`);
  discovered.forEach(p => console.log(`  + ${p.slug}`));
}

// Newest first. The index shows a date against every entry, so generation order — which is
// what it used before — read as arbitrary next to the dates beside it. Posts with no known
// date sort last rather than first: absent is not recent.
const listing = [...generated, ...discovered]
  .sort((a, b) => String(b.publishDate || '').localeCompare(String(a.publishDate || '')));

// Update blog index
const blogIndexContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog | Spendbase - Crypto Card Insights</title>
  <meta name="description" content="Crypto card comparisons, guides, and analysis. Find the best crypto debit card for your needs.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://spendbase.cards/blog/">
  
  <meta property="og:type" content="website">
  <meta property="og:title" content="Blog | Spendbase">
  <meta property="og:description" content="Crypto card comparisons, guides, and analysis.">
  <meta property="og:url" content="https://spendbase.cards/blog/">
  <meta property="og:image" content="https://spendbase.cards/og-image.png">
  
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@spendbasecards">
  <meta name="twitter:title" content="Blog | Spendbase">
  
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { background: #0a0a0a; color: #e5e5e5; }</style>
</head>
<body class="min-h-screen">
  <header class="border-b border-gray-800">
    <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="/" class="flex items-center space-x-2">
        <img src="/spendbase-logo-512.png" alt="Spendbase" class="h-8 w-8">
        <span class="text-xl font-bold text-white">Spendbase</span>
      </a>
      <a href="/" class="text-cyan-400 hover:text-cyan-300">Compare Cards →</a>
    </div>
  </header>
  
  <main class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold text-white mb-2">Blog</h1>
    <p class="text-gray-400 mb-8">Crypto card comparisons, guides, and honest analysis.</p>
    
    <div class="space-y-6">
      ${listing.map(post => `
      <a href="/blog/${post.slug}/" class="block p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
        <div class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <span>${post.category}</span>
          ${post.publishDate ? `<span>•</span>
          <time datetime="${post.publishDate}">${formatDay(post.publishDate, { year: 'numeric', month: 'short', day: 'numeric' })}</time>` : ''}
        </div>
        <h2 class="text-xl font-semibold text-white mb-2">${post.title}</h2>
        <p class="text-gray-400">${post.description}</p>
      </a>
      `).join('')}
    </div>
  </main>
  
  <footer class="border-t border-gray-800 mt-16">
    <div class="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
      <p>© 2026 Spendbase. Independent crypto card comparison.</p>
    </div>
  </footer>
</body>
</html>`;

fs.writeFileSync('./blog/index.html', blogIndexContent);
console.log(`\n✅ Updated blog index with ${listing.length} posts`);

// Update sitemap
const sitemapPath = './sitemap.xml';
let sitemap = fs.readFileSync(sitemapPath, 'utf8');

// Add new blog URLs if not present. Additive — it has never removed a URL, which is why the
// four missing entries were absent rather than deleted: nothing had ever offered them.
for (const post of listing) {
  const url = `https://spendbase.cards/blog/${post.slug}/`;
  if (!sitemap.includes(url)) {
    const entry = `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    sitemap = sitemap.replace('</urlset>', entry + '</urlset>');
  }
}

fs.writeFileSync(sitemapPath, sitemap);
console.log(`✅ Updated sitemap\n`);

console.log('🎉 Done! Blog posts now listed and in the sitemap:');
listing.forEach(p => console.log(`   /blog/${p.slug}/`));
