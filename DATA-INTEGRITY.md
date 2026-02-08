# Spendbase Data Integrity

## Critical Data Fields

Before deploying, verify these counts haven't dropped:

```bash
# Check cardImage count (should be ~77)
grep -c "cardImage:" index.html

# Check xBanner count (should be ~84)  
grep -c "xBanner:" index.html

# Check total cards (should be ~102)
grep -c "{ id:" index.html | head -1
```

## Backup Locations

If data gets wiped, restore from:
- **Card Images**: `/Users/henry/clawd/projects/spendbase/card-images.json`
- **X Banners**: `/Users/henry/clawd/projects/spendbase/x-banners.json`

## Regenerating Pages

After restoring data to `index.html`:
```bash
node generate-cards.js
```

This regenerates all 102+ card detail pages in `/card/*/index.html`.

## Last Verified: 2026-02-07
- cardImage: 77
- xBanner: 84
- Cards: 102
