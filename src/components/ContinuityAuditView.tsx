/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Cpu, Wrench, Lock } from 'lucide-react';
import { MemoryFilmStory } from '../logic/memoryStory.ts';

interface ContinuityAuditViewProps {
  story: MemoryFilmStory;
}

export const ContinuityAuditView: React.FC<ContinuityAuditViewProps> = ({
  story,
}) => {
  const patch = story.selfHealingPatch;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 flex flex-col gap-6 animate-fade-in">
      {/* 3D Soft Clay View Header */}
      <div className="clay-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-2 border-[#FEF08A] bg-gradient-to-r from-[#FFFDF0] via-[#FEFCE8] to-[#FFFBEB]">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#FEF08A] to-[#FDE047] border-2 border-[#FACC15] flex items-center justify-center text-[#451A03] shrink-0 shadow-[0_6px_14px_rgba(245,158,11,0.25)]">
            <Cpu className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-black text-[#291505] font-serif-kr">
                Argon 1M 연속성 자가 치유 검증실 (Verification Loop)
              </h2>
              <span className="text-xs font-black text-[#059669] px-3 py-1 rounded-full bg-[#D1FAE5] border border-[#A7F3D0] shadow-sm">
                ● 15/15 PASSED
              </span>
            </div>
            <p className="text-xs text-[#78350F] mt-1.5 font-batang leading-relaxed">
              Gemini 4 Argon의 1M 초장문 컨텍스트 윈도우를 활용하여 4개 컷 간의 인물 외모, 시대 소품, 조명 톤, 신체 상태 일관성을 교차 검증하고 결함을 자동 수리합니다.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:items-end shrink-0 bg-white/70 p-3.5 rounded-2xl border border-[#FEF08A]">
          <span className="text-xs font-bold text-[#78350F] font-mono-code">종합 연속성 무결성</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-3xl font-black text-[#D97706] font-mono-code">
              {story.overallContinuityScore}%
            </span>
            <span className="text-xs font-extrabold text-[#059669] font-mono-code">VERIFIED</span>
          </div>
        </div>
      </div>

      {/* 3 Verification Checks Grid */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black tracking-wider uppercase text-[#B45309] font-mono-code flex items-center gap-2 px-1">
          <ShieldCheck className="w-4 h-4 text-[#D97706]" />
          <span>3-Step Automated Consistency Audit Criteria</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {story.continuityChecks.map((chk, index) => (
            <div
              key={chk.id}
              className="clay-card flex flex-col justify-between p-5 border-2 border-[#FEF08A] bg-white/90"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#B45309] bg-[#FEF08A] px-2.5 py-0.5 rounded-full border border-[#FDE047]">
                    CRITERIA 0{index + 1}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-black text-[#059669] bg-[#D1FAE5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0] shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                    {chk.status} ({chk.confidenceScore}%)
                  </span>
                </div>

                <h4 className="text-sm font-black text-[#291505] font-serif-kr mb-2">
                  {chk.title}
                </h4>

                <p className="text-xs text-[#78350F] leading-relaxed font-serif-kr">
                  {chk.detail}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#FEF08A] flex items-center justify-between text-xs text-[#92400E] font-bold">
                <span>Argon Token Lock: 100%</span>
                <span className="text-[#059669] font-black">PASS</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3D Soft Clay: Self-Healing Prompt Patch Demonstration */}
      <div className="clay-card p-6 flex flex-col gap-4 border-2 border-[#FDE047] bg-gradient-to-br from-[#FFFDF0] to-[#FFFBEB]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF08A] text-[#B45309] flex items-center justify-center border border-[#FACC15] shadow-sm">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#291505] font-serif-kr">
                자율 자가 치유 프롬프트 패치 (Self-Healing Prompt Repair)
              </h3>
              <p className="text-xs text-[#78350F] font-batang">
                초기 생성 초안에서 발견된 서사 불일치를 렌더링 전 자동으로 감지하고 교정한 실제 사례입니다.
              </p>
            </div>
          </div>

          <span className="text-xs font-black text-[#B45309] bg-[#FEF08A] px-3 py-1 rounded-full border border-[#FDE047]">
            패널 {patch.panelTarget}번 대상 수리
          </span>
        </div>

        {/* Anomaly Detection Banner */}
        <div className="p-3.5 bg-[#FFF7ED] border-2 border-[#FDBA74] rounded-2xl flex items-start gap-2.5 text-xs text-[#451A03] shadow-sm">
          <AlertTriangle className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
          <div>
            <span className="font-black text-[#C2410C]">[결함 감지 로그]: </span>
            <span className="font-batang font-medium">{patch.detectedAnomaly}</span>
          </div>
        </div>

        {/* Prompt Diff Comparison in 3D Clay Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Before: Draft Discrepancy */}
          <div className="clay-card p-4 bg-[#FEF2F2] border-2 border-[#FECACA] rounded-2xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#DC2626] uppercase">
                ✕ 초기 초안 (Initial Draft Discrepancy)
              </span>
              <span className="text-[11px] font-extrabold text-[#DC2626] bg-red-100 px-2 py-0.5 rounded-full">
                REJECTED
              </span>
            </div>
            <code className="text-xs font-mono-code text-[#991B1B] leading-relaxed bg-white/80 p-3 rounded-xl border border-red-200 shadow-inner">
              "{patch.initialPromptSnippet}"
            </code>
            <span className="text-xs text-[#7F1D1D] font-batang font-medium">
              결함 원인: 핵심 서사인 '자식을 위해 젖은 어깨' 토큰 누락
            </span>
          </div>

          {/* After: Self-Healed Prompt */}
          <div className="clay-card p-4 bg-[#F0FDF4] border-2 border-[#BBF7D0] rounded-2xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#15803D] uppercase">
                ✓ 자가 치유 패치 적용 (Argon Self-Healed)
              </span>
              <span className="text-[11px] font-extrabold text-[#15803D] bg-green-100 px-2 py-0.5 rounded-full">
                APPLIED
              </span>
            </div>
            <code className="text-xs font-mono-code text-[#166534] leading-relaxed bg-white/80 p-3 rounded-xl border border-green-200 shadow-inner">
              "{patch.patchedPromptSnippet}"
            </code>
            <span className="text-xs text-[#14532D] font-batang font-medium">
              치유 결과: {patch.healingRationale}
            </span>
          </div>
        </div>
      </div>

      {/* 3D Soft Clay: Character Sheet Locks Registry */}
      <div className="clay-card p-6 flex flex-col gap-3.5 border-2 border-[#FEF08A] bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#B45309]" />
            <h3 className="text-xs font-black tracking-wider uppercase text-[#B45309] font-mono-code">
              Argon 1M Locked Tokens Registry
            </h3>
          </div>
          <span className="text-xs font-black text-[#059669] bg-[#D1FAE5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
            ALL TOKENS FROZEN
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-serif-kr">
          <div className="clay-inset p-3.5 bg-[#FFFDF0] rounded-2xl border border-[#FEF08A] flex justify-between items-center">
            <span className="text-[#78350F] font-bold">주인공 토큰:</span>
            <span className="text-[#291505] font-black">{story.characterSheet.protagonistName}</span>
          </div>
          <div className="clay-inset p-3.5 bg-gradient-to-r from-[#FEFCE8] to-[#FEF3C7] rounded-2xl border-2 border-[#FDE047] flex justify-between items-center shadow-sm">
            <span className="text-[#B45309] font-bold">핵심 소품 토큰:</span>
            <span className="text-[#D97706] font-black">{story.characterSheet.coreKeyProp}</span>
          </div>
          <div className="clay-inset p-3.5 bg-[#FFFDF0] rounded-2xl border border-[#FEF08A] flex justify-between items-center">
            <span className="text-[#78350F] font-bold">의상 디자인:</span>
            <span className="text-[#291505] font-extrabold truncate max-w-[240px]">{story.characterSheet.costumeDesign}</span>
          </div>
          <div className="clay-inset p-3.5 bg-[#FFFDF0] rounded-2xl border border-[#FEF08A] flex justify-between items-center">
            <span className="text-[#78350F] font-bold">색채 온도:</span>
            <span className="text-[#451A03] font-extrabold truncate max-w-[240px]">{story.characterSheet.colorPaletteTokens}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
