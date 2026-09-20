/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  Radio, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Globe, 
  Database, 
  GitBranch, 
  Layers,
  Activity
} from 'lucide-react';
import { getDragon9Time } from '../utils/dragon9';
import { Dragon9Time } from '../types';
import { audioEngine } from '../utils/audioSynth';

interface HeaderProps {
  activeTab: 'timeline' | 'synthesizer' | 'nodes' | 'ledger' | 'repo';
  setActiveTab: (tab: 'timeline' | 'synthesizer' | 'nodes' | 'ledger' | 'repo') => void;
  onQuickSynthesize: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onQuickSynthesize }) => {
  const [d9Time, setD9Time] = useState<Dragon9Time>(getDragon9Time());
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setD9Time(getDragon9Time());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleAudio = () => {
    const active = audioEngine.toggleAmbient((state) => {
      setIsAudioActive(state);
    });
    setIsAudioActive(active);
    if (active) {
      audioEngine.playHarmonicChime();
    }
  };

  return (
    <header id="master-header" className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur border-b border-stone-800 text-stone-100 shadow-md">
      {/* Top Telemetry Ticker */}
      <div className="bg-stone-950 border-b border-stone-800/80 px-4 py-1.5 text-xs text-stone-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>36/36 NODES SYNCED</span>
          </div>
          <span className="text-stone-700">|</span>
          <span className="font-mono text-stone-300">
            Anchor-1: <span className="text-amber-300">Tokyo JST (0.12ms)</span>
          </span>
          <span className="text-stone-700">|</span>
          <span className="font-mono text-stone-300">
            Anchor-2: <span className="text-cyan-300">Port Waikato "Pee Dub" (0.04ms)</span>
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <span className="text-stone-400">Harmonic Base: <span className="text-teal-300">{d9Time.harmonicFrequencyHz} Hz</span></span>
          <span className="text-stone-700">|</span>
          <span className="text-stone-400">Ratio: <span className="text-stone-300">54m/hr Nonary</span></span>
          <span className="text-stone-700">|</span>
          <span className="text-stone-400">Epoch: <span className="text-amber-400">Cycle #{d9Time.cycle}</span></span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-amber-600 flex items-center justify-center shadow-inner text-stone-950 font-bold text-lg">
            D9
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold tracking-tight text-lg text-stone-100 flex items-center gap-1.5">
                FluidmotionTV
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-normal">
                  Chronological Master Archive
                </span>
              </h1>
            </div>
            <p className="text-xs text-stone-400">The Fluid Motion of the Future Framework</p>
          </div>
        </div>

        {/* Live Dragon9 Master Clock Widget */}
        <div className="flex items-center gap-4 bg-stone-950/80 px-4 py-2 rounded-xl border border-stone-800 shadow-sm">
          <div className="flex items-center gap-2 text-stone-300">
            <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
            <div className="text-left">
              <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold font-mono">
                Dragon9 Time (54m)
              </div>
              <div className="text-lg font-mono font-bold tracking-wider text-cyan-300">
                {d9Time.dragon9TimeString}
              </div>
            </div>
          </div>

          <div className="h-7 w-px bg-stone-800" />

          <div className="text-left">
            <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold font-mono">
              UTC Reference
            </div>
            <div className="text-sm font-mono text-stone-300">
              {d9Time.standardTimeString}
            </div>
          </div>

          <div className="h-7 w-px bg-stone-800 hidden sm:block" />

          {/* Ambient Soundscape Toggle */}
          <button
            id="ambient-sound-toggle-btn"
            onClick={handleToggleAudio}
            title={isAudioActive ? 'Mute 54Hz / Tidal Soundscape' : 'Play 54Hz / Tidal Soundscape'}
            className={`p-2 rounded-lg border transition flex items-center gap-1.5 text-xs font-medium ${
              isAudioActive
                ? 'bg-cyan-950/90 text-cyan-300 border-cyan-600 shadow-sm shadow-cyan-900/40'
                : 'bg-stone-900 text-stone-400 border-stone-700 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            {isAudioActive ? <Volume2 className="w-4 h-4 text-cyan-400 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden lg:inline">{isAudioActive ? '54Hz Tidal On' : 'Ambient Tone'}</span>
          </button>
        </div>

        {/* Action Button */}
        <button
          id="quick-ai-synthesize-btn"
          onClick={onQuickSynthesize}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-stone-950 font-semibold text-xs tracking-wide shadow-sm transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Multimodal Synthesis</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav id="master-nav-tabs" className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto scrollbar-none border-t border-stone-800/60 pt-1 pb-1">
        <button
          id="nav-tab-timeline"
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition whitespace-nowrap ${
            activeTab === 'timeline'
              ? 'bg-stone-800 text-cyan-300 border-b-2 border-cyan-400'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Chronological Archive</span>
        </button>

        <button
          id="nav-tab-synthesizer"
          onClick={() => setActiveTab('synthesizer')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition whitespace-nowrap ${
            activeTab === 'synthesizer'
              ? 'bg-stone-800 text-cyan-300 border-b-2 border-cyan-400'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Gemini AI Chronicle Synthesizer</span>
        </button>

        <button
          id="nav-tab-nodes"
          onClick={() => setActiveTab('nodes')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition whitespace-nowrap ${
            activeTab === 'nodes'
              ? 'bg-stone-800 text-cyan-300 border-b-2 border-cyan-400'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-teal-400" />
          <span>36 Country Nodes Mesh</span>
        </button>

        <button
          id="nav-tab-ledger"
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition whitespace-nowrap ${
            activeTab === 'ledger'
              ? 'bg-stone-800 text-cyan-300 border-b-2 border-cyan-400'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-yellow-400" />
          <span>Currency Register & Barter</span>
        </button>

        <button
          id="nav-tab-repo"
          onClick={() => setActiveTab('repo')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition whitespace-nowrap ${
            activeTab === 'repo'
              ? 'bg-stone-800 text-cyan-300 border-b-2 border-cyan-400'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5 text-purple-400" />
          <span>OSS Clock Code Ingest (fluidmotiontv-clock)</span>
        </button>
      </nav>
    </header>
  );
};
