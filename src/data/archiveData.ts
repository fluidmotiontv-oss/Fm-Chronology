/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArchiveItem, CurrencyTransaction } from '../types';

export const CHRONOLOGICAL_ARCHIVE: ArchiveItem[] = [
  // --- ERA 1: THE WAIKATO GERMINATION & SUNSET SANDS (Port Waikato / "pee dub") ---
  {
    id: 'farch-001',
    title: 'Port Waikato Bar Crossing: 16mm Bolex Test Stills',
    timestamp: '2020-03-21T06:14:00Z',
    dragon9Timestamp: 'D9-Cycle 0001·00:03:12 @ Node-02',
    era: 'era-1-waikato-germination',
    modality: 'image',
    location: 'Port Waikato, NZ (Pee Dub)',
    nodeId: 'node-02-port-waikato',
    summary: 'First experimental film stills shot at the mouth of the Waikato River as tidal waters collided with 8ft southern ocean swells.',
    content: `Archival Log Entry:
Captured on 16mm Kodak 250D using a wind-up Bolex H16 with Switar 10mm prime.
Observed fluid wave compression on the outer sandbank where the river current forces the incoming swell into harmonic sets.
Notes on temporal drift: The tide cycle at pee dub is 12 hours 25 minutes, suggesting our conventional 60-minute solar division creates persistent cognitive desynchronization with coastal hydrology. Here the concept of the 54-minute Dragon9 hour was first sketched on water-resistant boat log paper.`,
    tags: ['Port Waikato', 'Pee Dub', '16mm', 'Bolex', 'Tidal Fluidity', 'Genesis'],
    mediaUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80',
    metadata: {
      camera: 'Bolex H16 Reflex',
      filmStock: 'Kodak Vision3 250D 16mm',
      tidePhase: 'Outgoing Ebb (Spring)',
      swellFt: 8.4,
      participants: ['Archivist Alpha', 'Pee-Dub Coast Patrol', 'Fluidmotion Cine Team']
    }
  },
  {
    id: 'farch-002',
    title: 'IRC Log #fluidmotiontv: Genesis of the 54-Minute Hour',
    timestamp: '2020-04-02T14:22:15Z',
    dragon9Timestamp: 'D9-Cycle 0013·08:14:40 @ Global',
    era: 'era-1-waikato-germination',
    modality: 'text',
    location: 'Encrypted IRC #fluidmotiontv (Server: irc.pee-dub.mesh)',
    nodeId: 'node-02-port-waikato',
    summary: 'Foundational chat transcript discussing the mathematical elegance of dividing circadian cycles into 27 harmonic nonary units.',
    content: `<wai_kai> 60 is arbitrary Babylon sexagesimal. It fits base-12 arithmetic for trade, but it resists ocean harmonics.
<tokyo_sync> When we pulse 54 minutes, 54 = 9 * 6 = 3^3 * 2. 54 minutes = 3240 seconds.
<wai_kai> Exactly. In 24 solar hours, you get 1440 minutes. 1440 / 54 = 26.666... But if you align to the lunar tidal day (24h 50m = 1490 min), 1490 / 54 = 27.59 units.
<tokyo_sync> The Dragon9 framework solves this: 27 cycles of 54 minutes creates an exact harmonic bridge between planetary rotation and biological rhythm.
<shibuya_fox> We need hardware oscillators. Standard quartz crystals are tuned to 32.768 kHz (2^15). We should build custom prescalers for the Raspberry Pi and FPGA to output native 54-minute sweeps.
<wai_kai> Commit the manifesto to git. Let's name the repository fluidmotiontv-oss/Fluidmotiontv-clock.`,
    tags: ['IRC Log', 'Dragon9 Theory', 'Circadian Harmonics', 'Chat Archive'],
    metadata: {
      participants: ['wai_kai (Port Waikato)', 'tokyo_sync (Akihabara)', 'shibuya_fox (Tokyo)']
    }
  },
  {
    id: 'farch-003',
    title: 'Pee Dub Rivermouth Lefts: Dawn Audio Hydrophone Telemetry',
    timestamp: '2020-06-11T18:40:00Z',
    dragon9Timestamp: 'D9-Cycle 0081·19:33:02 @ Node-02',
    era: 'era-1-waikato-germination',
    modality: 'audio',
    location: 'Port Waikato Rivermouth Sandbar',
    nodeId: 'node-02-port-waikato',
    summary: 'Sub-surface acoustic recording of grinding black sand and hydraulic collapse inside a 10-second barrel at Sunset Beach.',
    content: `Acoustic telemetry captured with Aquarian Scientific AS-1 hydrophone moored 1.2 meters below mean low water at the southern spit.
Fundamental sub-harmonic frequency detected at 54.2 Hz during barrel implosion, corroborating the nonary temporal resonance model.
Audio spectrum features broad-band wave noise with steep spectral roll-off at 4.2 kHz caused by suspension of dense titanomagnetite black sand.`,
    tags: ['Hydrophone', 'Port Waikato', 'Acoustic Telemetry', '54Hz Resonance', 'Audio'],
    metadata: {
      audioHz: 54.2,
      tidePhase: 'Low Slack into First Push',
      swellFt: 6.2,
      camera: 'Hydrophone AS-1 + Sound Devices 702'
    }
  },

  // --- ERA 2: TOKYO WAREHOUSE LABS & SHIBUYA HACKERHOUSE ---
  {
    id: 'farch-004',
    title: 'Shibuya Nocturnal Clock Display & Hardware Lab Oscilloscope',
    timestamp: '2021-01-15T11:05:00Z',
    dragon9Timestamp: 'D9-Cycle 0298·12:44:19 @ Node-01',
    era: 'era-2-tokyo-labs',
    modality: 'image',
    location: 'Shibuya Udagawacho Lab, Tokyo',
    nodeId: 'node-01-tokyo',
    summary: 'Prototype Dragon9 dual-time neon-fluorescent cathode display bench-tested against atomic clock NTP reference in Tokyo.',
    content: `Hardware verification report:
Custom dual-time display utilizing VFD (Vacuum Fluorescent Display) tubes displaying both ISO 8601 UTC and Dragon9 cycle:hour:minute:second.
Powered by an STM32F4 microcontroller running the early C-implementation of the 54-minute prescaler.
Jitter measured against Japan Standard Time (NICT Koganei NTP server): 0.12 milliseconds across 72 continuous operating hours.
Thermal testing in Shibuya winter humidity verified stability of temperature-compensated crystal oscillator (TCXO).`,
    tags: ['Tokyo', 'Shibuya', 'Hardware Prototype', 'VFD Display', 'Oscilloscope', 'JST'],
    mediaUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    metadata: {
      camera: 'Sony α7S III + Zeiss Loxia 35mm',
      participants: ['Kenji Sato', 'Fluidmotion Hardware Guild'],
      gitCommit: 'a89c2f1e (v0.2.1-alpha)'
    }
  },
  {
    id: 'farch-005',
    title: 'fluidmotiontv-oss/Fluidmotiontv-clock: Initial Rust Daemon Commit',
    timestamp: '2021-03-09T03:18:22Z',
    dragon9Timestamp: 'D9-Cycle 0348·04:12:00 @ Node-01',
    era: 'era-2-tokyo-labs',
    modality: 'code',
    location: 'fluidmotiontv-oss GitHub Repository',
    nodeId: 'node-01-tokyo',
    summary: 'Core implementation of the Dragon9 nonary time engine in Rust with high-precision microsecond accumulator.',
    content: `// fluidmotiontv-clock/src/core/dragon9_engine.rs
// Copyright (c) 2021 FluidmotionTV OSS Contributors. Apache-2.0 License.

pub const DRAGON9_HOUR_MINUTES: u64 = 54;
pub const DRAGON9_MINUTE_SECONDS: u64 = 60;
pub const DRAGON9_SECOND_NANOS: u64 = 1_111_111_111; // 60s / 54 = 1.111111s

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub struct Dragon9Tick {
    pub cycle: u64,
    pub d9_hour: u8,   // 0..=26
    pub d9_min: u8,    // 0..=53
    pub d9_sec: u8,    // 0..=53
    pub drift_nanos: i64,
}

impl Dragon9Tick {
    pub fn from_unix_epoch_ms(epoch_ms: u64) -> Self {
        let total_secs = epoch_ms / 1000;
        let cycle_seconds = 27 * DRAGON9_HOUR_MINUTES * 60; // 87,480s
        let cycle = total_secs / cycle_seconds;
        let rem_seconds = total_secs % cycle_seconds;
        
        let d9_hour = (rem_seconds / (DRAGON9_HOUR_MINUTES * 60)) as u8;
        let hour_rem_secs = rem_seconds % (DRAGON9_HOUR_MINUTES * 60);
        
        let d9_min = (hour_rem_secs / 60) as u8;
        let d9_sec = ((hour_rem_secs % 60) * 54 / 60) as u8;
        
        Self { cycle, d9_hour, d9_min, d9_sec, drift_nanos: 0 }
    }
}`,
    tags: ['Rust', 'OSS Clock', 'GitHub Commit', 'Algorithm', 'Precision Timing'],
    metadata: {
      gitCommit: 'commit b39f04d: feat(engine): initial nonary prescaler and cycle partitioner'
    }
  },
  {
    id: 'farch-006',
    title: 'Tokyo Surf Warehouse: 4K 120fps Wave Tank Fluid Dynamics',
    timestamp: '2021-08-20T08:15:30Z',
    dragon9Timestamp: 'D9-Cycle 0509·09:51:14 @ Node-01',
    era: 'era-2-tokyo-labs',
    modality: 'video',
    location: 'Shinagawa Fluid Dynamics Testing Basin, Tokyo',
    nodeId: 'node-01-tokyo',
    summary: 'Ultra-high-speed hydrodynamic analysis comparing artificial standing waves with Port Waikato reef mouth bathymetry.',
    content: `Video Pipeline Metadata:
Resolution: 3840x2160 UHD @ 119.88 fps (ProRes 422 HQ).
Lens: Cooke S4/i 50mm Prime.
Wave machine tuned to 54-second pulse cycles matching Dragon9 macro-seconds.
Observations: Particle image velocimetry (PIV) confirms that wave lip thickness is directly proportional to water depth deceleration when pulsed at 54-minute tidal intervals.
Encoded for the FluidmotionTV master broadcast ingest pipeline with zero intra-frame temporal distortion.`,
    tags: ['Video Pipeline', 'Tokyo', 'Fluid Dynamics', 'ProRes 422HQ', 'Hydrodynamics'],
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    metadata: {
      camera: 'RED Komodo 6K',
      filmStock: 'Digital RAW / S-Log3',
      swellFt: 4.5
    }
  },

  // --- ERA 3: THE DRAGON9 OSS CLOCK DEPLOYMENT (36 COUNTRY NODES) ---
  {
    id: 'farch-007',
    title: '36-Node Global Mesh Protocol RFC & Gossip Network Ignition',
    timestamp: '2022-04-14T02:00:00Z',
    dragon9Timestamp: 'D9-Cycle 0743·02:18:45 @ 36 Nodes',
    era: 'era-3-dragon9-mesh',
    modality: 'code',
    location: 'Global Edge Mesh (Tokyo Hub - Port Waikato Root)',
    nodeId: 'node-01-tokyo',
    summary: 'Formal specification for peer-to-peer gossip telemetry synchronization across 36 coastal surf nodes worldwide.',
    content: `// protocol/src/mesh_gossip.rs
// RFC-0036: FluidmotionTV Distributed Temporal Matrix (DTM)

pub struct NodeBeacon {
    pub node_id: [u8; 16],
    pub country_code: [u8; 2],
    pub geo_coords: (f32, f32), // Lat, Lng
    pub dragon9_clock_state: Dragon9State,
    pub tide_harmonic_pressure_pa: u32,
    pub ed25519_signature: [u8; 64],
}

// 36 Node Topology:
// Node 01: Tokyo (JST Base) -> Node 02: Port Waikato (Tidal Anchor)
// Interconnected via multi-hop UDP gossip protocol with sub-millisecond
// consensus over Starlink + undersea fiber paths.`,
    tags: ['RFC', 'Gossip Protocol', '36 Nodes', 'Mesh Network', 'Distributed Systems'],
    metadata: {
      gitCommit: 'feat(protocol): RFC-0036 v1.0 complete with 36 node public keys'
    }
  },
  {
    id: 'farch-008',
    title: 'Signal Comms Transcript: The Great Leap-Tick Calibration',
    timestamp: '2022-07-29T16:48:11Z',
    dragon9Timestamp: 'D9-Cycle 0846·18:37:09 @ Global Network',
    era: 'era-3-dragon9-mesh',
    modality: 'text',
    location: 'Signal E2EE Group: [FLUIDMOTION-CORE-ENGINEERS]',
    nodeId: 'node-01-tokyo',
    summary: 'Emergency logs during the global node synchronization when solar flare magnetic anomalies induced a 4.2ms drift in Node 10 (Mentawai).',
    content: `[16:48:11] @kai_port_waikato: Mentawai node (Node 10) reporting +4.2ms drift on its OCXO. Starlink packet loss at 8%.
[16:49:03] @sato_tokyo: Tokyo atomic clock comparator confirms local JST node is clean. Trigger the nonary drift dampener in daemon v1.4.2.
[16:50:22] @biarritz_marc: Node 14 (Biarritz) and Node 16 (Peniche) can serve as intermediate gossip anchors for the Atlantic-Indian Ocean relay.
[16:52:45] @kai_port_waikato: Running 'fluidmotion-nodectl adjust-drift --target-ms=0.00 --smooth=54min'.
[16:55:18] @mentawai_bot: [STATUS] Consensus achieved across 36/36 nodes. Max global jitter: 0.19ms. Dragon9 harmony restored.`,
    tags: ['Signal Transcript', 'Chat Log', 'Emergency Sync', 'Drift Calibration', '36 Nodes'],
    metadata: {
      participants: ['kai_port_waikato', 'sato_tokyo', 'biarritz_marc', 'mentawai_bot']
    }
  },
  {
    id: 'farch-009',
    title: 'Sunset Beach Winter Swell: 70mm Aerial Pipeline Survey',
    timestamp: '2022-11-04T05:30:00Z',
    dragon9Timestamp: 'D9-Cycle 0942·06:05:22 @ Node-02',
    era: 'era-3-dragon9-mesh',
    modality: 'image',
    location: 'Port Waikato, Sunset Beach Coastline',
    nodeId: 'node-02-port-waikato',
    summary: 'Spectacular aerial survey of the 14ft southwest groundswell intersecting the Port Waikato sandspit during peak low tide.',
    content: `Aerial cinematography captured via drone rig equipped with Hasselblad medium format sensor.
Shows the geometric fracture lines of the outer bar. At exactly 54 minutes after sunrise, the offshore easterly wind groomers aligned with the bathymetric contour to produce 300-meter uninterrupted left walls.
Archived as primary benchmark imagery for FluidmotionTV visual grading pipelines.`,
    tags: ['Aerial', 'Port Waikato', 'Sunset Beach', 'Hasselblad', 'Swell Analysis'],
    mediaUrl: 'https://images.unsplash.com/photo-1498855926480-d98e83099315?auto=format&fit=crop&w=1200&q=80',
    metadata: {
      camera: 'Hasselblad L2D-20c',
      tidePhase: 'Low Slack (Neap)',
      swellFt: 14.2
    }
  },

  // --- ERA 4: CURRENCY REGISTER & SOVEREIGN BARTER MESH ---
  {
    id: 'farch-010',
    title: 'Dragon9 Genesis Ledger: Currency Register Block #0001',
    timestamp: '2023-02-18T10:00:00Z',
    dragon9Timestamp: 'D9-Cycle 1046·11:08:34 @ Sovereign Register',
    era: 'era-4-currency-register',
    modality: 'ledger',
    location: 'Decentralized Sovereign Ledger (Node 01 / Node 02 Co-Sign)',
    nodeId: 'node-01-tokyo',
    summary: 'The founding transaction block establishing the Dragon9 fluid currency registry for independent surf media syndication.',
    content: `BLOCK #0001 - HASH: 0x9f4a88b17c22e038db44a10298e5fbb412c98204
Timestamp: 2023-02-18T10:00:00Z (Dragon9 Cycle 1046, Hour 11, Min 08)
Total Supply Initialized: 99,999,999 D9 Credits.
Backing Asset: 54-minute block increments of verified global edge compute, tidal wave telemetry, and lossless video archive preservation.
Signers:
- Node 01 Tokyo Public Key: ed25519:7F9a...33Bb
- Node 02 Port Waikato Public Key: ed25519:12Cc...88Ee`,
    tags: ['Ledger', 'Currency Register', 'Genesis Block', 'D9 Credits', 'Blockchain'],
    metadata: {
      txHash: '0x9f4a88b17c22e038db44a10298e5fbb412c98204',
      amountD9: 99999999
    }
  },
  {
    id: 'farch-011',
    title: 'Register TX-0482: Cinematography Syndication & Barter Settlement',
    timestamp: '2023-09-15T07:22:45Z',
    dragon9Timestamp: 'D9-Cycle 1251·08:11:59 @ Node-02 to Node-14',
    era: 'era-4-currency-register',
    modality: 'ledger',
    location: 'Cross-Node Barter: Port Waikato <-> Biarritz',
    nodeId: 'node-02-port-waikato',
    summary: 'Settlement for 40 hours of 16mm archival footage from pee dub bar crossings transferred to the European surf media syndicate.',
    content: `TRANSACTION DETAILS:
TX ID: TX-0482-WAIKATO-BIARRITZ-BARTER
Sender: Node-02 (Port Waikato Media Custodian)
Recipient: Node-14 (Biarritz Cultural Archive)
Asset Transferred: 40 hrs Uncompressed 4K ProRes Film Scan
Compensation: 4,500 D9 Credits + 2 Hand-shaped 7'6" Midlength Gun Surfboards (Shipped via Le Havre)
Verification: Cryptographically attested via SHA-256 manifest hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
Status: CONFIRMED & IRREVERSIBLE.`,
    tags: ['Barter', 'Currency Settlement', 'Cinematography', 'Surfboards', 'D9 Credits'],
    metadata: {
      txHash: '0x3a4b9101c84f8812e947bc1294827d0912abcc55',
      amountD9: 4500
    }
  },
  {
    id: 'farch-012',
    title: 'Akihabara Parts Sourcing: Hardware Node Bounty Distribution',
    timestamp: '2024-03-30T13:45:00Z',
    dragon9Timestamp: 'D9-Cycle 1445·15:20:10 @ Node-01',
    era: 'era-4-currency-register',
    modality: 'ledger',
    location: 'Radio Kaikan, Akihabara, Tokyo',
    nodeId: 'node-01-tokyo',
    summary: 'Disbursement of 18,200 D9 Credits for batch procurement of 120 military-grade rubidium atomic oscillators.',
    content: `PURCHASE & BOUNTY REGISTER:
Item: Precision Rubidium Frequency Standards (FE-5680A surplus units)
Destination: Deployment to Nodes 22-36 across Hawaii, California, Chile, and Sri Lanka.
Disbursed from Sovereign Treasury Reserve: 18,200 D9 (Fiat equivalent estimate: ¥2,730,000 JPY).
Audited by: FluidmotionTV Node Hardware Council.
All units inspected in Shibuya facility for 54-minute phase frequency calibration.`,
    tags: ['Akihabara', 'Hardware Bounty', 'Rubidium Oscillator', 'Procurement', 'Ledger'],
    metadata: {
      txHash: '0x7c91fa023910bb4412ef901928374a1082bb71aa',
      amountD9: 18200
    }
  },

  // --- ERA 5: MULTIMODAL SYNCHRONIZED FUTURE ---
  {
    id: 'farch-013',
    title: 'Universal AI Multimodal Ingestion Pipeline Architecture',
    timestamp: '2025-01-10T00:00:00Z',
    dragon9Timestamp: 'D9-Cycle 1728·00:00:00 @ Master Gateway',
    era: 'era-5-multimodal-future',
    modality: 'code',
    location: 'FluidmotionTV Core Cloud & Edge Mesh',
    nodeId: 'node-01-tokyo',
    summary: 'Integration code connecting 36-node live telemetry and historical multimodal media directly to Gemini AI synthesis.',
    content: `// src/archive/synthesis_orchestrator.ts
import { GoogleGenAI } from '@google/genai';
import { NODES_36 } from '../data/nodeMesh';

export class MultimodalChronicleOrchestrator {
  private ai: GoogleGenAI;
  
  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
  }

  async synthesizeChronicle(range: { startEpoch: number; endEpoch: number }) {
    const prompt = \`You are the master chronological archivist for FluidmotionTV under the fluid motion of the future framework.
Ingest all historical chat logs, code repositories (including fluidmotiontv-oss/Fluidmotiontv-clock across 36 country nodes),
photo archives from Tokyo and Port Waikato (pee dub), surf media pipelines, and currency register data.
Synthesize these inputs into an unbroken, perfectly ordered chronological archive and interactive data digest.\`;

    return await this.ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });
  }
}`,
    tags: ['Multimodal', 'Gemini API', 'TypeScript', 'AI Synthesis', 'Architecture'],
    metadata: {
      gitCommit: 'feat(synthesis): multimodal ingestion bridge for 36 nodes'
    }
  },
  {
    id: 'farch-014',
    title: 'Tokyo x Port Waikato: Dual-Stream Synchronized 4K Master',
    timestamp: '2025-08-14T04:12:00Z',
    dragon9Timestamp: 'D9-Cycle 1941·04:40:18 @ Tokyo-Waikato Link',
    era: 'era-5-multimodal-future',
    modality: 'video',
    location: 'Shibuya Crossing / Sunset Beach Simultaneous Broadcast',
    nodeId: 'node-01-tokyo',
    summary: 'Live split-screen broadcast proving sub-millisecond audio-visual phase lock between Tokyo urban rain and Port Waikato surf.',
    content: `Split-screen optical transmission report:
Left Channel: Tokyo Shibuya Crossing in night monsoon rain, neon reflections pulsing at 54-minute intervals.
Right Channel: Sunset Beach (pee dub) afternoon glassy walls peeling along the black sand bar.
Synchronization Metric: Global network drift between Node 01 and Node 02 clocked at 0.08ms over Starlink ground station.
Viewers in 42 countries reported profound psychotemporal calming when observing the dual fluid dynamics locked to the Dragon9 nonary clock.`,
    tags: ['Video Master', 'Tokyo', 'Port Waikato', 'Dual Stream', '4K Broadcast'],
    mediaUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
    metadata: {
      camera: 'Sony FX6 Cinema Line',
      swellFt: 7.8
    }
  },
  {
    id: 'farch-015',
    title: 'Dragon9 Master Manifesto: The Fluid Motion of the Future',
    timestamp: '2026-03-21T00:00:00Z',
    dragon9Timestamp: 'D9-Cycle 2154·00:00:00 @ Genesis Anniversary',
    era: 'era-5-multimodal-future',
    modality: 'text',
    location: 'Global Broadcast to All 36 Country Nodes',
    nodeId: 'node-02-port-waikato',
    summary: 'The definitive philosophical and technical manifesto unifying temporal sovereignty, ocean tidal dynamics, and decentralized media.',
    content: `THE FLUID MOTION OF THE FUTURE:
Time is not a rigid grid imposed by factory bells; it is an oceanic current.
By calibrating our collective rhythm to the 54-minute Dragon9 hour, we dismantle the artificial friction between nature, technology, and culture.
From the volcanic sands of Port Waikato (pee dub) to the neon labyrinth of Tokyo, 36 nodes hold the line.
Every wave ridden, every line of code compiled, every credit in our currency register testifies to an unbroken continuum:
Fluid Motion Forever.`,
    tags: ['Manifesto', 'Philosophy', 'Fluid Motion', 'Dragon9', 'Future'],
    metadata: {
      participants: ['FluidmotionTV Global Collective', '36 Node Keepers']
    }
  }
];

export const CURRENCY_TRANSACTIONS: CurrencyTransaction[] = [
  {
    id: 'TX-0001',
    timestamp: '2023-02-18T10:00:00Z',
    dragon9Timestamp: 'D9-C1046·11:08',
    sourceNode: 'Node-01 (Tokyo)',
    destinationNode: 'Node-02 (Port Waikato)',
    amountD9: 25000,
    fiatEquiv: '$37,500 NZD',
    category: 'Hardware Node Bounty',
    description: 'Grant for solar array and LoRa marine gateway at Sunset Beach bar',
    hash: '0x9f4a88b17c22e038db44a10298e5fbb412c98204',
    verified: true
  },
  {
    id: 'TX-0142',
    timestamp: '2023-05-12T14:30:00Z',
    dragon9Timestamp: 'D9-C1128·16:02',
    sourceNode: 'Node-14 (Biarritz)',
    destinationNode: 'Node-01 (Tokyo)',
    amountD9: 6800,
    fiatEquiv: '€9,180 EUR',
    category: 'Cinematography Syndication',
    description: 'European broadcast license rights for 16mm Port Waikato archival reel',
    hash: '0x2b8104ea91002cf71629810a72cba01928374102',
    verified: true
  },
  {
    id: 'TX-0289',
    timestamp: '2023-11-04T08:15:00Z',
    dragon9Timestamp: 'D9-C1310·09:44',
    sourceNode: 'Node-25 (Pipeline)',
    destinationNode: 'Node-02 (Port Waikato)',
    amountD9: 4200,
    fiatEquiv: '$6,300 USD',
    category: 'Barter Goods',
    description: 'Exchange of 3 Dick Brewer gun templates for Waikato rivermouth bathymetry data',
    hash: '0x718a2049102bca8192809182374619a827bb4012',
    verified: true
  },
  {
    id: 'TX-0482',
    timestamp: '2024-04-19T11:20:00Z',
    dragon9Timestamp: 'D9-C1466·12:35',
    sourceNode: 'Node-01 (Tokyo)',
    destinationNode: 'Node-12 (Jeffreys Bay)',
    amountD9: 12400,
    fiatEquiv: '¥1,860,000 JPY',
    category: 'Bandwidth Settlement',
    description: 'Dedicated undersea low-latency pipe maintenance for Supertubes telemetry node',
    hash: '0x5e19a8204bca9102837461829304857162938471',
    verified: true
  },
  {
    id: 'TX-0610',
    timestamp: '2024-09-30T17:55:00Z',
    dragon9Timestamp: 'D9-C1632·19:12',
    sourceNode: 'Node-09 (Bali)',
    destinationNode: 'Node-01 (Tokyo)',
    amountD9: 3500,
    fiatEquiv: '$4,900 USD',
    category: 'Archival Mint',
    description: 'Minting immutable cryptographic hash for Uluwatu cave 70mm master print',
    hash: '0x8819203948571629384719203948571629384712',
    verified: true
  },
  {
    id: 'TX-0899',
    timestamp: '2025-06-22T04:10:00Z',
    dragon9Timestamp: 'D9-C1885·04:35',
    sourceNode: 'Node-02 (Port Waikato)',
    destinationNode: 'Node-22 (Trestles)',
    amountD9: 8900,
    fiatEquiv: '$13,350 USD',
    category: 'Cinematography Syndication',
    description: 'Multi-angle synchronized 8K live stream feed for international surf documentary',
    hash: '0x4491029384756102938475610293847561029384',
    verified: true
  }
];
