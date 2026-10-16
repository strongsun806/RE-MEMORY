/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Zap, Film, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

interface BottomFloatingDockProps {
  onLaunchCinema: () => void;
  onRunDemoScenario: () => void;
  isAmbiencePlaying: boolean;
  storyTitle: string;
}

export const BottomFloatingDock: React.FC<BottomFloatingDockProps> = ({
  onLaunchCinema,
  onRunDemoScenario,
  isAmbiencePlaying,
  storyTitle,
}) => {
  return (
    <aside aria-label="Quick action toolbar" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] w-auto">
      {/* Apple Dynamic Island Style Floating 3D Dock */}
      <div className="clay-floating-dock px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2.5 sm:gap-4 border-2 border-[#FEF08A] shadow-[0_20px_45px_-10px_rgba(41,21,5,0.22),inset_0_2px_4px_rgba(255,255,255,0.95)]">
        {/* Left Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 pr-3 border-r border-[#FEF08A]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping" />
          <span className="text-xs font-black text-[#291505] font-serif-kr truncate max-w-[170px]" title={storyTitle}>
            {storyTitle}
          </span>
        </div>

        {/* Action 1: One-Click Pitching Trigger [⚡ Run Full Demo Scenario] */}
        <button
          type="button"
          onClick={onRunDemoScenario}
          className="clay-btn flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-black text-[#291505] bg-gradient-to-r from-[#FEF08A] via-[#FDE047] to-[#FACC15] hover:brightness-105 active:scale-95 rounded-full border border-[#EAB308] shadow-[0_6px_16px_rgba(245,158,11,0.35)] whitespace-nowrap transition-all"
          title="심사위원 5분 피칭 & 1분 녹화용: 빗소리 사운드스케이프와 4막 시네마 자동 재생"
        >
          <Zap className="w-4 h-4 fill-[#B45309] text-[#B45309] animate-bounce" />
          <span>⚡ Run Full Demo Scenario</span>
        </button>

        {/* Action 2: [▶ Launch Criterion Cinema Player] */}
        <button
          type="button"
          onClick={onLaunchCinema}
          className="clay-btn flex items-center gap-2 px-4 sm:px-5 py-2 text-xs sm:text-sm font-black text-white bg-gradient-to-b from-[#F59E0B] to-[#D97706] hover:brightness-105 active:scale-95 rounded-full border border-[#B45309] shadow-[0_8px_20px_rgba(217,119,6,0.4)] whitespace-nowrap transition-all"
          title="Criterion Collection 감성의 와이드스크린 시네마 플레이어 전체화면 실행"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>▶ Launch Criterion Cinema Player</span>
        </button>
      </div>
    </aside>
  );
};
