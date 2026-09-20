/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { REPOSITORY_FILES } from '../data/repositoryData';
import { RepoFile } from '../types';
import { 
  GitBranch, 
  FileCode, 
  Copy, 
  Check, 
  Clock, 
  Terminal, 
  FolderGit2, 
  Code2 
} from 'lucide-react';

export const CodeRepoView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<RepoFile>(REPOSITORY_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Repository Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono text-stone-100">
                  fluidmotiontv-oss / Fluidmotiontv-clock
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                  v3.6.0-release
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Core distributed temporal synchronization daemon deployed across 36 global country nodes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-stone-950 border border-stone-800 text-stone-400">
              Branch: <strong className="text-stone-200">main</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-stone-950 border border-stone-800 text-emerald-400">
              36 Nodes Ingested
            </span>
          </div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left: File Tree */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3">
          <div className="text-xs font-mono text-stone-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-purple-400" />
            <span>Ingested File Tree</span>
          </div>

          <div className="space-y-1.5">
            {REPOSITORY_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              const fileName = file.path.split('/').pop() || file.path;

              return (
                <button
                  key={file.path}
                  id={`repo-file-${fileName}`}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex flex-col gap-0.5 ${
                    isSelected
                      ? 'bg-purple-950/60 border-purple-600 text-purple-200 font-medium'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-purple-400' : 'text-stone-500'}`} />
                    <span className="truncate font-mono">{fileName}</span>
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono truncate pl-5">
                    {file.size} • {file.language}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-800/80 text-[11px] text-stone-500 font-mono space-y-1">
            <div>License: Apache-2.0</div>
            <div>Runtime: Rust (Engine) / TypeScript (Mesh)</div>
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="md:col-span-3 bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
          {/* File Action Bar */}
          <div className="bg-stone-950 px-4 py-3 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-cyan-400 font-semibold">{selectedFile.path}</span>
              <span className="text-stone-600">|</span>
              <span className="text-stone-400 text-[11px]">{selectedFile.size}</span>
            </div>

            <button
              id="copy-code-btn"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-300 hover:text-stone-100 hover:bg-stone-800 transition text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Commit Message Tag */}
          <div className="bg-stone-950/60 px-4 py-2 border-b border-stone-800/60 text-xs font-mono text-stone-400 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Latest Commit: <span className="text-stone-200">{selectedFile.lastCommit}</span></span>
          </div>

          {/* Description */}
          <div className="bg-stone-950/30 px-4 py-2 border-b border-stone-800/40 text-xs text-stone-400">
            {selectedFile.description}
          </div>

          {/* Code Text with line numbers */}
          <div className="p-4 bg-stone-950 font-mono text-xs text-stone-200 overflow-x-auto max-h-[550px] scrollbar-thin leading-relaxed">
            <pre className="whitespace-pre">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
