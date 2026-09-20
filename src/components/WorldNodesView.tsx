/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NODES_36 } from '../data/nodeMesh';
import { NodeInfo } from '../types';
import { 
  Globe, 
  Activity, 
  Waves, 
  Thermometer, 
  Cpu, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Search,
  LayoutGrid,
  BarChart3,
  Layers
} from 'lucide-react';
import { audioEngine } from '../utils/audioSynth';
import { NetworkHeatmap } from './NetworkHeatmap';

export const WorldNodesView: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(NODES_36[1]); // Default to Node-02 Port Waikato
  const [activeTab, setActiveTab] = useState<'both' | 'heatmap' | 'nodes'>('both');

  const filteredNodes = NODES_36.filter((node) => {
    const matchesSearch = 
      search === '' || 
      node.city.toLowerCase().includes(search.toLowerCase()) ||
      node.country.toLowerCase().includes(search.toLowerCase()) ||
      node.activeFeed.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedRegion === 'all') return true;
    if (selectedRegion === 'apac') return ['JP', 'NZ', 'AU', 'ID', 'PH', 'LK'].includes(node.countryCode);
    if (selectedRegion === 'emea') return ['ZA', 'FR', 'PT', 'ES', 'GB', 'IE', 'MA'].includes(node.countryCode);
    if (selectedRegion === 'americas') return ['US', 'CA', 'MX', 'CR', 'PE', 'CL', 'BR'].includes(node.countryCode);
    return true;
  });

  const handleSimulateGlobalPing = () => {
    setIsPinging(true);
    audioEngine.playHarmonicChime();
    setTimeout(() => {
      setIsPinging(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Overview Matrix Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-stone-500 uppercase">Synchronized Mesh Nodes</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">36 / 36</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Global coastal coverage</div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-stone-500 uppercase">Average Network Drift</div>
          <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">0.14 ms</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Sub-millisecond phase lock</div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-stone-500 uppercase">Primary Coastal Anchors</div>
          <div className="text-sm font-bold text-amber-300 mt-2 font-mono">
            Node 01: Tokyo <br />
            Node 02: Port Waikato
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[11px] font-mono text-stone-500 uppercase">Sync Broadcast</div>
          <button
            id="ping-all-nodes-btn"
            onClick={handleSimulateGlobalPing}
            disabled={isPinging}
            className="w-full mt-2 py-2 px-3 rounded-lg bg-stone-950 border border-stone-700 hover:border-cyan-500 text-xs font-mono text-cyan-300 flex items-center justify-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isPinging ? 'Pinging 36 Nodes...' : 'Gossip Pulse Test'}</span>
          </button>
        </div>
      </div>

      {/* View Mode, Search & Region Filter Bar */}
      <div className="flex flex-col gap-3 bg-stone-900 border border-stone-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs font-mono">
            <button
              id="view-tab-both"
              onClick={() => setActiveTab('both')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                activeTab === 'both'
                  ? 'bg-stone-800 text-cyan-300 font-bold border border-cyan-700/60'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Telemetry</span>
            </button>
            <button
              id="view-tab-heatmap"
              onClick={() => setActiveTab('heatmap')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                activeTab === 'heatmap'
                  ? 'bg-stone-800 text-cyan-300 font-bold border border-cyan-700/60'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>30-Day D3 Heatmap</span>
            </button>
            <button
              id="view-tab-nodes"
              onClick={() => setActiveTab('nodes')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                activeTab === 'nodes'
                  ? 'bg-stone-800 text-cyan-300 font-bold border border-cyan-700/60'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
              <span>Nodes Grid</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="node-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country nodes (e.g. 'Tokyo', 'Port Waikato', 'Hossegor')..."
              className="w-full pl-9 pr-3 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Region Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1 border-t border-stone-800/60">
          <span className="text-[11px] font-mono text-stone-500 uppercase mr-1">Region:</span>
          <button
            id="filter-region-all"
            onClick={() => setSelectedRegion('all')}
            className={`px-3 py-1 rounded-lg border transition ${
              selectedRegion === 'all'
                ? 'bg-stone-100 text-stone-900 border-stone-100 font-semibold'
                : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
          >
            All Regions ({NODES_36.length})
          </button>
          <button
            id="filter-region-apac"
            onClick={() => setSelectedRegion('apac')}
            className={`px-3 py-1 rounded-lg border transition ${
              selectedRegion === 'apac'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700 font-semibold'
                : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
          >
            Asia-Pacific (11)
          </button>
          <button
            id="filter-region-americas"
            onClick={() => setSelectedRegion('americas')}
            className={`px-3 py-1 rounded-lg border transition ${
              selectedRegion === 'americas'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700 font-semibold'
                : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
          >
            Americas (13)
          </button>
          <button
            id="filter-region-emea"
            onClick={() => setSelectedRegion('emea')}
            className={`px-3 py-1 rounded-lg border transition ${
              selectedRegion === 'emea'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700 font-semibold'
                : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
          >
            EMEA & Atlantic (12)
          </button>
        </div>
      </div>

      {/* D3 Heatmap Section */}
      {(activeTab === 'both' || activeTab === 'heatmap') && (
        <NetworkHeatmap
          nodes={filteredNodes}
          selectedNodeId={selectedNode?.id}
          onSelectNode={(node) => setSelectedNode(node)}
        />
      )}

      {/* Heatmap-only mode quick inspector bar */}
      {activeTab === 'heatmap' && selectedNode && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              NODE #{selectedNode.nodeNumber.toString().padStart(2, '0')}
            </span>
            <div>
              <span className="text-stone-100 font-bold text-sm">{selectedNode.city}</span>
              <span className="text-stone-400 ml-1.5 font-normal">({selectedNode.country})</span>
            </div>
            <span className="text-stone-500 hidden sm:inline">|</span>
            <span className="text-stone-300 hidden sm:inline">{selectedNode.activeFeed}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            {selectedNode.waveTideData && (
              <span className="text-amber-300 flex items-center gap-1">
                <Waves className="w-3.5 h-3.5" />
                {selectedNode.waveTideData.swellHeightM}m swell · {selectedNode.waveTideData.tide}
              </span>
            )}
            <span className="text-cyan-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              D9·{selectedNode.currentDragon9Hour.toString().padStart(2, '0')}:{selectedNode.currentDragon9Minute.toString().padStart(2, '0')}
            </span>
            <span className="text-emerald-400 font-bold">
              {selectedNode.driftMs >= 0 ? `+${selectedNode.driftMs}ms drift` : `${selectedNode.driftMs}ms drift`}
            </span>
          </div>
        </div>
      )}

      {/* Nodes Grid & Detailed Node Spotlight */}
      {(activeTab === 'both' || activeTab === 'nodes') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Nodes Grid List */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isPrimary = node.nodeNumber === 1 || node.nodeNumber === 2;

              return (
                <div
                  key={node.id}
                  id={`node-item-${node.id}`}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-stone-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                      : isPrimary
                      ? 'bg-stone-900/90 border-amber-800/70 hover:border-amber-600'
                      : 'bg-stone-900/60 border-stone-800 hover:bg-stone-850 hover:border-stone-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isPrimary ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-stone-950 text-stone-300'
                        }`}>
                          NODE #{node.nodeNumber.toString().padStart(2, '0')}
                        </span>
                        <span className="text-stone-400 font-semibold">{node.countryCode}</span>
                      </div>

                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <span className="text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {node.driftMs >= 0 ? `+${node.driftMs}ms` : `${node.driftMs}ms`}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-stone-100 text-sm flex items-center gap-1.5">
                      {node.city}
                      <span className="text-xs text-stone-400 font-normal">({node.country})</span>
                    </h3>

                    <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                      {node.activeFeed}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-800/70 flex items-center justify-between text-[11px] font-mono text-stone-400">
                    <div className="flex items-center gap-1 text-cyan-300">
                      <Clock className="w-3 h-3" />
                      <span>D9·{node.currentDragon9Hour.toString().padStart(2, '0')}:{node.currentDragon9Minute.toString().padStart(2, '0')}</span>
                    </div>

                    {node.waveTideData && (
                      <div className="flex items-center gap-1 text-amber-300">
                        <Waves className="w-3 h-3" />
                        <span>{node.waveTideData.swellHeightM}m swell</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Node Inspector Pane */}
          {selectedNode && (
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-lg space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-xs font-semibold">
                    NODE #{selectedNode.nodeNumber.toString().padStart(2, '0')} ACTIVE INSPECTION
                  </span>
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mesh Synced</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-stone-100">{selectedNode.city}</h3>
                  <div className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{selectedNode.country} ({selectedNode.coordinates[0].toFixed(2)}°, {selectedNode.coordinates[1].toFixed(2)}°)</span>
                  </div>
                </div>

                <div className="bg-stone-950 p-3.5 rounded-lg border border-stone-800 space-y-2 text-xs">
                  <div className="font-mono text-stone-400 uppercase text-[10px]">Active Stream & Pipeline</div>
                  <div className="text-stone-200 font-medium">{selectedNode.activeFeed}</div>
                </div>

                {selectedNode.waveTideData && (
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800">
                      <div className="text-[10px] text-stone-500 uppercase font-mono">Swell</div>
                      <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                        {selectedNode.waveTideData.swellHeightM} m
                      </div>
                    </div>
                    <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800">
                      <div className="text-[10px] text-stone-500 uppercase font-mono">Tide</div>
                      <div className="text-xs font-bold text-cyan-300 capitalize mt-1 font-mono">
                        {selectedNode.waveTideData.tide.replace('_', ' ')}
                      </div>
                    </div>
                    <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800">
                      <div className="text-[10px] text-stone-500 uppercase font-mono">Water Temp</div>
                      <div className="text-sm font-bold text-teal-300 font-mono mt-0.5">
                        {selectedNode.waveTideData.waterTempC}°C
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-stone-950 p-3.5 rounded-lg border border-stone-800 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-mono text-stone-400 text-[10px] uppercase">
                    <Cpu className="w-3 h-3 text-purple-400" />
                    <span>Hardware Specification</span>
                  </div>
                  <div className="text-stone-300 font-mono text-[11px] leading-relaxed">
                    {selectedNode.hardwareSpec}
                  </div>
                </div>

                <div className="bg-stone-950 p-3.5 rounded-lg border border-stone-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-400">Phase Oscillator Drift:</span>
                  <span className="text-emerald-400 font-bold">
                    {selectedNode.driftMs >= 0 ? `+${selectedNode.driftMs}ms` : `${selectedNode.driftMs}ms`}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-stone-500 font-mono text-center pt-3 border-t border-stone-800">
                Synchronized via fluidmotiontv-oss/Fluidmotiontv-clock daemon
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
