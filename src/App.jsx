import { useState } from 'react'

const cards = [
  { id: 1, name: 'KAST K Card', bg: 'from-gray-900 to-black', cashback: '2%', fxFee: '0%', network: 'Visa', chain: 'Multi-chain', custody: 'Self-Custody', category: 'crypto', logo: 'https://pbs.twimg.com/profile_images/1868728780593082368/TuongvfD_400x400.jpg' },
  { id: 2, name: 'Gnosis Pay', bg: 'from-emerald-600 to-teal-700', cashback: '1%', fxFee: '0%', network: 'Visa', chain: 'Gnosis', custody: 'Self-Custody', category: 'crypto', logo: 'https://pbs.twimg.com/profile_images/1684890545757347841/tuZ08syF_400x400.png' },
  { id: 3, name: 'Coinbase Card', bg: 'from-blue-600 to-blue-800', cashback: '4%', fxFee: '0%', network: 'Visa', chain: 'Multi-chain', custody: 'Custodial', category: 'neobank', logo: 'https://logo.clearbit.com/coinbase.com' },
  { id: 4, name: 'Crypto.com', bg: 'from-blue-900 to-indigo-900', cashback: '5%', fxFee: '0%', network: 'Visa', chain: 'Cronos', custody: 'Custodial', category: 'crypto', logo: 'https://logo.clearbit.com/crypto.com' },
  { id: 5, name: 'Revolut', bg: 'from-slate-800 to-slate-900', cashback: '1%', fxFee: '0%', network: 'Visa', chain: 'N/A', custody: 'Custodial', category: 'neobank', logo: 'https://logo.clearbit.com/revolut.com' },
  { id: 6, name: 'MetaMask Card', bg: 'from-orange-500 to-amber-600', cashback: '1%', fxFee: '0%', network: 'Mastercard', chain: 'Linea', custody: 'Self-Custody', category: 'crypto', logo: 'https://logo.clearbit.com/metamask.io' },
]

function Card({ card }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div
      className="cursor-pointer w-full"
      style={{ perspective: '1000px', height: flipped ? '320px' : '200px', transition: 'height 0.4s' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: 'transform 0.5s', transform: flipped ? 'rotateY(180deg)' : 'none' }}>
        <div style={{ position: 'absolute', width: '100%', height: '200px', backfaceVisibility: 'hidden' }}>
          <div className={`h-full bg-gradient-to-br ${card.bg} rounded-2xl p-4 text-white shadow-lg`}>
            <div className="flex justify-between items-start mb-3">
              <span className="font-bold">{card.name}</span>
              <img src={card.logo} alt="" className="w-8 h-8 rounded-full bg-white" onError={(e) => e.target.style.display='none'} />
            </div>
            <div className="w-10 h-6 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded mb-3" />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-black/30 rounded p-2">
                <span className="opacity-60">Cashback</span>
                <p className="font-bold text-lime-400">{card.cashback}</p>
              </div>
              <div className="bg-black/30 rounded p-2">
                <span className="opacity-60">FX Fee</span>
                <p className="font-bold text-green-400">{card.fxFee}</p>
              </div>
            </div>
            <div className="mt-2 flex justify-between text-xs">
              <span className="bg-black/30 px-2 py-1 rounded">{card.chain}</span>
              <span className="opacity-50">Hover for more</span>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="h-full bg-gray-900 rounded-2xl p-4 text-white border border-gray-700 overflow-auto">
            <div className="flex items-center gap-2 mb-3">
              <img src={card.logo} alt="" className="w-6 h-6 rounded-full bg-white" onError={(e) => e.target.style.display='none'} />
              <span className="font-bold text-sm">{card.name}</span>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded ${card.category === 'crypto' ? 'bg-lime-500/20 text-lime-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {card.category === 'crypto' ? 'CRYPTO' : 'NEOBANK'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-gray-800 rounded p-2"><span className="text-gray-500">Cashback</span><p className="font-bold text-lime-400">{card.cashback}</p></div>
              <div className="bg-gray-800 rounded p-2"><span className="text-gray-500">FX Fee</span><p className="font-bold text-green-400">{card.fxFee}</p></div>
              <div className="bg-gray-800 rounded p-2"><span className="text-gray-500">Network</span><p className="font-bold">{card.network}</p></div>
              <div className="bg-gray-800 rounded p-2"><span className="text-gray-500">Custody</span><p className="font-bold text-cyan-400">{card.custody}</p></div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs">+ Compare</button>
              <button className="flex-1 py-2 bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 rounded text-xs font-bold">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubscribeModal({ open, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-lime-400 to-emerald-500 p-5 text-gray-900">
          <h3 className="text-xl font-bold">Stay Updated</h3>
          <p className="text-sm opacity-80">Get crypto card news and deals.</p>
        </div>
        <div className="p-5 space-y-3">
          <input type="text" placeholder="Name" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" />
          <input type="email" placeholder="Email" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" />
          <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
            <option>Country</option><option>United States</option><option>United Kingdom</option><option>Other</option>
          </select>
          <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
            <option>Monthly spend (USD)</option><option>Less than $500</option><option>$500 - $2,500</option><option>$2,500+</option>
          </select>
          <button className="w-full py-2 bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-bold rounded-lg">Subscribe</button>
          <button onClick={onClose} className="w-full py-1 text-gray-500 text-sm">Maybe later</button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [filter, setFilter] = useState('all')
  const [showSubscribe, setShowSubscribe] = useState(false)

  const filtered = filter === 'all' ? cards : cards.filter(c => c.category === filter)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center font-bold text-sm">S</div>
            <div>
              <h1 className="font-bold text-lg">Spendbase</h1>
              <p className="text-gray-500 text-xs">Crypto card comparison</p>
            </div>
          </div>
          <button onClick={() => setShowSubscribe(true)} className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg text-sm font-medium">
            Subscribe
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Explore Crypto Cards</h2>
          <p className="text-gray-400 text-sm">Hover over cards to see details</p>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'crypto', 'neobank'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f ? 'bg-lime-400 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
              {f === 'all' ? 'All Cards' : f === 'crypto' ? 'Crypto-Native' : 'Neobank'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(card => <Card key={card.id} card={card} />)}
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-lime-400">$18B+</p>
            <p className="text-gray-500 text-xs">Annual Volume</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">$308B</p>
            <p className="text-gray-500 text-xs">Stablecoin Supply</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-cyan-400">460%</p>
            <p className="text-gray-500 text-xs">YoY Growth</p>
          </div>
        </div>
      </main>

      <SubscribeModal open={showSubscribe} onClose={() => setShowSubscribe(false)} />
    </div>
  )
}
