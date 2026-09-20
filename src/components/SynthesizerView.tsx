/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArchiveItem, 
  Modality 
} from '../types';
import { 
  Sparkles, 
  Send, 
  Download, 
  Copy, 
  Check, 
  Play, 
  Square, 
  RefreshCw, 
  FileCode, 
  FileText, 
  FileJson, 
  Volume2, 
  Sliders, 
  AlertCircle 
} from 'lucide-react';
import { audioEngine } from '../utils/audioSynth';

interface SynthesizerViewProps {
  archiveItems: ArchiveItem[];
  presetItem: ArchiveItem | null;
  onClearPreset: () => void;
}

export const SynthesizerView: React.FC<SynthesizerViewProps> = ({
  archiveItems,
  presetItem,
  onClearPreset,
}) => {
  const [model, setModel] = useState<string>('gemini-3.8-flash');
  const [outputModality, setOutputModality] = useState<'structured_markdown' | 'json_manifest' | 'audio' | 'comedy_localization'>('structured_markdown');
  const [inputModalities, setInputModalities] = useState<Modality[]>(['image', 'video', 'audio', 'code', 'text', 'ledger']);
  const [targetLanguage, setTargetLanguage] = useState<'DE' | 'ES' | 'FR' | 'JA' | 'EN'>('EN');
  const [promptFocus, setPromptFocus] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [synthesisResult, setSynthesisResult] = useState<{
    raw_output: string;
    model_used: string;
    generated_at: string;
  } | null>(null);

  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentSpokenSegment, setCurrentSpokenSegment] = useState<string>('');
  const [speechCanceller, setSpeechCanceller] = useState<{ cancel: () => void } | null>(null);

  const toggleModality = (m: Modality) => {
    setInputModalities((prev) => 
      prev.includes(m) ? prev.filter(item => item !== m) : [...prev, m]
    );
  };

  const handleSynthesize = async () => {
    setIsLoading(true);
    setError(null);
    if (speechCanceller) {
      speechCanceller.cancel();
      setIsSpeaking(false);
    }

    try {
      // Gather contextual summary of selected modalities from archive
      const relevantItems = archiveItems.filter(i => inputModalities.includes(i.modality));
      const archiveContext = relevantItems.map(i => `[${i.dragon9Timestamp}] (${i.location}) [${i.modality.toUpperCase()}]: ${i.title} - ${i.summary}`).join('\n');

      const response = await fetch('/api/archive/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          output_modality: outputModality,
          input_modalities: inputModalities,
          prompt_focus: promptFocus || (presetItem ? `Specific analysis of artifact: ${presetItem.title}` : ''),
          target_language: targetLanguage,
          archive_context: archiveContext,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to synthesize chronicle');
      }

      setSynthesisResult({
        raw_output: data.raw_output,
        model_used: data.model_used,
        generated_at: data.generated_at,
      });

      // Play subtle chime on completion
      audioEngine.playHarmonicChime();
    } catch (err: any) {
      setError(err.message || 'An error occurred during chronicle synthesis');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!synthesisResult) return;
    navigator.clipboard.writeText(synthesisResult.raw_output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!synthesisResult) return;
    const extension = 
      outputModality === 'json_manifest' || outputModality === 'comedy_localization' 
        ? 'json' 
        : 'md';
    const blob = new Blob([synthesisResult.raw_output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fluidmotiontv_chronicle_${Date.now()}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleSpeech = () => {
    if (isSpeaking && speechCanceller) {
      speechCanceller.cancel();
      setIsSpeaking(false);
      setCurrentSpokenSegment('');
      return;
    }

    if (!synthesisResult) return;

    let textToSpeak = synthesisResult.raw_output;
    // If JSON format, extract localized_text or speech narrative
    if (outputModality === 'comedy_localization') {
      try {
        const parsed = JSON.parse(synthesisResult.raw_output);
        textToSpeak = parsed.localized_text || parsed.timing_markers || textToSpeak;
      } catch {
        // use raw
      }
    }

    const controller = audioEngine.speakWithTiming(textToSpeak, (progress) => {
      setIsSpeaking(progress.isSpeaking);
      setCurrentSpokenSegment(progress.currentSegment);
    });

    setSpeechCanceller(controller);
    setIsSpeaking(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>MULTIMODAL CHRONICLE SYNTHESIS ENGINE</span>
            </div>
            <h2 className="text-xl font-bold text-stone-100">
              Master Chronological Archivist
            </h2>
            <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
              Ingests historical chat logs, code commits from <code className="text-cyan-300">fluidmotiontv-oss/Fluidmotiontv-clock</code> across 36 country nodes, photo archives from Tokyo and Port Waikato (pee dub), surf media pipelines, and sovereign currency registers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-stone-950 px-3 py-2 rounded-lg border border-stone-800 text-xs font-mono text-stone-300 flex items-center gap-2">
              <span className="text-stone-500">Model:</span>
              <span className="text-emerald-400 font-semibold">{model}</span>
            </div>
          </div>
        </div>

        {/* Preset Item Notice */}
        {presetItem && (
          <div className="mt-4 bg-cyan-950/40 border border-cyan-800/80 rounded-lg p-3 text-xs flex items-center justify-between gap-3 text-cyan-200">
            <div>
              <span className="font-semibold text-cyan-300">Target Artifact Selected:</span> {presetItem.title} ({presetItem.dragon9Timestamp})
            </div>
            <button
              onClick={onClearPreset}
              className="text-cyan-400 hover:text-cyan-100 font-mono underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Configuration Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Col 1: Input Modalities */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3">
          <div className="text-xs font-mono text-stone-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>1. Ingest Modalities</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {(['image', 'video', 'audio', 'code', 'text', 'ledger'] as Modality[]).map((m) => {
              const isChecked = inputModalities.includes(m);
              return (
                <button
                  key={m}
                  id={`modality-checkbox-${m}`}
                  onClick={() => toggleModality(m)}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition ${
                    isChecked
                      ? 'bg-cyan-950/60 border-cyan-700 text-cyan-300 font-medium'
                      : 'bg-stone-950 border-stone-800 text-stone-500 hover:text-stone-300'
                  }`}
                >
                  <span className="capitalize">{m}</span>
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${isChecked ? 'bg-cyan-500 border-cyan-400 text-stone-950' : 'border-stone-700'}`}>
                    {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="text-[11px] text-stone-500 font-mono">
            {inputModalities.length} modalities selected for chronological fusion.
          </div>
        </div>

        {/* Col 2: Output Modalities */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3">
          <div className="text-xs font-mono text-stone-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Output Synthesis Format</span>
          </div>

          <div className="space-y-2 text-xs">
            <button
              onClick={() => setOutputModality('structured_markdown')}
              className={`w-full p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition ${
                outputModality === 'structured_markdown'
                  ? 'bg-amber-950/60 border-amber-600 text-amber-200 font-semibold'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="font-medium">Structured Markdown</div>
                <div className="text-[10px] text-stone-400 font-normal">Chronological narrative, event tables & analysis</div>
              </div>
            </button>

            <button
              onClick={() => setOutputModality('json_manifest')}
              className={`w-full p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition ${
                outputModality === 'json_manifest'
                  ? 'bg-amber-950/60 border-amber-600 text-amber-200 font-semibold'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <FileJson className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="font-medium">JSON Manifest</div>
                <div className="text-[10px] text-stone-400 font-normal">Machine-readable hashes & node signatures</div>
              </div>
            </button>

            <button
              onClick={() => setOutputModality('audio')}
              className={`w-full p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition ${
                outputModality === 'audio'
                  ? 'bg-amber-950/60 border-amber-600 text-amber-200 font-semibold'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Volume2 className="w-4 h-4 text-teal-400 shrink-0" />
              <div>
                <div className="font-medium">Audio Media Script</div>
                <div className="text-[10px] text-stone-400 font-normal">[Audio Cue] & [Visual Cue] production script</div>
              </div>
            </button>

            <button
              onClick={() => setOutputModality('comedy_localization')}
              className={`w-full p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition ${
                outputModality === 'comedy_localization'
                  ? 'bg-amber-950/60 border-amber-600 text-amber-200 font-semibold'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <div className="font-medium">Dragon9 Stand-Up Localization</div>
                <div className="text-[10px] text-stone-400 font-normal">Syllable budget & last-word punchline engine</div>
              </div>
            </button>
          </div>
        </div>

        {/* Col 3: Focus & Model Settings */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3">
          <div className="text-xs font-mono text-stone-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>3. Focus & Model</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-stone-400 block mb-1 font-mono">Gemini Model</label>
              <select
                id="model-selector"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (Standard High-Speed)</option>
                <option value="gemini-3.6-flash">gemini-3.6-flash (Stable High-Capacity)</option>
                <option value="gemini-flash-latest">gemini-flash-latest (Auto-Optimized)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Cost-Efficient Lite)</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep Reasoning)</option>
                <option value="gemini-pro-latest">gemini-pro-latest (Stable Pro)</option>
              </select>
            </div>

            {outputModality === 'comedy_localization' && (
              <div>
                <label className="text-stone-400 block mb-1 font-mono">Target Language</label>
                <select
                  id="target-language-selector"
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-800 text-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="JA">JA (Japanese - 親の仇 Style / Natural Flow)</option>
                  <option value="DE">DE (German - Umgangssprache / SOV Verb Ending)</option>
                  <option value="FR">FR (French - Verlan / Conversational)</option>
                  <option value="ES">ES (Spanish - High Pace / Castilian-Latin)</option>
                  <option value="EN">EN (English Standard)</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-stone-400 block mb-1 font-mono">Archival Research Focus (Optional)</label>
              <input
                id="prompt-focus-input"
                type="text"
                value={promptFocus}
                onChange={(e) => setPromptFocus(e.target.value)}
                placeholder="e.g. 'Pee dub bar crossing telemetry & Shibuya clock code'"
                className="w-full bg-stone-950 border border-stone-800 text-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              id="synthesize-submit-btn"
              onClick={handleSynthesize}
              disabled={isLoading || inputModalities.length === 0}
              className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-xs tracking-wider transition ${
                isLoading || inputModalities.length === 0
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-600 via-teal-600 to-amber-600 hover:opacity-90 text-stone-950 shadow-md'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Synthesizing Multimodal Chronicle...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-stone-950" />
                  <span>Execute Multimodal Synthesis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-950/50 border border-red-800 rounded-xl p-4 flex items-center gap-3 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Synthesis Output Display */}
      {synthesisResult && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-lg space-y-0">
          {/* Output Action Bar */}
          <div className="bg-stone-950 px-5 py-3 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-cyan-400 font-semibold">SYNTHESIS COMPLETE</span>
              <span className="text-stone-600">|</span>
              <span className="text-stone-400 font-mono">Format: <span className="text-stone-200 uppercase">{outputModality}</span></span>
              <span className="text-stone-600">|</span>
              <span className="text-stone-400 font-mono">Model: <span className="text-emerald-400">{synthesisResult.model_used}</span></span>
            </div>

            <div className="flex items-center gap-2">
              {/* Voiceover Playback Button for scripts */}
              {(outputModality === 'audio' || outputModality === 'comedy_localization') && (
                <button
                  id="voiceover-playback-btn"
                  onClick={handleToggleSpeech}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                    isSpeaking
                      ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold animate-pulse'
                      : 'bg-stone-900 text-cyan-300 border-cyan-800 hover:bg-stone-800'
                  }`}
                >
                  {isSpeaking ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isSpeaking ? 'Stop Voiceover' : 'Play Voiceover (with Pauses)'}</span>
                </button>
              )}

              <button
                id="copy-synthesis-btn"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-300 hover:text-stone-100 hover:bg-stone-800 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                id="download-synthesis-btn"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Current Spoken Segment Display */}
          {isSpeaking && currentSpokenSegment && (
            <div className="bg-amber-950/40 border-b border-amber-800/60 px-5 py-2 text-xs text-amber-300 font-mono flex items-center gap-2 animate-pulse">
              <Volume2 className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Voiceover: "{currentSpokenSegment}"</span>
            </div>
          )}

          {/* Rendered Body */}
          <div className="p-6 bg-stone-950/70 font-mono text-xs text-stone-200 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[600px] scrollbar-thin">
            {synthesisResult.raw_output}
          </div>
        </div>
      )}
    </div>
  );
};
