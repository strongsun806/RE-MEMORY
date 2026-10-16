/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, BookOpen, Clock, Heart, RotateCcw, CheckCircle } from 'lucide-react';
import { MASTERPIECE_STORIES, MemoryFilmStory } from '../logic/memoryStory.ts';

interface VoiceInputDrawerProps {
  currentStory: MemoryFilmStory;
  onSelectStory: (story: MemoryFilmStory) => void;
  onGenerateFromMemory: (transcript: string) => Promise<void>;
  isGenerating: boolean;
}

export const VoiceInputDrawer: React.FC<VoiceInputDrawerProps> = ({
  currentStory,
  onSelectStory,
  onGenerateFromMemory,
  isGenerating,
}) => {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ko-KR';

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition event:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition init failed:', e);
      setSpeechSupported(false);
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleQuickPrompt = (sampleText: string) => {
    setTranscript(sampleText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim() || isGenerating) return;
    await onGenerateFromMemory(transcript.trim());
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6">
      {/* 3D Soft Clay Card: Spoken Memory Input Hub */}
      <div className="clay-card p-6 flex flex-col gap-4 border-2 border-[#FEF08A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#F59E0B] shadow-[0_2px_6px_rgba(245,158,11,0.5)] animate-pulse" />
            <h2 className="text-sm font-extrabold tracking-wide text-[#451A03] font-serif-kr">
              기억 녹음 & Argon 컨트롤러 (Memory Hub)
            </h2>
          </div>
          <span className="text-xs font-bold text-[#B45309] bg-[#FEF3C7] px-2.5 py-1 rounded-full border border-[#FDE047] shadow-sm">
            🎙 실시간 음성 & 텍스트
          </span>
        </div>

        <p className="text-xs text-[#78350F] leading-relaxed font-batang">
          어르신의 따뜻한 구술 기억이나 잊혀진 옛 시절의 파편을 말씀해 주세요. Gemini 4 Argon이 인물 일관성을 영구 잠금하고 4막의 고화질 시네마로 복원합니다.
        </p>

        {/* 3D Fluffy Pastel Microphone & Soundwave Cassette */}
        <div className="clay-inset p-4 flex items-center gap-4 bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] border border-[#FDE047]">
          <button
            type="button"
            onClick={toggleListening}
            disabled={!speechSupported || isGenerating}
            className={`flex items-center justify-center w-14 h-14 rounded-3xl transition-all duration-300 shrink-0 ${
              isListening
                ? 'bg-gradient-to-b from-[#EF4444] to-[#DC2626] text-white shadow-[0_8px_20px_rgba(239,68,68,0.4),inset_0_2px_4px_rgba(255,255,255,0.7)] scale-105 animate-pulse'
                : 'clay-btn bg-gradient-to-b from-[#FEF08A] to-[#FDE047] text-[#451A03] border-2 border-[#FACC15] hover:scale-105 active:scale-95'
            }`}
            title={speechSupported ? '마이크 켜기 / 끄기' : '음성 인식을 지원하지 않는 브라우저입니다'}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#451A03] font-batang">
                {isListening ? '말씀하시는 기억을 듣고 있어요...' : '마이크를 눌러 음성으로 말씀하세요'}
              </span>
              {isListening && (
                <span className="text-[11px] font-extrabold text-[#DC2626] bg-red-100 px-2 py-0.5 rounded-full animate-bounce">
                  ● REC LIVE
                </span>
              )}
            </div>

            {/* 3D Butter & Caramel Soundwave Visualizer Bars */}
            <div className="flex items-center gap-1 h-5 px-1 bg-white/70 rounded-xl border border-[#FEF08A]/60">
              {[40, 75, 30, 95, 60, 25, 85, 50, 100, 45, 70, 90, 35, 80, 55, 95, 65, 40].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isListening ? 'bg-[#F59E0B]' : 'bg-[#E5D5B8]'
                  }`}
                  style={{
                    height: isListening ? `${Math.max(25, Math.round(h * Math.random()))}%` : '25%',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 3D Clay Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="예: 1994년 비가 억수같이 내리던 날, 어머니가 노란 우산을 들고 여의도역 앞 버스정류장에 마중 나오셨던 기억..."
              rows={3}
              className="w-full px-4 py-3 text-xs md:text-sm bg-[#FFFDF0] text-[#291505] border-2 border-[#FEF08A] rounded-2xl focus:outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#FEF08A]/40 placeholder-[#A8A29E] leading-relaxed resize-none font-batang shadow-inner"
            />
          </div>

          {/* Quick Emotive Snippet Chips */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickPrompt('1988년 올림픽이 열리던 해 가을, 아버지 손잡고 남산타워에 올라가 사 먹었던 핫도그')}
              className="clay-btn text-xs px-3 py-1.5 bg-[#FFFBEB] hover:bg-[#FEF08A] text-[#78350F] font-bold rounded-xl border border-[#FEF08A] transition-colors"
            >
              # 1988년 남산타워 핫도그
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('비 오는 날 새벽 첫 출근길, 현관에서 몰래 내 구두를 닦아놓으신 아버지의 거친 손')}
              className="clay-btn text-xs px-3 py-1.5 bg-[#FFFBEB] hover:bg-[#FEF08A] text-[#78350F] font-bold rounded-xl border border-[#FEF08A] transition-colors"
            >
              # 아버지의 새벽 구두약
            </button>
          </div>

          {/* Primary 3D Squishy Button */}
          <button
            type="submit"
            disabled={!transcript.trim() || isGenerating}
            className={`clay-btn flex items-center justify-center gap-2.5 w-full py-3.5 text-xs sm:text-sm font-extrabold rounded-2xl text-[#451A03] transition-all ${
              !transcript.trim() || isGenerating
                ? 'bg-[#E5E0D8] text-[#A8A29E] cursor-not-allowed border border-[#D6CEBE]'
                : 'bg-gradient-to-r from-[#FEF08A] via-[#FDE047] to-[#FACC15] hover:brightness-105 active:scale-[0.98] border-2 border-[#EAB308] shadow-[0_10px_25px_-5px_rgba(245,158,11,0.35),inset_0_3px_5px_rgba(255,255,255,0.9)]'
            }`}
          >
            {isGenerating ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin text-[#B45309]" />
                <span className="font-serif-kr">Argon 연속성 검증 엔진 작동 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#B45309]" />
                <span className="font-serif-kr">Gemini Argon으로 실시간 필름 복원하기</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 3D Soft Clay Card: 3 Exhibition Masterpieces */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#B45309]" />
            <h3 className="text-sm font-extrabold text-[#451A03] font-serif-kr">
              엄선된 3대 복원작 (Instant Zero-Wait)
            </h3>
          </div>
          <span className="text-xs font-bold text-[#92400E]">클릭 즉시 관람</span>
        </div>

        <div className="flex flex-col gap-3">
          {MASTERPIECE_STORIES.map((story, idx) => {
            const isSelected = currentStory.id === story.id;
            return (
              <div
                key={story.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectStory(story)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStory(story);
                  }
                }}
                className={`clay-btn p-4 rounded-3xl text-left cursor-pointer transition-all border-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FEFCE8] to-[#FFFBEB] border-[#F59E0B] shadow-[0_12px_24px_-6px_rgba(245,158,11,0.3),inset_0_2px_4px_rgba(255,255,255,0.95)] ring-2 ring-[#FEF08A]'
                    : 'clay-card border-[#FEF08A]/60 hover:border-[#FDE047]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#B45309] bg-[#FEF08A] px-2.5 py-0.5 rounded-full border border-[#FDE047]">
                      작품 0{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-[#78350F] font-mono-code">
                      {story.eraYear}년작
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-[#059669] bg-[#D1FAE5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0] flex items-center gap-1 shadow-sm">
                    <CheckCircle className="w-3 h-3 fill-current" />
                    15/15 Passed ({story.overallContinuityScore}%)
                  </span>
                </div>

                <h4 className="text-sm md:text-base font-extrabold text-[#291505] font-serif-kr line-clamp-1 mb-1">
                  {story.title}
                </h4>

                <p className="text-xs text-[#78350F] line-clamp-2 leading-relaxed font-batang mb-2.5">
                  {story.synopsis}
                </p>

                <div className="flex items-center justify-between text-xs text-[#92400E] border-t border-[#FEF08A]/80 pt-2 font-medium">
                  <span className="truncate max-w-[200px]">
                    주인공: {story.characterSheet.protagonistName}
                  </span>
                  <span className="font-extrabold text-[#D97706] hover:underline">
                    {isSelected ? '★ 현재 상영 중' : '작품 열기 →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
