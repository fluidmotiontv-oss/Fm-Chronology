/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ArchiveItem, 
  Modality, 
  Era 
} from '../types';
import { 
  Search, 
  Filter, 
  Image as ImageIcon, 
  Film, 
  Volume2, 
  Code, 
  FileText, 
  Coins, 
  MapPin, 
  Clock, 
  Sparkles, 
  ExternalLink, 
  Calendar,
  X,
  Play,
  Copy,
  Check
} from 'lucide-react';
import { audioEngine } from '../utils/audioSynth';

interface TimelineViewProps {
  items: ArchiveItem[];
  onSelectForSynthesis: (item: ArchiveItem) => void;
}

const MODALITY_CONFIG: Record<Modality, { label: string; icon: React.FC<{ className?: string }>; color: string }> = {
  image: { label: 'Images', icon: ImageIcon, color: 'text-amber-400 bg-amber-950/60 border-amber-800' },
  video: { label: 'Video', icon: Film, color: 'text-red-400 bg-red-950/60 border-red-800' },
  audio: { label: 'Audio', icon: Volume2, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800' },
  code: { label: 'Code', icon: Code, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' },
  text: { label: 'Chat & Text', icon: FileText, color: 'text-blue-400 bg-blue-950/60 border-blue-800' },
  ledger: { label: 'Currency Ledger', icon: Coins, color: 'text-yellow-400 bg-yellow-950/60 border-yellow-800' },
};

const ERA_LABELS: Record<Era, string> = {
  'era-1-waikato-germination': 'Era I: Waikato Germination & Sunset Sands (2020)',
  'era-2-tokyo-labs': 'Era II: Tokyo Warehouse Labs & Shibuya Temporal (2021)',
  'era-3-dragon9-mesh': 'Era III: Dragon9 OSS Clock & 36 Country Nodes (2022)',
  'era-4-currency-register': 'Era IV: Currency Register & Sovereign Barter (2023-2024)',
  'era-5-multimodal-future': 'Era V: Multimodal Synchronized Future (2025-2026)',
};

export const TimelineView: React.FC<TimelineViewProps> = ({ items, onSelectForSynthesis }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState<Modality | 'all'>('all');
  const [selectedEra, setSelectedEra] = useState<Era | 'all'>('all');
  const [activeItem, setActiveItem] = useState<ArchiveItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = 
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesModality = selectedModality === 'all' || item.modality === selectedModality;
      const matchesEra = selectedEra === 'all' || item.era === selectedEra;

      return matchesSearch && matchesModality && matchesEra;
    });
  }, [items, searchQuery, selectedModality, selectedEra]);

  const handleCopyContent = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="timeline-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chronological archives (e.g. 'Pee Dub', 'Shibuya', 'Rust daemon', 'Bolex', 'Ledger')..."
              className="w-full pl-10 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Era Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400 hidden sm:block" />
            <select
              id="timeline-era-select"
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value as Era | 'all')}
              className="bg-stone-950 border border-stone-800 text-stone-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Historical Eras (2020–2026)</option>
              <option value="era-1-waikato-germination">Era I: Waikato Germination (2020)</option>
              <option value="era-2-tokyo-labs">Era II: Tokyo Warehouse Labs (2021)</option>
              <option value="era-3-dragon9-mesh">Era III: 36 Country Nodes Mesh (2022)</option>
              <option value="era-4-currency-register">Era IV: Currency Register (2023-24)</option>
              <option value="era-5-multimodal-future">Era V: Multimodal Future (2025-26)</option>
            </select>
          </div>
        </div>

        {/* Modality Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
          <button
            onClick={() => setSelectedModality('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition whitespace-nowrap ${
              selectedModality === 'all'
                ? 'bg-stone-100 text-stone-900 border-stone-100 font-semibold'
                : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
          >
            All Modalities ({items.length})
          </button>

          {(Object.keys(MODALITY_CONFIG) as Modality[]).map((m) => {
            const config = MODALITY_CONFIG[m];
            const Icon = config.icon;
            const count = items.filter(i => i.modality === m).length;
            const isSelected = selectedModality === m;

            return (
              <button
                key={m}
                id={`filter-modality-${m}`}
                onClick={() => setSelectedModality(m)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition whitespace-nowrap ${
                  isSelected
                    ? `${config.color} font-semibold ring-1 ring-cyan-500`
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{config.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline Stream Header */}
      <div className="flex items-center justify-between text-xs text-stone-400 px-1 font-mono">
        <div>
          Showing <span className="text-cyan-400 font-bold">{filteredItems.length}</span> ingested artifacts in unbroken chronological sequence
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-stone-500" />
          <span>Nonary Time Aligned</span>
        </div>
      </div>

      {/* Chronological Feed */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => {
          const modConfig = MODALITY_CONFIG[item.modality];
          const ModIcon = modConfig.icon;

          return (
            <div
              key={item.id}
              id={`archive-card-${item.id}`}
              onClick={() => setActiveItem(item)}
              className="group bg-stone-900/90 hover:bg-stone-850 border border-stone-800 hover:border-stone-700 rounded-xl p-5 shadow-sm transition cursor-pointer relative overflow-hidden"
            >
              {/* Left Accent indicator */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border font-medium text-[11px] ${modConfig.color}`}>
                      <ModIcon className="w-3 h-3" />
                      <span>{modConfig.label}</span>
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-stone-950 text-cyan-300 border border-stone-800 font-mono text-[11px]">
                      {item.dragon9Timestamp}
                    </span>

                    <span className="text-stone-500 font-mono text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </span>

                    <span className="text-stone-400 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      <span>{item.location}</span>
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="text-base font-semibold text-stone-100 group-hover:text-cyan-300 transition">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[11px] px-2 py-0.5 rounded bg-stone-950 text-stone-400 border border-stone-800/80 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Media Thumbnail or Code Preview Snippet */}
                {item.mediaUrl ? (
                  <div className="w-full md:w-44 h-28 rounded-lg overflow-hidden border border-stone-800 relative shrink-0 bg-stone-950">
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {item.modality === 'video' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white/90 drop-shadow" />
                      </div>
                    )}
                  </div>
                ) : item.modality === 'code' ? (
                  <div className="w-full md:w-56 h-28 rounded-lg bg-stone-950 border border-stone-800 p-2.5 font-mono text-[10px] text-emerald-400/90 overflow-hidden shrink-0">
                    <div className="text-stone-500 border-b border-stone-800 pb-1 mb-1 flex items-center justify-between">
                      <span>RUST / TS ENGINE</span>
                      <span>OSS</span>
                    </div>
                    <div className="line-clamp-4 leading-tight opacity-80">
                      {item.content}
                    </div>
                  </div>
                ) : item.modality === 'audio' ? (
                  <div className="w-full md:w-44 h-28 rounded-lg bg-cyan-950/30 border border-cyan-900/50 p-3 flex flex-col justify-between shrink-0">
                    <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-mono font-medium">
                      <Volume2 className="w-4 h-4 animate-pulse" />
                      <span>54.2 Hz Acoustic</span>
                    </div>
                    {/* Simulated Waveform Bars */}
                    <div className="flex items-end gap-1 h-10 px-1">
                      {[40, 70, 100, 85, 45, 60, 90, 75, 50, 65, 80, 55, 30].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-cyan-400/80 rounded-t"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">Pee Dub Sub-harmonic</div>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-stone-900/50 border border-stone-800 rounded-xl">
            <Search className="w-8 h-8 text-stone-600 mx-auto mb-2" />
            <div className="text-stone-300 font-semibold text-sm">No archival artifacts matched your filter criteria</div>
            <div className="text-stone-500 text-xs mt-1">Try resetting the modality or clearing your search query.</div>
            <button
              onClick={() => { setSearchQuery(''); setSelectedModality('all'); setSelectedEra('all'); }}
              className="mt-4 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Full Modal Viewer for Active Artifact */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-800 flex items-start justify-between gap-4 sticky top-0 bg-stone-900 z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded border text-[11px] font-mono ${MODALITY_CONFIG[activeItem.modality].color}`}>
                    {MODALITY_CONFIG[activeItem.modality].label}
                  </span>
                  <span className="font-mono text-cyan-300 text-xs">{activeItem.dragon9Timestamp}</span>
                </div>
                <h2 className="text-lg font-bold text-stone-100">{activeItem.title}</h2>
                <div className="text-xs text-stone-400 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeItem.location}</span>
                  <span>•</span>
                  <span>{new Date(activeItem.timestamp).toUTCString()}</span>
                </div>
              </div>
              <button
                id="close-modal-btn"
                onClick={() => setActiveItem(null)}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Media Display */}
              {activeItem.mediaUrl && (
                <div className="rounded-xl overflow-hidden border border-stone-800 max-h-96 bg-black relative">
                  <img
                    src={activeItem.mediaUrl}
                    alt={activeItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain mx-auto"
                  />
                  {activeItem.modality === 'video' && (
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur px-3 py-1 rounded text-xs text-white font-mono flex items-center gap-2">
                      <Play className="w-3.5 h-3.5 text-red-500 fill-current" />
                      <span>ProRes 422 HQ • Master 4K Stream</span>
                    </div>
                  )}
                </div>
              )}

              {/* Summary */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800/80">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1 font-semibold">
                  Archival Digest Summary
                </div>
                <p className="text-sm text-stone-200 leading-relaxed">
                  {activeItem.summary}
                </p>
              </div>

              {/* Detailed Content / Code / Transcript */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                  <span className="font-semibold text-stone-300">
                    {activeItem.modality === 'code' ? 'Source File & Implementation' : activeItem.modality === 'text' ? 'Historical Transcript Log' : 'Archival Field Observations'}
                  </span>
                  <button
                    onClick={() => handleCopyContent(activeItem.content, activeItem.id)}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition text-xs"
                  >
                    {copiedId === activeItem.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === activeItem.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 font-mono text-xs text-stone-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-80 scrollbar-thin">
                  {activeItem.content}
                </div>
              </div>

              {/* Telemetry & Metadata Details */}
              {activeItem.metadata && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {activeItem.metadata.camera && (
                    <div className="bg-stone-950/70 p-3 rounded-lg border border-stone-800">
                      <div className="text-[10px] text-stone-500 uppercase font-mono">Camera / Capture</div>
                      <div className="text-xs text-stone-200 font-medium mt-0.5">{activeItem.metadata.camera}</div>
                    </div>
                  )}
                  {activeItem.metadata.tidePhase && (
                    <div className="bg-stone-950/70 p-3 rounded-lg border border-stone-800">
                      <div className="text-[10px] text-stone-500 uppercase font-mono">Tidal Phase (Pee Dub)</div>
                      <div className="text-xs text-cyan-300 font-medium mt-0.5">{activeItem.metadata.tidePhase}</div>
                    </div>
                  )}
                  {activeItem.metadata.swellFt !== undefined && (
                    <div className="bg-stone-950/70 p-3 rounded-lg border border-stone-800">
                      <div className="text-[10px] text-stone-500 uppercase font-mono">Swell Height</div>
                      <div className="text-xs text-amber-300 font-medium mt-0.5">{activeItem.metadata.swellFt} ft</div>
                    </div>
                  )}
                  {activeItem.metadata.audioHz !== undefined && (
                    <div className="bg-stone-950/70 p-3 rounded-lg border border-stone-800">
                      <div className="text-[10px] text-stone-500 uppercase font-mono">Resonance Frequency</div>
                      <div className="text-xs text-teal-300 font-medium mt-0.5">{activeItem.metadata.audioHz} Hz</div>
                    </div>
                  )}
                  {activeItem.metadata.gitCommit && (
                    <div className="bg-stone-950/70 p-3 rounded-lg border border-stone-800 col-span-2">
                      <div className="text-[10px] text-stone-500 uppercase font-mono">Git Commit Hash</div>
                      <div className="text-xs text-emerald-400 font-mono mt-0.5">{activeItem.metadata.gitCommit}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-mono">
                Artifact ID: {activeItem.id}
              </span>
              <button
                id="modal-select-synthesis-btn"
                onClick={() => {
                  onSelectForSynthesis(activeItem);
                  setActiveItem(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-semibold text-xs transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Send to AI Chronicle Synthesizer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
