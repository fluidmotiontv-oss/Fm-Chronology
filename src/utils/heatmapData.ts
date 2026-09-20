/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NodeInfo } from '../types';

export interface DayActivity {
  dayIndex: number; // 0 to 29 (0 = 29 days ago, 29 = today)
  dateStr: string; // e.g. "Aug 21"
  isoDate: string;
  activityPercent: number; // 0 - 100%
  syncPulses: number; // e.g. 1200 - 1620
  avgDriftMs: number; // e.g. -0.25 to +0.35
  status: 'optimal' | 'nominal' | 'calibrating';
  oceanCoupling: number; // 0 - 10 rating based on swell
  notes: string;
}

export interface NodeHeatmapData {
  node: NodeInfo;
  days: DayActivity[];
  avgActivity: number;
  totalPulses: number;
  status: 'optimal' | 'nominal' | 'calibrating';
}

// Deterministic pseudo-random based on seed so it stays stable across renders
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generate30DayHeatmapData(nodes: NodeInfo[]): NodeHeatmapData[] {
  const now = new Date('2026-09-18T17:00:00Z');
  
  return nodes.map((node) => {
    const days: DayActivity[] = [];
    let sumActivity = 0;
    let sumPulses = 0;

    for (let dayIndex = 0; dayIndex < 30; dayIndex++) {
      const dayOffset = 29 - dayIndex;
      const targetDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
      const dateStr = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const isoDate = targetDate.toISOString().split('T')[0];

      // Base activity by node characteristics
      const isAnchor = node.nodeNumber === 1 || node.nodeNumber === 2; // Tokyo & Port Waikato
      const baseSeed = node.nodeNumber * 100 + dayIndex * 7;
      const noise = pseudoRandom(baseSeed);

      // Primary anchors maintain 96-100% uptime; coastal nodes fluctuate between 82% and 99%
      let activityPercent: number;
      if (isAnchor) {
        activityPercent = Math.min(100, Math.round(96 + noise * 4));
      } else {
        // Occasional maintenance or swell-related calibration dip for realism
        const isMaintenanceDay = (dayIndex === (node.nodeNumber % 28) + 1);
        if (isMaintenanceDay) {
          activityPercent = Math.round(68 + noise * 10);
        } else {
          activityPercent = Math.min(100, Math.round(85 + noise * 14));
        }
      }

      // Sync pulses: ~1440 standard pulses / day +/- activity ratio
      const syncPulses = Math.round((activityPercent / 100) * (1440 + Math.round((noise - 0.5) * 60)));
      const avgDriftMs = Number((node.driftMs + (noise - 0.5) * 0.08).toFixed(2));
      
      const status: 'optimal' | 'nominal' | 'calibrating' =
        activityPercent >= 92 ? 'optimal' : activityPercent >= 78 ? 'nominal' : 'calibrating';

      const oceanCoupling = Number(((node.waveTideData?.swellHeightM || 1.5) * (0.8 + noise * 0.4)).toFixed(1));

      let notes = 'Continuous phase sync with Tokyo/Pee Dub dual master.';
      if (isAnchor) {
        notes = node.nodeNumber === 1 ? 'Primary JST Master Reference standard active.' : 'Sunset Beach rivermouth hydrophone beacon lock active.';
      } else if (activityPercent < 75) {
        notes = 'Local quartz recalibration & LoRa gateway relay adjustment.';
      } else if (oceanCoupling > 3.0) {
        notes = `Heavy storm swell coupling (${oceanCoupling}m); acoustic dampening nominal.`;
      }

      days.push({
        dayIndex,
        dateStr,
        isoDate,
        activityPercent,
        syncPulses,
        avgDriftMs,
        status,
        oceanCoupling,
        notes,
      });

      sumActivity += activityPercent;
      sumPulses += syncPulses;
    }

    const avgActivity = Math.round(sumActivity / 30);
    const overallStatus: 'optimal' | 'nominal' | 'calibrating' =
      avgActivity >= 92 ? 'optimal' : avgActivity >= 80 ? 'nominal' : 'calibrating';

    return {
      node,
      days,
      avgActivity,
      totalPulses: sumPulses,
      status: overallStatus,
    };
  });
}
