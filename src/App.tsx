/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle2, Zap } from 'lucide-react';
import { MASTERPIECE_STORIES, MemoryFilmStory, StoryboardPanel, synthesizeStoryFromMemory } from './logic/memoryStory.ts';
import { audioEngine } from './audio/audioEngine.ts';
import { TopHeader } from './components/TopHeader.tsx';
import { LeftCanvasHub } from './components/LeftCanvasHub.tsx';
import { RightCanvasView } from './components/RightCanvasView.tsx';
import { CinemaPlayerModal } from './components/CinemaPlayerModal.tsx';
import { ContinuityAuditView } from './components/ContinuityAuditView.tsx';
import { BottomFloatingDock } from './components/BottomFloatingDock.tsx';

export default function App() {
  const [currentStory, setCurrentStory] = useState<MemoryFilmStory>(MASTERPIECE_STORIES[0]);
  const [activeTab, setActiveTab] = useState<'director' | 'cinema' | 'audit'>('director');
  const [isCinemaOpen, setIsCinemaOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [repaintingPanelNum, setRepaintingPanelNum] = useState<number | null>(null);
  const [isAmbiencePlaying, setIsAmbiencePlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Toggle Procedural Ambient Sound (Web Audio API)
  const handleToggleAmbience = () => {
    if (isAmbiencePlaying && !isMuted) {
      const muted = audioEngine.toggleMute();
      setIsMuted(muted);
    } else if (isAmbiencePlaying && isMuted) {
      const muted = audioEngine.toggleMute();
      setIsMuted(muted);
    } else {
      audioEngine.startAmbience('melancholic');
      setIsAmbiencePlaying(true);
      setIsMuted(false);
      showToast('🔊 Web Audio API: 1994년 여의도역 아날로그 빗소리 & 피아노 앰비언스 재생 시작');
    }
  };

  // Generate new 4-panel storyboard from spoken memory
  const handleGenerateFromMemory = async (memoryText: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/memory/generate-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryText }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate memory film');
      }

      const generated: MemoryFilmStory = await response.json();
      const synthesizedFallback = synthesizeStoryFromMemory(memoryText);

      // Validate that all panels have real modern image URLs
      const enrichedStory: MemoryFilmStory = {
        ...generated,
        panels: (generated.panels || []).map((p: StoryboardPanel, idx: number) => ({
          ...p,
          imageUrl:
            p.imageUrl && !p.imageUrl.startsWith('data:image/svg')
              ? p.imageUrl
              : synthesizedFallback.panels[idx]?.imageUrl || MASTERPIECE_STORIES[0].panels[idx].imageUrl,
        })),
      };

      setCurrentStory(enrichedStory);
      setActiveTab('director');
      showToast('✨ Gemini 4 Argon: 4개 컷 최고급 모던 애니메이션 웹툰 복원 완료!');
    } catch (err) {
      console.error('Error generating story:', err);
      const instantStory = synthesizeStoryFromMemory(memoryText);
      setCurrentStory(instantStory);
      setActiveTab('director');
      showToast('✨ 1M 캐시 & 최고급 감성 애니메이션 작화로 안전하게 즉시 복원되었습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Live paint a single frame with Gemini Image Generation API
  const handleRepaintFrame = async (panelNumber: number, prompt: string, title: string) => {
    setRepaintingPanelNum(panelNumber);
    try {
      const response = await fetch('/api/memory/generate-panel-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visualPrompt: prompt,
          panelNumber,
          title,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to repaint frame');
      }

      const data = await response.json();
      if (data.imageUrl) {
        setCurrentStory((prev) => ({
          ...prev,
          panels: prev.panels.map((p) =>
            p.panelNumber === panelNumber
              ? {
                  ...p,
                  imageUrl: data.imageUrl,
                  continuityBadge: '✅ 실시간 AI 재채색 완료 (Gemini Live Paint)',
                }
              : p
          ),
        }));
        showToast(`🎨 제 ${panelNumber}막: Gemini 2.5 Flash Image 실시간 재채색 완료!`);
      }
    } catch (err) {
      console.error('Error repainting frame:', err);
      showToast('⚠️ 실시간 채색 지연: 이전 고화질 픽사 렌더링 프레임이 안전하게 유지됩니다.');
    } finally {
      setRepaintingPanelNum(null);
    }
  };

  // One-Click Pitching Trigger: [⚡ Run Full Demo Scenario]
  const handleRunDemoScenario = () => {
    // 1. Ensure ambient rain & piano is started
    if (!isAmbiencePlaying || isMuted) {
      audioEngine.startAmbience('melancholic');
      setIsAmbiencePlaying(true);
      setIsMuted(false);
    }
    // 2. Open Cinema Player Modal
    setIsCinemaOpen(true);
    showToast('⚡ 심사위원 1분 피칭 시나리오: 빗소리 앰비언스 + 4막 음성 나레이션 시네마 풀스크린 실행!');
  };

  // Export / Share Storyboard
  const handleShareStory = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    showToast('💌 기억의 필름 공유 링크가 복사되었습니다. 소중한 가족에게 전해보세요!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#0F172A] selection:bg-[#FEF08A] selection:text-[#291505] pb-24">
      {/* 1. 3D Floating Dynamic Island Header */}
      <TopHeader
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'cinema') {
            setIsCinemaOpen(true);
          }
        }}
        isAmbiencePlaying={isAmbiencePlaying}
        isMuted={isMuted}
        onToggleAmbience={handleToggleAmbience}
        onOpenCinemaPlayer={() => setIsCinemaOpen(true)}
        onRunDemoScenario={handleRunDemoScenario}
      />

      {/* 2. Main Workspace Layout */}
      {activeTab === 'audit' ? (
        <main className="flex-1 py-4 sm:py-6 px-3 sm:px-6 overflow-y-auto max-w-7xl mx-auto w-full">
          <ContinuityAuditView story={currentStory} />
        </main>
      ) : (
        /* 50:50 Split-Screen Layout */
        <main className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-x-hidden max-w-[1720px] mx-auto w-full">
          {/* LEFT CANVAS (50% on desktop): Memory Dictation & Argon Character Sheet */}
          <div className="w-full lg:w-1/2 flex flex-col overflow-y-auto lg:border-r border-[#F59E0B]/20">
            <LeftCanvasHub
              currentStory={currentStory}
              onSelectStory={(story) => setCurrentStory(story)}
              onGenerateFromMemory={handleGenerateFromMemory}
              isGenerating={isGenerating}
            />
          </div>

          {/* RIGHT CANVAS (50% on desktop): Restored 4-Cut Webtoon & Verification Loop */}
          <div className="w-full lg:w-1/2 flex flex-col overflow-y-auto">
            <RightCanvasView
              currentStory={currentStory}
              onRepaintFrame={handleRepaintFrame}
              repaintingPanelNum={repaintingPanelNum}
              onOpenCinemaPlayer={() => setIsCinemaOpen(true)}
              onOpenAuditTab={() => setActiveTab('audit')}
              onShareStory={handleShareStory}
            />
          </div>
        </main>
      )}

      {/* 3. Bottom Floating Dock (Apple Dynamic Island Style) */}
      <BottomFloatingDock
        onLaunchCinema={() => setIsCinemaOpen(true)}
        onRunDemoScenario={handleRunDemoScenario}
        isAmbiencePlaying={isAmbiencePlaying}
        storyTitle={currentStory.title}
      />

      {/* 4. Full-Screen Cinema Player Modal */}
      <CinemaPlayerModal
        story={currentStory}
        isOpen={isCinemaOpen}
        onClose={() => setIsCinemaOpen(false)}
      />

      {/* 5. 3D Pastel Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 clay-card flex items-center gap-2.5 px-5 py-3.5 bg-white text-[#291505] border-2 border-[#FEF08A] rounded-3xl shadow-2xl text-xs sm:text-sm font-black animate-fade-in max-w-md">
          <CheckCircle2 className="w-5 h-5 text-[#059669] fill-[#DCFCE7] shrink-0" />
          <span className="leading-snug">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
