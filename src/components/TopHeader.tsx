/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Play, Clapperboard, Sparkles, ShieldCheck, Heart, Zap } from 'lucide-react';

interface TopHeaderProps {
  activeTab: 'director' | 'cinema' | 'audit';
  onSelectTab: (tab: 'director' | 'cinema' | 'audit') => void;
  isAmbiencePlaying: boolean;
  isMuted: boolean;
  onToggleAmbience: () => void;
  onOpenCinemaPlayer: () => void;
  onRunDemoScenario?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onSelectTab,
  isAmbiencePlaying,
  isMuted,
  onToggleAmbience,
  onOpenCinemaPlayer,
  onRunDemoScenario,
}) => {
  return (
    <header className="sticky top-2 z-40 px-3 sm:px-6 py-1">
      {/* 3D Floating Clay Island Header */}
      <div className="clay-card flex items-center justify-between gap-3 px-3 sm:px-5 py-2.5 bg-white/95 backdrop-blur-md border border-[#F59E0B]/25 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)]">
        {/* Zone 1: Brand Wordmark + 3D Butter Badge */}
        <div className="flex items-center gap-2.5 shrink-0 min-w-max">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FEF08A] to-[#FDE047] flex items-center justify-center text-[#291505] shadow-[0_4px_10px_rgba(245,158,11,0.22),inset_0_2px_4px_rgba(255,255,255,0.85)] border border-[#FACC15] shrink-0">
            <Heart className="w-5 h-5 fill-[#B45309] text-[#B45309]" />
          </div>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('director');
            }}
            className="flex items-baseline gap-1 text-base sm:text-lg font-black font-serif-kr tracking-tight text-[#291505] hover:text-[#B45309] transition-colors whitespace-nowrap shrink-0"
          >
            RE:MEMORY
            <span className="text-[#B45309] font-bold font-batang text-xs sm:text-sm">
              (기억의 필름)
            </span>
          </a>

          {/* 3D Butter Badge */}
          <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-mono-code font-bold text-[#78350F] bg-[#FEF3C7] px-2.5 py-1 rounded-xl border border-[#FDE047] shadow-sm whitespace-nowrap shrink-0 min-w-max">
            <Sparkles className="w-3 h-3 text-[#D97706] shrink-0" />
            <span>Powered by Gemini 4 Argon Showrunner & Live UI Re-Compiler</span>
          </span>
        </div>

        {/* Center: Global Status Pill (Green 3D Pill - crisp, guaranteed horizontal pill) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#86EFAC] shadow-inner text-xs font-black text-[#15803D] whitespace-nowrap shrink-0 min-w-max">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping shrink-0" />
          <span className="font-mono-code whitespace-nowrap">Argon Engine Active | 1M Context Self-Healing Loop Locked</span>
        </div>

        {/* Zone 3: Navigation & Controls */}
        <div className="flex items-center gap-2 shrink-0 min-w-max">
          {/* Navigation Pill Tabs */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-[#FAF9F5] rounded-2xl border border-[#FEF08A]/80 shadow-inner shrink-0">
            <button
              onClick={() => onSelectTab('director')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'director'
                  ? 'bg-gradient-to-b from-[#FEF08A] to-[#FDE047] text-[#291505] shadow-[0_3px_8px_rgba(245,158,11,0.2),inset_0_1px_2px_rgba(255,255,255,0.9)] scale-[1.02]'
                  : 'text-[#78350F] hover:text-[#291505] hover:bg-white/80'
              }`}
            >
              <Clapperboard className="w-3.5 h-3.5 text-[#B45309]" />
              <span>감독 스튜디오</span>
            </button>

            <button
              onClick={() => onSelectTab('audit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'audit'
                  ? 'bg-gradient-to-b from-[#FEF08A] to-[#FDE047] text-[#291505] shadow-[0_3px_8px_rgba(245,158,11,0.2),inset_0_1px_2px_rgba(255,255,255,0.9)] scale-[1.02]'
                  : 'text-[#78350F] hover:text-[#291505] hover:bg-white/80'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Argon 검증실 (15/15)</span>
            </button>
          </div>

          {/* Audio Control: [🔊 Ambient Foley Soundscape: ON / OFF] */}
          <button
            onClick={onToggleAmbience}
            aria-label={isAmbiencePlaying && !isMuted ? 'Mute ambient soundscape' : 'Play ambient rain and piano'}
            className={`clay-btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-2xl border transition-all whitespace-nowrap shrink-0 ${
              isAmbiencePlaying && !isMuted
                ? 'bg-gradient-to-b from-[#FEF08A] to-[#FDE047] text-[#291505] border-[#FACC15]'
                : 'bg-white text-[#78350F] border-[#FEF08A] hover:bg-[#FFFBEB]'
            }`}
            title="Web Audio API Procedural Piano & Rain Foley"
          >
            {isAmbiencePlaying && !isMuted ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#B45309] animate-bounce shrink-0" />
                <span className="font-sans">🔊 Foley: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#78350F] shrink-0" />
                <span className="font-sans">Foley: OFF</span>
              </>
            )}
          </button>

          {/* Quick Cinema Launch Button */}
          <button
            onClick={onOpenCinemaPlayer}
            className="clay-btn flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold text-[#291505] bg-gradient-to-b from-[#FEF08A] to-[#FDE047] border border-[#FACC15] rounded-2xl shadow-[0_6px_14px_-2px_rgba(245,158,11,0.28),inset_0_2px_4px_rgba(255,255,255,0.9)] whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-[#291505] shrink-0" />
            <span className="hidden sm:inline">Criterion 극장 상영</span>
            <span className="sm:hidden">상영</span>
          </button>
        </div>
      </div>
    </header>
  );
};
