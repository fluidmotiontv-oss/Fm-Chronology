/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { TimelineView } from './components/TimelineView';
import { SynthesizerView } from './components/SynthesizerView';
import { WorldNodesView } from './components/WorldNodesView';
import { LedgerView } from './components/LedgerView';
import { CodeRepoView } from './components/CodeRepoView';
import { CHRONOLOGICAL_ARCHIVE } from './data/archiveData';
import { ArchiveItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'synthesizer' | 'nodes' | 'ledger' | 'repo'>('timeline');
  const [presetItem, setPresetItem] = useState<ArchiveItem | null>(null);

  const handleSelectForSynthesis = (item: ArchiveItem) => {
    setPresetItem(item);
    setActiveTab('synthesizer');
  };

  const handleQuickSynthesize = () => {
    setActiveTab('synthesizer');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-stone-950">
      {/* Sticky Header with Live Dragon9 Clock & Telemetry */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickSynthesize={handleQuickSynthesize}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'timeline' && (
          <TimelineView
            items={CHRONOLOGICAL_ARCHIVE}
            onSelectForSynthesis={handleSelectForSynthesis}
          />
        )}

        {activeTab === 'synthesizer' && (
          <SynthesizerView
            archiveItems={CHRONOLOGICAL_ARCHIVE}
            presetItem={presetItem}
            onClearPreset={() => setPresetItem(null)}
          />
        )}

        {activeTab === 'nodes' && <WorldNodesView />}

        {activeTab === 'ledger' && <LedgerView />}

        {activeTab === 'repo' && <CodeRepoView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-900/60 py-6 text-xs text-stone-500 text-center font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-stone-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>FluidmotionTV-ChronologicalMasterArchive</span>
            <span>•</span>
            <span>The Fluid Motion of the Future</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <span>Synchronized across 36 Country Nodes</span>
            <span>•</span>
            <span>Tokyo JST & Port Waikato NZST</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
