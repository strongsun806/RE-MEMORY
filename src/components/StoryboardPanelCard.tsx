/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Camera,
  Music,
  Sparkles,
  Volume2,
  RotateCcw,
  MessageSquare,
  CheckCircle,
  Film,
  Palette,
} from 'lucide-react';
import { StoryboardPanel } from '../logic/memoryStory.ts';
import { RainCanvasOverlay } from './RainCanvasOverlay.tsx';
import { audioEngine } from '../audio/audioEngine.ts';

export type CinematicFilter = 'ghibli' | 'pixar' | 'vintage' | 'original';

export interface FilterConfig {
  label: string;
  filterStyle: string;
  badgeKo: string;
  desc: string;
  borderColor: string;
  frameBoxShadow: string;
  bgMatte: string;
  glowOverlay: string;
}

export const CINEMATIC_FILTERS: Record<CinematicFilter, FilterConfig> = {
  ghibli: {
    label: 'Studio Ghibli Watercolor',
    filterStyle: 'saturate(1.25) contrast(1.06) brightness(1.04) sepia(0.08) hue-rotate(-4deg)',
    badgeKo: '지브리 수채화 톤',
    desc: '포근하고 따스한 감성 수채화 색채',
    borderColor: '#FFFDF0',
    frameBoxShadow:
      '0 18px 36px -6px rgba(16, 185, 129, 0.16), 0 6px 16px -2px rgba(251, 191, 36, 0.18), inset 0 2px 4px rgba(255, 255, 255, 0.95)',
    bgMatte: '#141E1B',
    glowOverlay: 'radial-gradient(circle at 50% 30%, rgba(167, 243, 208, 0.14) 0%, transparent 70%)',
  },
  pixar: {
    label: 'Pixar 3D Clay',
    filterStyle: 'contrast(1.18) saturate(1.30) brightness(1.02) drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
    badgeKo: '픽사 3D 클레이 톤',
    desc: '입체적이고 몽글몽글한 3D 애니메이션 질감',
    borderColor: '#FEF08A',
    frameBoxShadow:
      '0 20px 40px -8px rgba(245, 158, 11, 0.28), 0 8px 18px -2px rgba(217, 119, 6, 0.2), inset 0 3px 6px rgba(255, 255, 255, 0.95)',
    bgMatte: '#1E1711',
    glowOverlay: 'radial-gradient(circle at 50% 30%, rgba(253, 224, 71, 0.16) 0%, transparent 70%)',
  },
  vintage: {
    label: 'Vintage 1990s Film',
    filterStyle: 'sepia(0.38) contrast(1.12) brightness(0.95) saturate(0.82) hue-rotate(6deg)',
    badgeKo: '90년대 빈티지 필름 톤',
    desc: '아날로그 코다크롬 감성의 클래식 필름',
    borderColor: '#FDE68A',
    frameBoxShadow:
      '0 20px 38px -8px rgba(120, 53, 15, 0.32), 0 8px 20px -2px rgba(69, 26, 3, 0.24), inset 0 2px 5px rgba(254, 243, 199, 0.85)',
    bgMatte: '#18120C',
    glowOverlay: 'radial-gradient(circle at 50% 30%, rgba(217, 119, 6, 0.22) 0%, transparent 70%)',
  },
  original: {
    label: 'Original Frame',
    filterStyle: 'none',
    badgeKo: '원본 필름',
    desc: '무보정 원본 렌더링',
    borderColor: '#FFFFFF',
    frameBoxShadow: '0 14px 28px -6px rgba(0, 0, 0, 0.08), inset 0 3px 6px rgba(255, 255, 255, 0.9)',
    bgMatte: '#18161E',
    glowOverlay: 'transparent',
  },
};

interface StoryboardPanelCardProps {
  panel: StoryboardPanel;
  onRepaintFrame: (panelNumber: number, prompt: string, title: string) => Promise<void>;
  isRepainting: boolean;
  externalFilter?: CinematicFilter;
}

export const StoryboardPanelCard: React.FC<StoryboardPanelCardProps> = ({
  panel,
  onRepaintFrame,
  isRepainting,
  externalFilter,
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [panelFilter, setPanelFilter] = useState<CinematicFilter>(
    panel.panelNumber === 1 || panel.panelNumber === 4 ? 'ghibli' : 'pixar'
  );

  const activeFilterKey = externalFilter || panelFilter;
  const activeFilterConfig = CINEMATIC_FILTERS[activeFilterKey];

  const handleSpeakPanel = () => {
    setIsPlayingVoice(true);
    const textToSpeak = panel.dialogueKr
      ? `${panel.dialogueKr}. ${panel.narrationKr}`
      : panel.narrationKr;

    audioEngine.speakNarration(textToSpeak, 'ko-KR', () => {
      setIsPlayingVoice(false);
    });
  };

  const handleRepaintClick = async () => {
    if (isRepainting) return;
    await onRepaintFrame(panel.panelNumber, panel.imagePrompt, panel.title);
  };

  const hasRain = panel.moodTone === 'melancholic' || panel.moodTone === 'sacrificial';

  return (
    <article className="clay-card flex flex-col p-4 border border-[#F59E0B]/25 overflow-hidden transition-all duration-500 hover:shadow-[0_16px_32px_-8px_rgba(245,158,11,0.2)] bg-white">
      {/* 3D Panel Header */}
      <div className="flex items-center justify-between px-1 pb-2.5 mb-2 border-b border-[#FEF08A]/70">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#FEF08A] to-[#FDE047] text-[#291505] text-xs font-mono-code font-black shadow-[0_2px_5px_rgba(245,158,11,0.25)] border border-[#FACC15]">
            0{panel.panelNumber}
          </span>
          <h3 className="text-sm md:text-base font-black text-[#291505] font-serif-kr truncate max-w-[190px]">
            {panel.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#78350F] bg-[#FEF3C7] px-2.5 py-1 rounded-xl border border-[#FDE047]">
            <Camera className="w-3.5 h-3.5 text-[#B45309]" />
            <span className="truncate max-w-[140px]">{panel.cameraDirection}</span>
          </div>

          <button
            type="button"
            onClick={handleSpeakPanel}
            className={`clay-btn p-1.5 rounded-xl transition-all ${
              isPlayingVoice
                ? 'bg-[#FDE047] text-[#291505] scale-105'
                : 'bg-white text-[#78350F] hover:bg-[#FFFBEB] border border-[#FEF08A]'
            }`}
            title="이 컷의 대사 및 나레이션 음성 듣기"
            aria-label="Play narration for panel"
          >
            <Volume2 className="w-4 h-4 text-[#B45309]" />
          </button>
        </div>
      </div>

      {/* Frame Control Bar: Cinematic Filter Dropdown + Live AI Re-Frame */}
      <div className="flex items-center justify-between gap-1.5 mb-2 px-0.5">
        {/* Cinematic Filter Dropdown */}
        <div className="clay-btn flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-xl bg-[#FFFDF0] text-[#291505] border border-[#FEF08A] shadow-sm hover:bg-[#FEF08A] transition-colors shrink min-w-0">
          <Film className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
          <span className="text-[11px] text-[#78350F] font-bold shrink-0">필터:</span>
          <label htmlFor={`filter-select-${panel.panelNumber}`} className="sr-only">
            Cinematic Filter
          </label>
          <select
            id={`filter-select-${panel.panelNumber}`}
            value={activeFilterKey}
            onChange={(e) => setPanelFilter(e.target.value as CinematicFilter)}
            className="bg-transparent text-xs font-extrabold text-[#291505] focus:outline-none cursor-pointer truncate max-w-[140px] sm:max-w-[160px]"
            title="시네마틱 컬러 그레이딩 필터 스타일 변경"
          >
            <option value="ghibli">Studio Ghibli Watercolor</option>
            <option value="pixar">Pixar 3D Clay</option>
            <option value="vintage">Vintage 1990s Film</option>
            <option value="original">Original Frame</option>
          </select>
        </div>

        {/* Live AI Re-Frame Button */}
        <button
          type="button"
          onClick={handleRepaintClick}
          disabled={isRepainting}
          className="clay-btn flex items-center gap-1.5 px-2.5 py-1 text-xs font-black rounded-xl bg-white hover:bg-[#FEF08A] text-[#291505] border border-[#FEF08A] shadow-sm transition-all active:scale-95 shrink-0"
          title="Gemini 2.5 Flash Image로 이 컷을 실시간 재채색 생성합니다"
        >
          {isRepainting ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 animate-spin text-[#B45309]" />
              <span className="font-mono-code text-[11px]">Re-Framing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
              <span className="font-sans text-[11px]">🎨 Live AI Re-Frame</span>
            </>
          )}
        </button>
      </div>

      {/* 3D Pastel Picture Frame with Gentle Smooth CSS Transition on Image, Border, Shadow, and Glow */}
      <div
        className="clay-frame relative aspect-video w-full overflow-hidden group border-4 transition-[border-color,box-shadow,background-color] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{
          borderColor: activeFilterConfig.borderColor,
          boxShadow: activeFilterConfig.frameBoxShadow,
          backgroundColor: activeFilterConfig.bgMatte,
        }}
      >
        <img
          src={panel.imageUrl}
          alt={panel.title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('modern_yeouido_umbrella')) {
              target.src = '/src/assets/images/modern_yeouido_umbrella_1792126631102.jpg';
            }
          }}
          style={{ filter: activeFilterConfig.filterStyle }}
          className="w-full h-full object-cover transition-[filter,transform] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
        />

        {/* Smooth Aesthetic Mood Glow Overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-in-out"
          style={{ background: activeFilterConfig.glowOverlay }}
        />

        {/* Live Canvas Rain overlay */}
        {hasRain && <RainCanvasOverlay density={24} speed={1.1} />}

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/75 via-transparent to-black/20" />

        {/* 3D Pillowy Korean Webtoon Speech Bubble Overlay */}
        {panel.dialogueKr && (
          <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20 flex justify-start pointer-events-none">
            <div className="max-w-[92%] bg-white text-[#291505] px-4 py-2.5 rounded-3xl rounded-bl-none shadow-[0_8px_20px_rgba(41,21,5,0.22)] border-2 border-[#FEF08A] font-batang text-xs sm:text-sm font-extrabold leading-relaxed tracking-tight">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                <span>{panel.dialogueKr}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Script & Narration Body with High Contrast Espresso Brown & Slate Text */}
      <div className="flex flex-col gap-2 p-3 mt-2.5 bg-[#FAF9F5] rounded-2xl border border-[#FEF08A]/60">
        {/* Poetic Korean Narration */}
        <p className="text-xs sm:text-sm text-[#0F172A] font-serif-kr leading-relaxed font-bold">
          {panel.narrationKr}
        </p>

        {/* English Subtitle */}
        <p className="text-xs text-[#475569] font-sans leading-relaxed italic border-l-2 border-[#F59E0B] pl-2.5">
          {panel.narrationEn}
        </p>

        {/* Active Filter Indicator & Director Foley Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 mt-1 border-t border-[#FEF08A]/60 text-xs">
          <div className="flex items-center gap-2 text-[#78350F] font-medium truncate max-w-sm">
            <span className="inline-flex items-center gap-1 font-bold bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-lg border border-[#FDE047] text-[10px] transition-all duration-500">
              <Palette className="w-3 h-3 text-[#B45309]" />
              <span>{activeFilterConfig.badgeKo}</span>
            </span>
            <span className="truncate font-batang" title={panel.foleyCue}>
              {panel.foleyCue}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#059669] font-black bg-[#DCFCE7] px-2.5 py-0.5 rounded-full border border-[#86EFAC] shrink-0 shadow-sm">
            <CheckCircle className="w-3 h-3 fill-current" />
            <span className="truncate font-sans">{panel.continuityBadge}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
