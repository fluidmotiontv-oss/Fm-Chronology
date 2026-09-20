/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { NodeInfo } from '../types';
import { generate30DayHeatmapData, NodeHeatmapData, DayActivity } from '../utils/heatmapData';
import { 
  Activity, 
  Calendar, 
  Clock, 
  Info, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Waves,
  Maximize2
} from 'lucide-react';

interface NetworkHeatmapProps {
  nodes: NodeInfo[];
  selectedNodeId?: string;
  onSelectNode: (node: NodeInfo) => void;
}

type MetricMode = 'activity' | 'pulses' | 'drift';

export const NetworkHeatmap: React.FC<NetworkHeatmapProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(900);
  const [metricMode, setMetricMode] = useState<MetricMode>('activity');
  const [hoveredCell, setHoveredCell] = useState<{
    data: DayActivity;
    node: NodeInfo;
    x: number;
    y: number;
  } | null>(null);

  // Generate 30-day activity datasets
  const heatmapDataset: NodeHeatmapData[] = useMemo(() => {
    return generate30DayHeatmapData(nodes);
  }, [nodes]);

  // Network-wide summary aggregates
  const networkStats = useMemo(() => {
    if (heatmapDataset.length === 0) return { avgUptime: 0, totalPulses: 0, optimalCount: 0 };
    const totalActivity = heatmapDataset.reduce((acc, curr) => acc + curr.avgActivity, 0);
    const totalPulses = heatmapDataset.reduce((acc, curr) => acc + curr.totalPulses, 0);
    const optimal = heatmapDataset.filter(d => d.status === 'optimal').length;
    return {
      avgUptime: Math.round(totalActivity / heatmapDataset.length),
      totalPulses,
      optimalCount: optimal,
    };
  }, [heatmapDataset]);

  // Track container width dynamically with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(Math.floor(entry.contentRect.width));
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // D3 Rendering
  useEffect(() => {
    if (!svgRef.current || heatmapDataset.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Dimensions
    const margin = {
      top: 36,
      right: 24,
      bottom: 28,
      left: containerWidth < 640 ? 110 : 160,
    };

    const rowHeight = 18;
    const numRows = heatmapDataset.length;
    const height = margin.top + numRows * rowHeight + margin.bottom;
    const width = Math.max(containerWidth, 480);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = numRows * rowHeight;

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale: 30 days (0 to 29)
    const daysArray = Array.from({ length: 30 }, (_, i) => i);
    const xScale = d3
      .scaleBand<number>()
      .domain(daysArray)
      .range([0, innerWidth])
      .paddingInner(0.08);

    // Y scale: Node IDs
    const nodeIds = heatmapDataset.map((d) => d.node.id);
    const yScale = d3
      .scaleBand<string>()
      .domain(nodeIds)
      .range([0, innerHeight])
      .paddingInner(0.12);

    // Color Scales
    const colorScaleActivity = d3
      .scaleLinear<string>()
      .domain([60, 75, 88, 96, 100])
      .range(['#1c1917', '#0e7490', '#06b6d4', '#2dd4bf', '#34d399']);

    const colorScalePulses = d3
      .scaleLinear<string>()
      .domain([900, 1150, 1350, 1500])
      .range(['#1c1917', '#3b82f6', '#06b6d4', '#fbbf24']);

    const colorScaleDrift = d3
      .scaleLinear<string>()
      .domain([0, 0.08, 0.20, 0.40])
      .range(['#10b981', '#06b6d4', '#f59e0b', '#ef4444']);

    const getColor = (day: DayActivity) => {
      if (metricMode === 'activity') return colorScaleActivity(day.activityPercent);
      if (metricMode === 'pulses') return colorScalePulses(day.syncPulses);
      return colorScaleDrift(Math.abs(day.avgDriftMs));
    };

    // Row backgrounds & selection highlight
    const rowGroup = g.append('g').attr('class', 'rows');

    heatmapDataset.forEach((nodeItem) => {
      const y = yScale(nodeItem.node.id) || 0;
      const isSelected = nodeItem.node.id === selectedNodeId;

      rowGroup
        .append('rect')
        .attr('x', -margin.left + 8)
        .attr('y', y)
        .attr('width', width - 16)
        .attr('height', yScale.bandwidth())
        .attr('rx', 4)
        .attr('fill', isSelected ? 'rgba(6, 182, 212, 0.12)' : 'transparent')
        .attr('stroke', isSelected ? 'rgba(6, 182, 212, 0.4)' : 'none')
        .attr('stroke-width', 1)
        .style('cursor', 'pointer')
        .on('click', () => onSelectNode(nodeItem.node));
    });

    // Render Heatmap Cells
    const cellGroup = g.append('g').attr('class', 'cells');

    heatmapDataset.forEach((nodeItem) => {
      const y = yScale(nodeItem.node.id) || 0;

      nodeItem.days.forEach((day) => {
        const x = xScale(day.dayIndex) || 0;
        const fill = getColor(day);
        const isSelectedNode = nodeItem.node.id === selectedNodeId;

        const cell = cellGroup
          .append('rect')
          .attr('id', `heatmap-cell-${nodeItem.node.nodeNumber}-${day.dayIndex}`)
          .attr('x', x)
          .attr('y', y)
          .attr('width', xScale.bandwidth())
          .attr('height', yScale.bandwidth())
          .attr('rx', 2.5)
          .attr('fill', fill)
          .attr('stroke', isSelectedNode ? 'rgba(6, 182, 212, 0.6)' : 'rgba(28, 25, 23, 0.5)')
          .attr('stroke-width', 0.6)
          .style('cursor', 'pointer')
          .style('transition', 'transform 0.1s ease, filter 0.1s ease');

        cell
          .on('mouseenter', (event: MouseEvent) => {
            cell
              .attr('stroke', '#38bdf8')
              .attr('stroke-width', 1.5)
              .style('filter', 'brightness(1.25)');

            const rect = svgRef.current?.getBoundingClientRect();
            if (rect) {
              setHoveredCell({
                data: day,
                node: nodeItem.node,
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              });
            }
          })
          .on('mousemove', (event: MouseEvent) => {
            const rect = svgRef.current?.getBoundingClientRect();
            if (rect) {
              setHoveredCell({
                data: day,
                node: nodeItem.node,
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              });
            }
          })
          .on('mouseleave', () => {
            cell
              .attr('stroke', isSelectedNode ? 'rgba(6, 182, 212, 0.6)' : 'rgba(28, 25, 23, 0.5)')
              .attr('stroke-width', 0.6)
              .style('filter', 'none');
            setHoveredCell(null);
          })
          .on('click', () => {
            onSelectNode(nodeItem.node);
          });
      });
    });

    // Y Axis: Node Labels
    const yAxisGroup = g.append('g').attr('class', 'y-axis');

    heatmapDataset.forEach((nodeItem) => {
      const y = (yScale(nodeItem.node.id) || 0) + yScale.bandwidth() / 2;
      const isSelected = nodeItem.node.id === selectedNodeId;
      const isAnchor = nodeItem.node.nodeNumber === 1 || nodeItem.node.nodeNumber === 2;

      const nodeLabel = yAxisGroup
        .append('g')
        .attr('transform', `translate(-12, ${y})`)
        .style('cursor', 'pointer')
        .on('click', () => onSelectNode(nodeItem.node));

      // Node number prefix badge
      nodeLabel
        .append('text')
        .attr('x', containerWidth < 640 ? -70 : -110)
        .attr('y', 3.5)
        .attr('text-anchor', 'start')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('font-weight', isAnchor ? 'bold' : 'normal')
        .attr('fill', isAnchor ? '#f59e0b' : '#78716c')
        .text(`#${nodeItem.node.nodeNumber.toString().padStart(2, '0')}`);

      // City Name
      const labelText = containerWidth < 640 
        ? `${nodeItem.node.city.slice(0, 10)}` 
        : `${nodeItem.node.city} (${nodeItem.node.countryCode})`;

      nodeLabel
        .append('text')
        .attr('x', 0)
        .attr('y', 3.5)
        .attr('text-anchor', 'end')
        .attr('font-size', '10px')
        .attr('font-family', 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace')
        .attr('font-weight', isSelected ? 'bold' : isAnchor ? '600' : 'normal')
        .attr('fill', isSelected ? '#38bdf8' : isAnchor ? '#fde68a' : '#d6d3d1')
        .text(labelText);
    });

    // Top X Axis: Dates & Day intervals
    const xAxisGroup = g.append('g').attr('class', 'x-axis');

    // Display tick markers every 5 days + last day (Today)
    const tickDays = [0, 5, 10, 15, 20, 25, 29];
    tickDays.forEach((dayIdx) => {
      const dayData = heatmapDataset[0]?.days[dayIdx];
      if (!dayData) return;

      const x = (xScale(dayIdx) || 0) + xScale.bandwidth() / 2;
      const isToday = dayIdx === 29;

      // Vertical subtle guide
      g.append('line')
        .attr('x1', x)
        .attr('x2', x)
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke', isToday ? 'rgba(6, 182, 212, 0.25)' : 'rgba(68, 64, 60, 0.25)')
        .attr('stroke-dasharray', '2 3')
        .attr('pointer-events', 'none');

      // Top label
      const tickG = xAxisGroup.append('g').attr('transform', `translate(${x}, -10)`);

      tickG
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('font-weight', isToday ? 'bold' : '500')
        .attr('fill', isToday ? '#38bdf8' : '#a8a29e')
        .text(isToday ? 'Today' : dayData.dateStr);
    });

    // Column label: 30-Day Span Indicator
    g.append('text')
      .attr('x', 0)
      .attr('y', -24)
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('fill', '#78716c')
      .text('← Day -29');

    g.append('text')
      .attr('x', innerWidth)
      .attr('y', -24)
      .attr('text-anchor', 'end')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold')
      .attr('fill', '#06b6d4')
      .text('Day 0 (Current Epoch) →');

  }, [heatmapDataset, containerWidth, metricMode, selectedNodeId]);

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-semibold uppercase tracking-wider">30-Day Network Activity Heatmap</span>
            <span className="text-stone-600">|</span>
            <span className="text-stone-400">D3 Nonary Engine Matrix</span>
          </div>
          <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <span>Dragon9 Coastal Mesh Telemetry (36 Nodes × 30 Days)</span>
          </h3>
          <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
            Continuous historical synchronization, oscillator phase drift, and tidal coupling across all 36 country nodes anchored by Tokyo and Port Waikato.
          </p>
        </div>

        {/* Metric Selector & Legend */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Metric Buttons */}
          <div className="flex items-center bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs font-mono">
            <button
              id="heatmap-metric-activity-btn"
              onClick={() => setMetricMode('activity')}
              className={`px-3 py-1.5 rounded-md transition ${
                metricMode === 'activity'
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Activity %
            </button>
            <button
              id="heatmap-metric-pulses-btn"
              onClick={() => setMetricMode('pulses')}
              className={`px-3 py-1.5 rounded-md transition ${
                metricMode === 'pulses'
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Sync Pulses
            </button>
            <button
              id="heatmap-metric-drift-btn"
              onClick={() => setMetricMode('drift')}
              className={`px-3 py-1.5 rounded-md transition ${
                metricMode === 'drift'
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Phase Drift
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-stone-950 p-3 rounded-lg border border-stone-800/80">
          <div className="text-[10px] text-stone-500 uppercase">30-Day Mean Uptime</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">{networkStats.avgUptime}%</div>
          <div className="text-[10px] text-stone-400">Optimal nonary phase lock</div>
        </div>

        <div className="bg-stone-950 p-3 rounded-lg border border-stone-800/80">
          <div className="text-[10px] text-stone-500 uppercase">Total 54m Pulses</div>
          <div className="text-lg font-bold text-cyan-300 mt-0.5">
            {(networkStats.totalPulses / 1000).toFixed(1)}k
          </div>
          <div className="text-[10px] text-stone-400">Synchronized epoch beacons</div>
        </div>

        <div className="bg-stone-950 p-3 rounded-lg border border-stone-800/80">
          <div className="text-[10px] text-stone-500 uppercase">Dual Master Anchors</div>
          <div className="text-sm font-bold text-amber-300 mt-1 truncate">
            #01 Tokyo & #02 Pee Dub
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold">99.8% Combined Stability</div>
        </div>

        <div className="bg-stone-950 p-3 rounded-lg border border-stone-800/80 flex flex-col justify-between">
          <div className="text-[10px] text-stone-500 uppercase">Interactive Filter</div>
          <div className="text-[11px] text-stone-300 truncate">
            Displaying <strong className="text-cyan-400">{heatmapDataset.length}</strong> / 36 Nodes
          </div>
          <div className="text-[10px] text-stone-500">Click any cell or label to inspect</div>
        </div>
      </div>

      {/* Color Scale Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-stone-400 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-stone-500">SCALE:</span>
          {metricMode === 'activity' && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-stone-500">&lt;70% Low</span>
              <div className="flex items-center h-2.5 w-36 rounded overflow-hidden border border-stone-800">
                <div className="flex-1 h-full bg-[#1c1917]" />
                <div className="flex-1 h-full bg-[#0e7490]" />
                <div className="flex-1 h-full bg-[#06b6d4]" />
                <div className="flex-1 h-full bg-[#2dd4bf]" />
                <div className="flex-1 h-full bg-[#34d399]" />
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">100% Peak</span>
            </div>
          )}

          {metricMode === 'pulses' && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-stone-500">900 p/d</span>
              <div className="flex items-center h-2.5 w-36 rounded overflow-hidden border border-stone-800">
                <div className="flex-1 h-full bg-[#1c1917]" />
                <div className="flex-1 h-full bg-[#3b82f6]" />
                <div className="flex-1 h-full bg-[#06b6d4]" />
                <div className="flex-1 h-full bg-[#fbbf24]" />
              </div>
              <span className="text-[10px] text-amber-300 font-semibold">1500+ p/d</span>
            </div>
          )}

          {metricMode === 'drift' && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-emerald-400">0.00 ms (Lock)</span>
              <div className="flex items-center h-2.5 w-36 rounded overflow-hidden border border-stone-800">
                <div className="flex-1 h-full bg-[#10b981]" />
                <div className="flex-1 h-full bg-[#06b6d4]" />
                <div className="flex-1 h-full bg-[#f59e0b]" />
                <div className="flex-1 h-full bg-[#ef4444]" />
              </div>
              <span className="text-[10px] text-red-400">0.40+ ms</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-stone-400">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>Node #01 & #02 Primary Anchors Highlighted</span>
        </div>
      </div>

      {/* SVG Container with horizontal scroll for responsiveness */}
      <div 
        ref={containerRef} 
        id="heatmap-svg-container"
        className="relative overflow-x-auto scrollbar-thin rounded-lg border border-stone-800/80 bg-stone-950 p-2"
      >
        <svg ref={svgRef} className="select-none min-w-[500px]" />

        {/* Floating Tooltip */}
        {hoveredCell && (
          <div
            id="heatmap-interactive-tooltip"
            className="pointer-events-none absolute z-20 bg-stone-900/95 border border-cyan-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md text-stone-100 font-mono text-xs max-w-xs space-y-1.5 transition-all duration-75"
            style={{
              left: Math.min(Math.max(16, hoveredCell.x - 120), (containerRef.current?.clientWidth || 900) - 260),
              top: Math.max(10, hoveredCell.y - 120),
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-800">
                  #{hoveredCell.node.nodeNumber.toString().padStart(2, '0')}
                </span>
                <span className="font-semibold text-stone-200">{hoveredCell.node.city}</span>
              </div>
              <span className="text-stone-400 text-[10px]">{hoveredCell.data.dateStr}</span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div>
                <span className="text-stone-500 block text-[10px]">Activity Level</span>
                <span className="font-bold text-cyan-300">{hoveredCell.data.activityPercent}%</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Sync Pulses</span>
                <span className="font-bold text-amber-300">{hoveredCell.data.syncPulses.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Phase Drift</span>
                <span className="font-bold text-emerald-400">
                  {hoveredCell.data.avgDriftMs >= 0 ? `+${hoveredCell.data.avgDriftMs}ms` : `${hoveredCell.data.avgDriftMs}ms`}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Status</span>
                <span className={`font-bold capitalize ${
                  hoveredCell.data.status === 'optimal' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {hoveredCell.data.status}
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-800/80 leading-tight">
              {hoveredCell.data.notes}
            </div>
            <div className="text-[9px] text-cyan-500 pt-0.5 flex items-center justify-end">
              Click cell to inspect node →
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
