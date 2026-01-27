# SEO Content Generation Prompt for Crypto Card Pages

## Instructions

You are writing SEO-optimized content for crypto card comparison pages on Spendbase.cards. Write factual, helpful content that ranks well and converts visitors.

For each card, generate:

### 1. SEO Title (60 chars max)
Format: "{Card Name} Review 2026: {Key Benefit} | Spendbase"
Example: "Coinbase Card Review 2026: Up to 4% Crypto Cashback | Spendbase"

### 2. Meta Description (155 chars max)
Include: card name, key benefit, call-to-action
Example: "Coinbase Card offers up to 4% crypto cashback with no annual fee. Compare rates, fees, and rewards. See if it's right for you →"

### 3. Overview Paragraph (150-200 words)
- Start with what the card IS (one sentence)
- Key benefits in second sentence
- Who it's best for
- Mention cashback rate, fees, custody type
- Include natural keywords: "[card name] review", "crypto card", "cashback"
- Current and factual — reference 2026
- End with a hook to keep reading

### 4. Pros (4-5 bullet points)
- Start each with action word or benefit
- Be specific with numbers where possible
- Keep under 10 words each

### 5. Cons (3-4 bullet points)
- Be honest and factual
- Help users self-select out if not right for them
- Keep under 10 words each

### 6. FAQ (4 questions with answers)
Target featured snippets. Questions should be:
- "What is the [card] cashback rate?"
- "Is [card] available in [region]?"
- "Does [card] have an annual fee?"
- "Is [card] self-custody or custodial?"

Answers: 2-3 sentences, direct, factual.

---

## Card Data Template

Use this data to generate content:

```
Card: {name}
Category: {category} (cryptoNative/onchain/neobank)
Network: {network} (Visa/Mastercard)
Cashback: {cashback}
Cashback Token: {cashbackToken}
FX Fee: {fxFee}
Annual Fee: {annualFee}
Custody: {custody}
Chain: {chain}
Regions: {regions}
Features: {features}
Perks: {perks}
Token: {token.ticker} (live: {token.live})
Trustpilot: {trustpilot}/5
Composite Score: {composite}/5
```

---

## Tone & Style

- Confident but not salesy
- Factual, not hype
- Helpful, like a knowledgeable friend
- Use "you" and "your"
- Avoid: "best ever", "amazing", "incredible"
- Include: specific numbers, honest trade-offs

---

## Output Format

```json
{
  "cardName": "Coinbase",
  "seoTitle": "...",
  "metaDescription": "...",
  "overview": "...",
  "pros": ["...", "...", "..."],
  "cons": ["...", "...", "..."],
  "faq": [
    { "q": "...", "a": "..." },
    { "q": "...", "a": "..." }
  ]
}
```
