/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, X, Volume2, VolumeX, Film, Palette } from 'lucide-react';
import { MemoryFilmStory, StoryboardPanel } from '../logic/memoryStory.ts';
import { RainCanvasOverlay } from './RainCanvasOverlay.tsx';
import { audioEngine } from '../audio/audioEngine.ts';
import { CINEMATIC_FILTERS, CinematicFilter } from './StoryboardPanelCard.tsx';

interface CinemaPlayerModalProps {
  story: MemoryFilmStory;
  isOpen: boolean;
  onClose: () => void;
}

export const CinemaPlayerModal: React.FC<CinemaPlayerModalProps> = ({
  story,
  isOpen,
  onClose,
}) => {
  const [currentPanelIdx, setCurrentPanelIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(audioEngine.getIsMuted());
  const [cinemaFilter, setCinemaFilter] = useState<CinematicFilter>('ghibli');
  const autoAdvanceTimerRef = useRef<number | null>(null);

  const activePanel: StoryboardPanel = story.panels[currentPanelIdx] || story.panels[0];
  const activeFilterConfig = CINEMATIC_FILTERS[cinemaFilter];

  useEffect(() => {
    if (!isOpen) {
      audioEngine.stopAmbience();
      audioEngine.stopSpeech();
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      return;
    }

    audioEngine.startAmbience(activePanel.moodTone || 'melancholic');
    playCurrentScene(currentPanelIdx);

    return () => {
      audioEngine.stopAmbience();
      audioEngine.stopSpeech();
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, [isOpen]);

  const playCurrentScene = (idx: number) => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);

    const panel = story.panels[idx];
    if (!panel) return;

    audioEngine.setMood(panel.moodTone || 'melancholic');

    const spokenLine = panel.dialogueKr
      ? `${panel.dialogueKr}. ${panel.narrationKr}`
      : panel.narrationKr;

    audioEngine.speakNarration(spokenLine, 'ko-KR', () => {
      if (isPlaying) {
        autoAdvanceTimerRef.current = window.setTimeout(() => {
          if (idx < story.panels.length - 1) {
            setCurrentPanelIdx((prev) => prev + 1);
            playCurrentScene(idx + 1);
          } else {
            setIsPlaying(false);
          }
        }, 2200);
      }
    });
  };

  const handleNext = () => {
    if (currentPanelIdx < story.panels.length - 1) {
      const nextIdx = currentPanelIdx + 1;
      setCurrentPanelIdx(nextIdx);
      playCurrentScene(nextIdx);
    }
  };

  const handlePrev = () => {
    if (currentPanelIdx > 0) {
      const prevIdx = currentPanelIdx - 1;
      setCurrentPanelIdx(prevIdx);
      playCurrentScene(prevIdx);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioEngine.stopSpeech();
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    } else {
      setIsPlaying(true);
      playCurrentScene(currentPanelIdx);
    }
  };

  const handleToggleAudio = () => {
    const muted = audioEngine.toggleMute();
    setIsAudioMuted(muted);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="시네마틱 극장 상영 모드"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in p-3 sm:p-6"
    >
      {/* 3D Soft Clay Top Floating Header */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between px-6 py-3 bg-[#FFFDF0]/95 backdrop-blur-md rounded-3xl border-2 border-[#FEF08A] shadow-[0_8px_20px_rgba(0,0,0,0.3)] max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono-code text-[#B45309] font-black tracking-widest uppercase bg-[#FEF08A] px-2.5 py-1 rounded-full border border-[#FDE047]">
            3D CINEMA THEATRE
          </span>
          <span className="text-[#A8A29E]">·</span>
          <h2 className="text-sm font-serif-kr text-[#291505] font-extrabold truncate max-w-md">
            {story.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cinematic Filter Dropdown inside Cinema Player */}
          <div className="clay-btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-2xl bg-white text-[#291505] border border-[#FEF08A]">
            <Palette className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
            <select
              value={cinemaFilter}
              onChange={(e) => setCinemaFilter(e.target.value as CinematicFilter)}
              className="bg-transparent text-xs font-extrabold text-[#291505] focus:outline-none cursor-pointer"
              title="상영관 시네마틱 컬러 그레이딩 필터"
            >
              <option value="ghibli">Studio Ghibli Watercolor</option>
              <option value="pixar">Pixar 3D Clay</option>
              <option value="vintage">Vintage 1990s Film</option>
              <option value="original">Original Frame</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleToggleAudio}
            className="clay-btn p-2 rounded-2xl bg-white text-[#78350F] hover:bg-[#FEF08A] transition-colors border border-[#FEF08A]"
            title={isAudioMuted ? '음소거 해제' : '음소거'}
            aria-label="Toggle audio"
          >
            {isAudioMuted ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-[#D97706]" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="clay-btn p-2 rounded-2xl bg-white text-[#78350F] hover:bg-red-50 hover:text-red-600 transition-colors border border-[#FEF08A]"
            title="극장 모드 닫기"
            aria-label="Close cinema mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main 3D Framed Widescreen Cinema Viewport with Gentle Filter Transition */}
      <div
        className="clay-frame relative w-full max-w-5xl aspect-[16/9] overflow-hidden shadow-2xl border-4 transition-[border-color,box-shadow,background-color] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{
          borderColor: activeFilterConfig.borderColor,
          boxShadow: activeFilterConfig.frameBoxShadow,
          backgroundColor: activeFilterConfig.bgMatte,
        }}
      >
        {/* Animated Artwork Frame with Ken Burns Effect & Dynamic CSS Filter */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            key={activePanel.panelNumber}
            src={activePanel.imageUrl}
            alt={activePanel.title}
            style={{
              filter: activeFilterConfig.filterStyle,
              animation: 'kenburns 12s ease-out alternate infinite',
            }}
            className="w-full h-full object-cover transition-[filter] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          />

          {/* Ambient Mood Glow Overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-in-out"
            style={{ background: activeFilterConfig.glowOverlay }}
          />

          {/* Live Atmospheric Rain */}
          <RainCanvasOverlay density={40} speed={1.2} />

          {/* Vignette Scrim */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-transparent to-black/50" />
        </div>

        {/* 3D Pillowy Speech Bubble */}
        {activePanel.dialogueKr && (
          <div className="absolute top-6 left-6 right-6 z-20 flex justify-center pointer-events-none animate-fade-in">
            <div className="clay-card bg-[#FFFDF0] text-[#291505] px-6 py-3 rounded-full shadow-2xl border-2 border-[#FEF08A] font-batang text-sm sm:text-base font-extrabold tracking-tight">
              {activePanel.dialogueKr}
            </div>
          </div>
        )}

        {/* Lower Subtitle Banner */}
        <div className="absolute bottom-10 left-6 right-6 z-20 flex flex-col items-center text-center pointer-events-none">
          {/* Poetic Korean Narration */}
          <p className="text-base sm:text-lg md:text-xl font-black font-serif-kr text-[#FFFFFF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] max-w-3xl leading-relaxed tracking-wide">
            {activePanel.narrationKr}
          </p>

          {/* English Subtitle */}
          <p className="text-xs sm:text-sm font-sans text-[#FEF08A] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] italic mt-2 font-bold max-w-2xl">
            {activePanel.narrationEn}
          </p>
        </div>
      </div>

      {/* Bottom 3D Clay Playback Control Bar */}
      <div className="absolute bottom-4 left-0 right-0 z-40 flex flex-col items-center gap-3 px-6">
        {/* Panel Progress Indicator (1/4, 2/4, 3/4, 4/4) */}
        <div className="flex items-center gap-2">
          {story.panels.map((p, idx) => (
            <button
              key={p.panelNumber}
              type="button"
              onClick={() => {
                setCurrentPanelIdx(idx);
                playCurrentScene(idx);
              }}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentPanelIdx
                  ? 'w-12 bg-gradient-to-r from-[#FEF08A] to-[#FDE047] shadow-md border border-[#FACC15]'
                  : 'w-4 bg-white/40 hover:bg-white/70'
              }`}
              title={`제 ${idx + 1}막: ${p.title}`}
              aria-label={`Jump to panel ${idx + 1}`}
            />
          ))}
        </div>

        {/* 3D Squishy Clay Controls Row */}
        <div className="clay-card flex items-center gap-4 bg-[#FFFDF0]/95 backdrop-blur-md px-6 py-2.5 rounded-full border-2 border-[#FEF08A] shadow-xl">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPanelIdx === 0}
            className="clay-btn p-2 text-[#78350F] hover:text-[#291505] disabled:text-[#D6CEBE] transition-colors"
            title="이전 컷"
            aria-label="Previous panel"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleTogglePlay}
            className="clay-btn p-3.5 rounded-full bg-gradient-to-b from-[#F59E0B] to-[#D97706] text-white shadow-lg active:scale-95 transition-all border border-[#B45309]"
            title={isPlaying ? '일시정지' : '상영 재개'}
            aria-label={isPlaying ? 'Pause film' : 'Play film'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentPanelIdx === story.panels.length - 1}
            className="clay-btn p-2 text-[#78350F] hover:text-[#291505] disabled:text-[#D6CEBE] transition-colors"
            title="다음 컷"
            aria-label="Next panel"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono-code font-black text-[#92400E] ml-2 bg-[#FEF3C7] px-2.5 py-1 rounded-full border border-[#FDE047]">
            ACT {currentPanelIdx + 1} / {story.panels.length}
          </span>
        </div>
      </div>
    </div>
  );
};
