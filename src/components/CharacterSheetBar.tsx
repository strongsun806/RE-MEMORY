/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { CharacterSheet } from '../logic/memoryStory.ts';

interface CharacterSheetBarProps {
  sheet: CharacterSheet;
  eraYear: string;
  theme: string;
  continuityScore: number;
}

export const CharacterSheetBar: React.FC<CharacterSheetBarProps> = ({
  sheet,
  eraYear,
  theme,
  continuityScore,
}) => {
  return (
    <div className="clay-card mx-4 sm:mx-6 my-4 p-5 border-2 border-[#FEF08A] bg-gradient-to-r from-[#FFFDF0] via-[#FEFCE8] to-[#FFFBEB]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b-2 border-[#FEF08A]/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-2xl bg-[#FEF08A] text-[#B45309] shadow-[0_2px_6px_rgba(245,158,11,0.25),inset_0_2px_3px_rgba(255,255,255,0.8)] border border-[#FDE047]">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-[#451A03] font-serif-kr">
                Argon 1M 캐릭터 & 시대 레퍼런스 시트
              </span>
              <span className="text-xs font-black text-[#059669] px-2.5 py-0.5 bg-[#D1FAE5] border border-[#A7F3D0] rounded-full shadow-sm flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                15/15 Passed ({continuityScore}%)
              </span>
            </div>
            <p className="text-xs text-[#78350F] font-batang line-clamp-1 mt-0.5">
              테마: {theme}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <span className="flex items-center gap-1.5 text-[#B45309] bg-[#FEF3C7] px-3 py-1 rounded-full border border-[#FDE047] font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{eraYear}년 완벽 고증</span>
          </span>
          <span className="text-xs font-bold text-[#78350F]">
            4개 컷 프롬프트 토큰 영구 잠금
          </span>
        </div>
      </div>

      {/* Token Properties Grid in 3D Pastel Pill Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 text-xs">
        {/* Token 1: Protagonist */}
        <div className="clay-inset p-3 bg-white/80 border border-[#FEF08A] rounded-2xl flex flex-col gap-1">
          <span className="text-[11px] font-mono-code uppercase text-[#B45309] font-extrabold tracking-wider">
            인물 및 연령
          </span>
          <span className="font-extrabold text-[#291505] truncate font-serif-kr" title={sheet.protagonistName}>
            {sheet.protagonistName}
          </span>
          <span className="text-[#78350F] text-[11px] truncate font-batang" title={sheet.eraAndAge}>
            {sheet.eraAndAge}
          </span>
        </div>

        {/* Token 2: Facial Features */}
        <div className="clay-inset p-3 bg-white/80 border border-[#FEF08A] rounded-2xl flex flex-col gap-1">
          <span className="text-[11px] font-mono-code uppercase text-[#B45309] font-extrabold tracking-wider">
            얼굴 및 표정
          </span>
          <span className="text-[#451A03] text-[11px] line-clamp-2 font-serif-kr" title={sheet.facialFeatures}>
            {sheet.facialFeatures}
          </span>
        </div>

        {/* Token 3: Costume Design */}
        <div className="clay-inset p-3 bg-white/80 border border-[#FEF08A] rounded-2xl flex flex-col gap-1">
          <span className="text-[11px] font-mono-code uppercase text-[#B45309] font-extrabold tracking-wider">
            의상 및 헤어스타일
          </span>
          <span className="text-[#451A03] text-[11px] line-clamp-2 font-serif-kr" title={sheet.costumeDesign}>
            {sheet.costumeDesign}
          </span>
        </div>

        {/* Token 4: Core Key Prop */}
        <div className="clay-inset p-3 bg-gradient-to-br from-[#FEFCE8] to-[#FEF3C7] border-2 border-[#FDE047] rounded-2xl flex flex-col gap-1 shadow-sm">
          <span className="text-[11px] font-mono-code uppercase text-[#D97706] font-black tracking-wider">
            ★ 핵심 연속성 오브제
          </span>
          <span className="font-black text-[#B45309] text-[11px] line-clamp-2 font-serif-kr" title={sheet.coreKeyProp}>
            {sheet.coreKeyProp}
          </span>
        </div>

        {/* Token 5: Color Palette */}
        <div className="clay-inset p-3 bg-white/80 border border-[#FEF08A] rounded-2xl flex flex-col gap-1">
          <span className="text-[11px] font-mono-code uppercase text-[#B45309] font-extrabold tracking-wider">
            영화적 색채 팔레트
          </span>
          <span className="text-[#451A03] text-[11px] line-clamp-2 font-serif-kr" title={sheet.colorPaletteTokens}>
            {sheet.colorPaletteTokens}
          </span>
        </div>
      </div>
    </div>
  );
};
