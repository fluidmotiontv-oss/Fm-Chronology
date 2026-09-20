/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CURRENCY_TRANSACTIONS } from '../data/archiveData';
import { CurrencyTransaction } from '../types';
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Search, 
  Check, 
  Copy, 
  Hash, 
  Calendar 
} from 'lucide-react';

export const LedgerView: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredTx = CURRENCY_TRANSACTIONS.filter((tx) => {
    const matchesSearch =
      search === '' ||
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.sourceNode.toLowerCase().includes(search.toLowerCase()) ||
      tx.destinationNode.toLowerCase().includes(search.toLowerCase()) ||
      tx.hash.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || tx.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const totalD9Volume = CURRENCY_TRANSACTIONS.reduce((acc, tx) => acc + tx.amountD9, 0);

  return (
    <div className="space-y-6">
      {/* Ledger Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>TOTAL REGISTER VOLUME</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-2">
            {totalD9Volume.toLocaleString()} D9
          </div>
          <div className="text-xs text-stone-500 mt-1">Backed by verified coastal edge compute & media archives</div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>SOVEREIGN SETTLEMENT NODES</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">
            36 Coastal Co-signers
          </div>
          <div className="text-xs text-stone-500 mt-1">Decentralized multi-signature consensus</div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>ACTIVE GENESIS BLOCK</span>
            <Hash className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-mono text-cyan-300 truncate mt-3 bg-stone-950 p-2 rounded border border-stone-800">
            0x9f4a88b17c22e038db44a10298e5fbb412c98204
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono">Node 01 (Tokyo) & Node 02 (Port Waikato) Key</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="tx-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search register (e.g. 'TX-0001', 'Biarritz', 'Hardware Bounty', 'Gun')..."
            className="w-full pl-9 pr-3 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          id="tx-category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-stone-950 border border-stone-800 text-stone-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 font-mono"
        >
          <option value="all">All Transaction Categories</option>
          <option value="Cinematography Syndication">Cinematography Syndication</option>
          <option value="Hardware Node Bounty">Hardware Node Bounty</option>
          <option value="Barter Goods">Barter Goods</option>
          <option value="Bandwidth Settlement">Bandwidth Settlement</option>
          <option value="Archival Mint">Archival Mint</option>
        </select>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTx.map((tx) => (
          <div
            key={tx.id}
            id={`transaction-row-${tx.id}`}
            className="bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-xl p-5 shadow-sm transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/60 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-stone-950 text-cyan-300 border border-stone-800">
                  {tx.id}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/80 font-mono">
                  {tx.category}
                </span>
                <span className="text-xs text-stone-500 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                </span>
                <span className="text-xs text-cyan-400 font-mono font-medium">
                  {tx.dragon9Timestamp}
                </span>
              </div>

              <div className="text-right">
                <div className="text-base font-bold font-mono text-amber-300">
                  +{tx.amountD9.toLocaleString()} D9
                </div>
                <div className="text-[11px] text-stone-400 font-mono">
                  {tx.fiatEquiv}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1 flex-1">
                <p className="text-stone-200 leading-relaxed font-medium">
                  {tx.description}
                </p>
                <div className="flex items-center gap-2 text-stone-400 font-mono text-[11px]">
                  <span>From: <strong className="text-stone-300">{tx.sourceNode}</strong></span>
                  <span>→</span>
                  <span>To: <strong className="text-stone-300">{tx.destinationNode}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 shrink-0">
                <span className="font-mono text-[11px] text-stone-400 truncate max-w-[200px]">
                  {tx.hash}
                </span>
                <button
                  onClick={() => handleCopy(tx.hash)}
                  title="Copy verification hash"
                  className="text-stone-500 hover:text-stone-300"
                >
                  {copiedHash === tx.hash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTx.length === 0 && (
          <div className="text-center py-12 bg-stone-900/50 border border-stone-800 rounded-xl text-stone-400 text-xs">
            No currency transactions match your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
