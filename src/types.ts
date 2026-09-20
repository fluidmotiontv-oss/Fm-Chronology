/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Modality = 'image' | 'video' | 'audio' | 'code' | 'text' | 'ledger';

export type Era = 
  | 'era-1-waikato-germination'
  | 'era-2-tokyo-labs'
  | 'era-3-dragon9-mesh'
  | 'era-4-currency-register'
  | 'era-5-multimodal-future';

export interface ArchiveItem {
  id: string;
  title: string;
  timestamp: string; // ISO 8601
  dragon9Timestamp: string; // e.g. "D9-Cycle 18:22:45 @ Node-02"
  era: Era;
  modality: Modality;
  location: string; // e.g. "Port Waikato, NZ (Pee Dub)", "Shibuya, Tokyo", "Akihabara Hub"
  nodeId?: string; // e.g. "node-02-port-waikato"
  summary: string;
  content: string; // Detailed transcript, code snippet, log entry, or narrative
  tags: string[];
  mediaUrl?: string;
  metadata?: {
    camera?: string;
    filmStock?: string;
    audioHz?: number;
    tidePhase?: string;
    swellFt?: number;
    gitCommit?: string;
    txHash?: string;
    amountD9?: number;
    participants?: string[];
  };
}

export interface NodeInfo {
  id: string;
  nodeNumber: number;
  city: string;
  country: string;
  countryCode: string;
  coordinates: [number, number]; // [lat, lng]
  status: 'synced' | 'calibrating' | 'drift_alert';
  driftMs: number;
  currentDragon9Hour: number; // 0 to 26
  currentDragon9Minute: number; // 0 to 53
  activeFeed: string;
  waveTideData?: {
    swellHeightM: number;
    tide: 'incoming' | 'outgoing' | 'high_slack' | 'low_slack';
    waterTempC: number;
  };
  hardwareSpec: string;
}

export interface Dragon9Time {
  cycle: number;
  hour: number; // 0-26 (54 solar minutes per Dragon9 hour)
  minute: number; // 0-53
  second: number; // 0-53
  standardTimeString: string;
  dragon9TimeString: string;
  solarRatio: string;
  harmonicFrequencyHz: number;
}

export interface CurrencyTransaction {
  id: string;
  timestamp: string;
  dragon9Timestamp: string;
  sourceNode: string;
  destinationNode: string;
  amountD9: number;
  fiatEquiv: string;
  category: 'Cinematography Syndication' | 'Hardware Node Bounty' | 'Barter Goods' | 'Bandwidth Settlement' | 'Archival Mint';
  description: string;
  hash: string;
  verified: boolean;
}

export interface RepoFile {
  path: string;
  language: string;
  size: string;
  lastCommit: string;
  description: string;
  content: string;
}

export interface SynthesisRequest {
  model: string;
  interaction_mode: string;
  input_modalities: Modality[];
  output_modality: 'structured_markdown' | 'json_manifest' | 'audio' | 'comedy_localization';
  time_range?: {
    start: string;
    end: string;
  };
  prompt_focus?: string;
  target_language?: 'DE' | 'ES' | 'FR' | 'JA' | 'EN';
}

export interface SynthesisResult {
  output_modality: string;
  generated_at: string;
  model_used: string;
  raw_output: string;
  structured_data?: any;
  timing_markers?: string;
  visual_cues?: string[];
  audio_cues?: string[];
}
