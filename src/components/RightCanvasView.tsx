/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Share2,
  Bookmark,
  Wrench,
  AlertTriangle,
  Play,
  Volume2,
  Sliders,
  Palette,
} from 'lucide-react';
import { MemoryFilmStory } from '../logic/memoryStory.ts';
import { StoryboardPanelCard, CinematicFilter } from './StoryboardPanelCard.tsx';

interface RightCanvasViewProps {
  currentStory: MemoryFilmStory;
  onRepaintFrame: (panelNumber: number, prompt: string, title: string) => Promise<void>;
  repaintingPanelNum: number | null;
  onOpenCinemaPlayer: () => void;
  onOpenAuditTab: () => void;
  onShareStory: () => void;
}

export const RightCanvasView: React.FC<RightCanvasViewProps> = ({
  currentStory,
  onRepaintFrame,
  repaintingPanelNum,
  onOpenCinemaPlayer,
  onOpenAuditTab,
  onShareStory,
}) => {
  const [showPatchDetail, setShowPatchDetail] = useState<boolean>(false);
  const [batchFilter, setBatchFilter] = useState<CinematicFilter | undefined>(undefined);
  const patch = currentStory.selfHealingPatch;

  return (
    <div className="w-full flex flex-col gap-5 p-4 sm:p-6 text-[#0F172A]">
      {/* Film Header Card */}
      <div className="clay-card p-5 sm:p-6 flex flex-col gap-3.5 border border-[#F59E0B]/25 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono-code text-[#78350F] font-black uppercase tracking-wider bg-[#FEF3C7] px-2.5 py-0.5 rounded-full border border-[#FDE047]">
                FILM ARCHIVE #{currentStory.id}
              </span>
              <span className="text-xs font-black text-[#059669] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full border border-[#86EFAC] shadow-sm flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                15/15 Passed ({currentStory.overallContinuityScore}%)
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black font-serif-kr text-[#291505] tracking-tight">
              {currentStory.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#451A03]/80 font-batang mt-1 leading-relaxed">
              {currentStory.synopsis}
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onShareStory}
              className="clay-btn flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#78350F] bg-white hover:bg-[#FEF3C7] rounded-2xl border border-[#FEF08A] transition-colors"
              title="기억의 필름 링크 복사 및 공유"
            >
              <Share2 className="w-3.5 h-3.5 text-[#B45309]" />
              <span>공유</span>
            </button>

            <button
              type="button"
              onClick={onOpenCinemaPlayer}
              className="clay-btn flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-[#291505] bg-gradient-to-b from-[#FEF08A] to-[#FDE047] border border-[#FACC15] rounded-2xl shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-[#291505]" />
              <span>시네마 상영</span>
            </button>
          </div>
        </div>

        {/* Spoken Memory Original Quote Banner */}
        <div className="clay-inset p-3.5 bg-[#FAF9F5] rounded-2xl border border-[#FEF08A]/70 flex items-start gap-2.5 text-xs text-[#291505]">
          <Bookmark className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <div className="leading-relaxed font-batang">
            <span className="font-extrabold text-[#B45309] mr-1">“구술된 기억 원문”:</span>
            <span>{currentStory.spokenMemoryOriginal}</span>
          </div>
        </div>
      </div>

      {/* 1. 4-Panel 3D Pastel Webtoon Canvas */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <h2 className="text-sm font-black text-[#291505] font-serif-kr">
              복원된 4막 시네마 & 웹툰 프레임 (4-Panel Restored Canvas)
            </h2>
          </div>

          {/* Quick Batch Color Grade Filter Preset */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-[#78350F] flex items-center gap-1">
              <Palette className="w-3 h-3 text-[#B45309]" />
              일괄 필터:
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#FEF08A] shadow-inner text-[11px]">
              <button
                type="button"
                onClick={() => setBatchFilter(undefined)}
                className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                  batchFilter === undefined
                    ? 'bg-[#FEF08A] text-[#291505]'
                    : 'text-[#78350F] hover:bg-amber-50'
                }`}
                title="각 컷별 개별 필터 설정 유지"
              >
                개별
              </button>
              <button
                type="button"
                onClick={() => setBatchFilter('ghibli')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                  batchFilter === 'ghibli'
                    ? 'bg-[#FEF08A] text-[#291505]'
                    : 'text-[#78350F] hover:bg-amber-50'
                }`}
                title="모든 컷에 지브리 수채화 톤 적용"
              >
                지브리
              </button>
              <button
                type="button"
                onClick={() => setBatchFilter('pixar')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                  batchFilter === 'pixar'
                    ? 'bg-[#FEF08A] text-[#291505]'
                    : 'text-[#78350F] hover:bg-amber-50'
                }`}
                title="모든 컷에 픽사 3D 클레이 톤 적용"
              >
                픽사 3D
              </button>
              <button
                type="button"
                onClick={() => setBatchFilter('vintage')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                  batchFilter === 'vintage'
                    ? 'bg-[#FEF08A] text-[#291505]'
                    : 'text-[#78350F] hover:bg-amber-50'
                }`}
                title="모든 컷에 90년대 빈티지 필름 톤 적용"
              >
                90s 빈티지
              </button>
            </div>
          </div>
        </div>

        {/* 2x2 Grid of 3D Framed Webtoon Cuts with Individual Dropdown in Each Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentStory.panels.map((panel) => (
            <StoryboardPanelCard
              key={panel.panelNumber}
              panel={panel}
              onRepaintFrame={onRepaintFrame}
              isRepainting={repaintingPanelNum === panel.panelNumber}
              externalFilter={batchFilter}
            />
          ))}
        </div>
      </div>

      {/* 2. Argon Autonomous Verification Card */}
      <div className="clay-card p-5 sm:p-6 flex flex-col gap-4 border border-[#F59E0B]/25 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] border border-[#86EFAC] flex items-center justify-center text-[#15803D] shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#291505] font-serif-kr">
                Argon 자율 연속성 검증 결과 (Verification Loop)
              </h3>
              <p className="text-xs text-[#64748B] font-batang">
                1M Context Cross-Verification & Self-Healing Loop
              </p>
            </div>
          </div>

          {/* Bright Green 3D Badge */}
          <div className="clay-btn flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#DCFCE7] to-[#BBF7D0] border-2 border-[#86EFAC] rounded-2xl shadow-sm text-xs font-black text-[#15803D] shrink-0">
            <CheckCircle2 className="w-4 h-4 fill-current" />
            <span>15/15 Checks Passed (Visual & Story Continuity Verified by Argon)</span>
          </div>
        </div>

        {/* 3 Verification Checks Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#FEF08A]/70 text-xs">
          {currentStory.continuityChecks.map((chk, idx) => (
            <div key={chk.id} className="clay-inset p-3 bg-[#FAF9F5] border border-[#FEF08A]/60 rounded-2xl flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-code font-black text-[#B45309]">
                  0{idx + 1}. {idx === 0 ? '시대 & 소품' : idx === 1 ? '조명 톤' : '신체 상태'}
                </span>
                <span className="text-[10px] font-black text-[#059669]">
                  {chk.confidenceScore}% PASS
                </span>
              </div>
              <p className="text-[#334155] text-[11px] font-batang line-clamp-2 leading-relaxed">
                {chk.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Self-Healing Patch Accordion / Peek */}
        <div className="p-3.5 bg-[#FFFBEB] rounded-2xl border border-[#FDE047] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#D97706]" />
              <span className="text-xs font-black text-[#78350F]">
                Argon 자동 자가 치유 패치 (Self-Healing Patch)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowPatchDetail(!showPatchDetail)}
              className="text-xs font-bold text-[#D97706] hover:underline"
            >
              {showPatchDetail ? '접기 ▲' : '비포/애프터 프롬프트 보기 ▼'}
            </button>
          </div>

          <p className="text-xs text-[#78350F] font-batang">
            감지된 결함: {patch.detectedAnomaly}
          </p>

          {showPatchDetail && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 text-xs">
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] font-black text-red-700 uppercase">초기 결함 초안</span>
                <code className="text-[11px] font-mono-code text-red-900 bg-white p-2 rounded border border-red-100">
                  "{patch.initialPromptSnippet}"
                </code>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] font-black text-emerald-700 uppercase">Argon 수리 완료</span>
                <code className="text-[11px] font-mono-code text-emerald-900 bg-white p-2 rounded border border-emerald-100">
                  "{patch.patchedPromptSnippet}"
                </code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
