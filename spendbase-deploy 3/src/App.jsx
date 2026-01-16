import { useState } from 'react';

const cards = [
  { id: 1, name: 'KAST K Card', bg: 'from-gray-900 to-black', cashback: '2%', fxFee: '0%', network: 'Visa', chain: 'Multi-chain', custody: 'Self-Custody', category: 'crypto', logo: 'https://pbs.twimg.com/profile_images/1868728780593082368/TuongvfD_400x400.jpg', region: 'Global', features: ['Apple Pay', 'Virtual Card', 'No min deposit'] },
  { id: 2, name: 'Gnosis Pay', bg: 'from-emerald-600 to-teal-700', cashback: '1%', fxFee: '0%', network: 'Visa', chain: 'Gnosis Chain', custody: 'Self-Custody', category: 'crypto', logo: 'https://pbs.twimg.com/profile_images/1684890545757347841/tuZ08syF_400x400.png', region: 'EU', features: ['Safe Wallet', 'DeFi Ready', 'Onchain'] },
  { id: 3, name: 'Coinbase Card', bg: 'from-blue-600 to-blue-800', cashback: '4%', fxFee: '0%', network: 'Visa', chain: 'Multi-chain', custody: 'Custodial', category: 'neobank', logo: 'https://logo.clearbit.com/coinbase.com', region: 'US', features: ['Crypto Rewards', 'USDC Spending'] },
  { id: 4, name: 'Crypto.com', bg: 'from-blue-900 to-indigo-900', cashback: '5%', fxFee: '0%', network: 'Visa', chain: 'Cronos', custody: 'Custodial', category: 'crypto', logo: 'https://logo.clearbit.com/crypto.com', region: 'Global', features: ['CRO Staking', 'Airport Lounge', 'Netflix Rebate'] },
  { id: 5, name: 'Revolut', bg: 'from-slate-800 to-slate-900', cashback: '1%', fxFee: '0%', network: 'Visa', chain: 'N/A', custody: 'Custodial', category: 'neobank', logo: 'https://logo.clearbit.com/revolut.com', region: 'Global', features: ['Multi-currency', 'Stock Trading', 'Crypto Trading'] },
  { id: 6, name: 'MetaMask Card', bg: 'from-orange-500 to-amber-600', cashback: '1%', fxFee: '0%', network: 'Mastercard', chain: 'Linea', custody: 'Self-Custody', category: 'crypto', logo: 'https://logo.clearbit.com/metamask.io', region: 'EU/UK', features: ['Browser Wallet', 'DeFi Native', 'Gas Abstraction'] },
  { id: 7, name: 'Wirex', bg: 'from-blue-500 to-cyan-600', cashback: '2%', fxFee: '0%', network: 'Visa', chain: 'Multi-chain', custody: 'Custodial', category: 'crypto', logo: 'https://logo.clearbit.com/wirex.com', region: 'Global', features: ['X-Accounts', 'DeFi Earn', 'Crypto Loans'] },
  { id: 8, name: 'Nexo Card', bg: 'from-blue-600 to-blue-900', cashback: '2%', fxFee: '0%', network: 'Mastercard', chain: 'Multi-chain', custody: 'Custodial', category: 'crypto', logo: 'https://logo.clearbit.com/nexo.io', region: 'EU', features: ['Credit Line', 'No Selling Crypto', 'Instant Approval'] },
];

function Card({ card }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="cursor-pointer w-full"
      style={{ perspective: '1000px', height: flipped ? '340px' : '220px', transition: 'height 0.4s' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.5s',
        transform: flipped ? 'rotateY(180deg)' : 'none'
      }}>
        {/* Front of card */}
        <div style={{ position: 'absolute', width: '100%', height: '220px', backfaceVisibility: 'hidden' }}>
          <div className={`h-full bg-gradient-to-br ${card.bg} rounded-2xl p-5 text-white shadow-xl`}>
            <div className="flex justify-between items-start mb-4">
              <span className="font-bold text-lg">{card.name}</span>
              <img
                src={card.logo}
                alt=""
                className="w-10 h-10 rounded-full bg-white object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div className="w-12 h-8 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded mb-4" />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-black/30 rounded-lg p-2">
                <span className="opacity-60 text-xs">Cashback</span>
                <p className="font-bold text-lime-400">{card.cashback}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-2">
                <span className="opacity-60 text-xs">FX Fee</span>
                <p className="font-bold text-green-400">{card.fxFee}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-between items-center text-xs">
              <span className="bg-black/30 px-2 py-1 rounded">{card.chain}</span>
              <span className="opacity-50">Hover for details</span>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)'
        }}>
          <div className="h-full bg-gray-900 rounded-2xl p-5 text-white border border-gray-700 overflow-auto">
            <div className="flex items-center gap-2 mb-4">
              <img
                src={card.logo}
                alt=""
                className="w-8 h-8 rounded-full bg-white object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="font-bold">{card.name}</span>
              <span className={`ml-auto text-xs px-2 py-1 rounded ${
                card.category === 'crypto' ? 'bg-lime-500/20 text-lime-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {card.category === 'crypto' ? 'CRYPTO CARD' : 'NEOBANK'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="bg-gray-800 rounded-lg p-2">
                <span className="text-gray-500">Cashback</span>
                <p className="font-bold text-lime-400">{card.cashback}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-2">
                <span className="text-gray-500">FX Fee</span>
                <p className="font-bold text-green-400">{card.fxFee}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-2">
                <span className="text-gray-500">Network</span>
                <p className="font-bold">{card.network}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-2">
                <span className="text-gray-500">Custody</span>
                <p className="font-bold text-cyan-400">{card.custody}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-500 text-xs mb-2">Features</p>
              <div className="flex flex-wrap gap-1">
                {card.features.map((f, i) => (
                  <span key={i} className="text-xs bg-gray-800 px-2 py-1 rounded">{f}</span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition">
                + Compare
              </button>
              <button className="flex-1 py-2 bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 rounded-lg text-sm font-bold hover:opacity-90 transition">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubscribeModal({ open, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', country: '', spend: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscriber:', formData);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden border border-gray-800">
        <div className="bg-gradient-to-r from-lime-400 to-emerald-500 p-6 text-gray-900">
          <h3 className="text-2xl font-bold">Stay Updated</h3>
          <p className="opacity-80">Get the latest crypto card news and exclusive deals.</p>
        </div>
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-lime-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">You are In!</h4>
              <p className="text-gray-400 mb-4">Thanks for subscribing.</p>
              <button onClick={onClose} className="bg-lime-400 text-gray-900 font-bold px-6 py-2 rounded-lg">
                Continue
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
              <input
                type="email"
                placeholder="Email address"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
              <select
                required
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
              >
                <option value="">Select country</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="EU">European Union</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="SG">Singapore</option>
                <option value="Other">Other</option>
              </select>
              <select
                required
                value={formData.spend}
                onChange={(e) => setFormData({...formData, spend: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
              >
                <option value="">Monthly card spend (USD)</option>
                <option value="0-500">Less than $500</option>
                <option value="500-1000">$500 - $1,000</option>
                <option value="1000-2500">$1,000 - $2,500</option>
                <option value="2500-5000">$2,500 - $5,000</option>
                <option value="5000+">More than $5,000</option>
              </select>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-bold rounded-lg hover:opacity-90 transition"
              >
                Subscribe for Updates
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-gray-500 text-sm hover:text-gray-300"
              >
                Maybe later
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [filter, setFilter] = useState('all');
  const [showSubscribe, setShowSubscribe] = useState(false);

  const filtered = filter === 'all' ? cards : cards.filter(c => c.category === filter);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <span className="font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="font-bold text-xl">Spendbase</h1>
              <p className="text-gray-500 text-xs">Crypto card comparison</p>
            </div>
          </div>
          <button
            onClick={() => setShowSubscribe(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 px-5 py-2 rounded-lg text-sm font-medium transition"
          >
            Subscribe for Updates
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Explore Crypto Cards</h2>
          <p className="text-gray-400">Hover over each card to see details and compare. Find your perfect crypto spending card.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: 'all', label: 'All Cards' },
            { key: 'crypto', label: 'Crypto-Native' },
            { key: 'neobank', label: 'Neobank' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                filter === f.key
                  ? 'bg-lime-400 text-gray-900'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(card => (
            <Card key={card.id} card={card} />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-lime-400">$18B+</p>
            <p className="text-gray-500 mt-1">Annual Card Volume</p>
            <p className="text-emerald-400 text-sm mt-1">106% CAGR</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-purple-400">$308B</p>
            <p className="text-gray-500 mt-1">Stablecoin Supply</p>
            <p className="text-pink-400 text-sm mt-1">Ready for spending</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-cyan-400">460%</p>
            <p className="text-gray-500 mt-1">YoY Growth</p>
            <p className="text-blue-400 text-sm mt-1">Stablecoin settlements</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-lime-400/10 to-emerald-400/10 border border-lime-400/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Stay Ahead of the Curve</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Get exclusive updates on new crypto cards, the best cashback deals, and stablecoin spending insights.
          </p>
          <button
            onClick={() => setShowSubscribe(true)}
            className="bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-bold px-8 py-3 rounded-xl hover:opacity-90 transition"
          >
            Subscribe Now
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500 text-sm">
          <p>Spendbase - The comparison layer for stablecoin-powered spending</p>
          <p className="mt-2">Data sourced from Artemis Research</p>
        </div>
      </footer>

      {/* Subscribe Modal */}
      <SubscribeModal open={showSubscribe} onClose={() => setShowSubscribe(false)} />
    </div>
  );
}
