# Spendbase Card Submission Template

Use this template when adding new crypto cards to Spendbase.

## Required Fields

```javascript
{
  id: NUMBER,                    // Unique ID (check existing for next available)
  name: 'Card Name',             // Full card name
  
  // Images (use Cloudflare Images)
  cardImage: 'https://imagedelivery.net/uYHlHjMhbvNHB1x4JZscLw/CARD_ID/public',
  logo: 'https://imagedelivery.net/uYHlHjMhbvNHB1x4JZscLw/LOGO_ID/public',
  brandLogo: 'https://imagedelivery.net/uYHlHjMhbvNHB1x4JZscLw/BRAND_LOGO_ID/public',
  brandLogoBack: 'https://imagedelivery.net/uYHlHjMhbvNHB1x4JZscLw/BRAND_LOGO_ID/public',
  
  // Social
  xHandle: 'twitter_handle',     // Without @
  xBanner: 'https://pbs.twimg.com/profile_banners/USER_ID/TIMESTAMP/1500x500',
  tg: 'telegram_handle',         // Optional - Telegram group
  
  // Display
  showFrontTags: true,
  bg: 'from-[#HEX1] to-[#HEX2]', // Gradient colors matching brand
  
  // Classification
  network: 'Visa' | 'Mastercard',
  category: 'cryptoNative' | 'onchain' | 'exchange' | 'fintech',
  archetype: 'wallet' | 'exchange' | 'defi' | 'stablecoin' | 'fintech',
  custody: 'Custodial' | 'Non-Custodial',
  chain: 'Bitcoin' | 'Ethereum' | 'Solana' | 'Multi-chain' | 'Specific Chain',
  regions: ['global'] | ['northamerica', 'europe', 'apac', 'latam'],
  tier: 'Standard' | 'Premium' | 'Luxe',
  brand: 'Brand Name',
  
  // Financials
  cashback: '0%' | '1-3%' | 'Up to 5%' | 'TBD',
  cashbackToken: 'BTC' | 'USDC' | 'TOKEN' | 'TBD',
  fxFee: '0%' | '0.5%' | '2%',
  annualFee: '$0' | '$99/year' | 'TBD',
  
  // Content
  features: [                    // 4 key features
    'Feature 1',
    'Feature 2', 
    'Feature 3',
    'Feature 4'
  ],
  perks: [                       // 3 standout perks
    'Main benefit',
    'Secondary benefit',
    'Third benefit'
  ],
  
  // Links
  website: 'https://card-website.com',
  platforms: 'both' | 'ios' | 'android' | 'web',
  
  // Optional
  token: { ticker: 'TOKEN', live: true, cmc: 'coingecko-slug' },
  comingSoon: true,              // If on waitlist
  waitlistUrl: 'https://...',
  affiliate: 'https://...',      // Referral link
}
```

## Cloudflare Images Upload

Upload images using:

```bash
CF_KEY="your-api-key"
CF_EMAIL="your-email"
CF_ACCOUNT="4fd1108c4d8fef8cb039cd15c8f1c5b3"

# Upload logo
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/images/v1" \
  -H "X-Auth-Email: $CF_EMAIL" \
  -H "X-Auth-Key: $CF_KEY" \
  -F "file=@logo.png" \
  -F "id=cardname-white-logo"

# Upload card image  
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/images/v1" \
  -H "X-Auth-Email: $CF_EMAIL" \
  -H "X-Auth-Key: $CF_KEY" \
  -F "file=@card.png" \
  -F "id=cardname-card-image"
```

## Image Requirements

- **Logo**: White/light version, PNG with transparency, min 200x200px
- **Card Image**: Card visual, any format, ideally 1200x800px or similar ratio
- **X Banner**: Get from `https://pbs.twimg.com/profile_banners/{user_id}/{timestamp}/1500x500`

## Category Guidelines

| Category | Description | Examples |
|----------|-------------|----------|
| cryptoNative | Wallet-first, crypto-first | Crypto.com, Fold, MetaMask |
| onchain | Stablecoin balances, non-custodial | KAST, Ready, Phantom |
| exchange | CEX-backed cards | Binance, Coinbase, Bybit |
| fintech | Traditional fintech with crypto | Brighty, traditional neobanks |

## After Adding

1. Run `node generate-cards.js` to create static page
2. Upload to GitHub: `card/{slug}/index.html`
3. Update sitemap.xml with new card URL
4. Post announcement tweet tagging the card's X handle
