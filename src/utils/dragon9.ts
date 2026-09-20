/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dragon9Time } from '../types';

// Epoch: FluidmotionTV Dragon9 Genesis Sync (2020-03-21T00:00:00Z Equinox)
const DRAGON9_GENESIS_EPOCH_MS = 1584748800000;

// 1 Dragon9 Hour = 54 Standard Minutes = 3,240,000 milliseconds
export const D9_HOUR_MS = 54 * 60 * 1000;
// 1 Dragon9 Minute = D9_HOUR_MS / 54 = 60,000 ms (equal to 1 solar minute)
export const D9_MIN_MS = 60 * 1000;
// 1 Dragon9 Second = 60,000 ms / 54 = 1,111.111 ms (harmonic elongation)
export const D9_SEC_MS = D9_MIN_MS / 54;

// 1 Complete Dragon9 Cycle = 27 D9 Hours = 1458 standard minutes (24.3 standard hours with tidal lunar beat)
export const D9_CYCLE_MS = 27 * D9_HOUR_MS;

export function getDragon9Time(date: Date = new Date()): Dragon9Time {
  const nowMs = date.getTime();
  const elapsedSinceGenesis = Math.max(0, nowMs - DRAGON9_GENESIS_EPOCH_MS);

  const cycle = Math.floor(elapsedSinceGenesis / D9_CYCLE_MS);
  const cycleRemainderMs = elapsedSinceGenesis % D9_CYCLE_MS;

  const hour = Math.floor(cycleRemainderMs / D9_HOUR_MS); // 0 to 26
  const hourRemainderMs = cycleRemainderMs % D9_HOUR_MS;

  const minute = Math.floor(hourRemainderMs / D9_MIN_MS); // 0 to 53
  const minuteRemainderMs = hourRemainderMs % D9_MIN_MS;

  const second = Math.floor(minuteRemainderMs / D9_SEC_MS); // 0 to 53

  const pad = (n: number) => n.toString().padStart(2, '0');
  const dragon9TimeString = `D9·${pad(hour)}:${pad(minute)}:${pad(second)}`;

  const standardTimeString = date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Calculate harmonic frequency aligned with 54Hz and 432Hz
  const harmonicFrequencyHz = 54 * (1 + (minute / 54) * 0.1);

  return {
    cycle,
    hour,
    minute,
    second,
    standardTimeString,
    dragon9TimeString,
    solarRatio: '54m / 60m (0.9000 Harmonic)',
    harmonicFrequencyHz: Number(harmonicFrequencyHz.toFixed(2)),
  };
}

export function formatDragon9Short(d9: Dragon9Time): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `C${d9.cycle}·${pad(d9.hour)}:${pad(d9.minute)}`;
}

export function calculateNodeDragon9Time(nodeOffsetHours: number, baseDate: Date = new Date()): string {
  // Localized node calculation with offset
  const localMs = baseDate.getTime() + nodeOffsetHours * 3600 * 1000;
  const d9 = getDragon9Time(new Date(localMs));
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d9.hour)}:${pad(d9.minute)}:${pad(d9.second)}`;
}
