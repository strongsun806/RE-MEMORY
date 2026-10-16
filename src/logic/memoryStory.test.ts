/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateStorySchema,
  calculateContinuityIntegrity,
  applySelfHealingPatch,
  extractNarrativeKeywords,
  MASTERPIECE_STORIES,
  synthesizeStoryFromMemory
} from './memoryStory.ts';
import type { StoryboardPanel, SelfHealingPatch } from './memoryStory.ts';

test('validateStorySchema verifies complete valid memory stories', () => {
  const masterStory = MASTERPIECE_STORIES[0];
  assert.equal(validateStorySchema(masterStory), true);
});

test('validateStorySchema rejects invalid or truncated story structures', () => {
  assert.equal(validateStorySchema(null), false);
  assert.equal(validateStorySchema({}), false);
  assert.equal(validateStorySchema({ title: 'Sample', panels: [] }), false);
  assert.equal(validateStorySchema({
    title: 'Sample',
    synopsis: 'Short',
    characterSheet: {},
    panels: [
      { panelNumber: 1, narrationKr: 'A', imagePrompt: 'Prompt A' },
      { panelNumber: 2, narrationKr: 'B', imagePrompt: 'Prompt B' }
    ] // Only 2 panels, requires 4
  }), false);
});

test('calculateContinuityIntegrity computes correct average confidence score', () => {
  const checks = [
    { id: '1', title: 'Era', status: 'PASSED' as const, detail: '', confidenceScore: 99.0 },
    { id: '2', title: 'Props', status: 'PASSED' as const, detail: '', confidenceScore: 98.0 },
    { id: '3', title: 'Lighting', status: 'PASSED' as const, detail: '', confidenceScore: 97.0 }
  ];
  const avg = calculateContinuityIntegrity(checks);
  assert.equal(avg, 98.0);
});

test('applySelfHealingPatch repairs prompt discrepancies in the target panel', () => {
  const originalPanel: StoryboardPanel = {
    panelNumber: 3,
    title: 'Test Panel',
    narrationKr: '테스트',
    narrationEn: 'Test',
    dialogueKr: '대화',
    cameraDirection: 'Shot',
    foleyCue: 'Sound',
    moodTone: 'sacrificial',
    imagePrompt: 'mother holding umbrella with clean dry trench coat',
    imageUrl: '',
    continuityBadge: 'Pending'
  };

  const patch: SelfHealingPatch = {
    panelTarget: 3,
    detectedAnomaly: 'Coat dry anomaly',
    initialPromptSnippet: 'clean dry trench coat',
    patchedPromptSnippet: 'drenched wet left shoulder fabric',
    healingRationale: 'Restored wet shoulder detail'
  };

  const repaired = applySelfHealingPatch(originalPanel, patch);
  assert.equal(repaired.imagePrompt.includes('drenched wet left shoulder fabric'), true);
  assert.equal(repaired.continuityBadge.includes('Self-Healed'), true);
});

test('applySelfHealingPatch leaves non-target panels untouched', () => {
  const panel2: StoryboardPanel = {
    panelNumber: 2,
    title: 'Panel 2',
    narrationKr: '',
    narrationEn: '',
    dialogueKr: '',
    cameraDirection: '',
    foleyCue: '',
    moodTone: 'tender',
    imagePrompt: 'Original prompt 2',
    imageUrl: '',
    continuityBadge: 'Original badge'
  };

  const patch: SelfHealingPatch = {
    panelTarget: 3,
    detectedAnomaly: 'Anomaly in 3',
    initialPromptSnippet: 'xyz',
    patchedPromptSnippet: 'abc',
    healingRationale: 'Only for 3'
  };

  const unchanged = applySelfHealingPatch(panel2, patch);
  assert.deepEqual(unchanged, panel2);
});

test('extractNarrativeKeywords extracts era, key objects, and emotional tone', () => {
  const sample1 = '1994년 여름 비 내리던 여의도역 앞 노란 우산과 어머니...';
  const extracted1 = extractNarrativeKeywords(sample1);
  assert.equal(extracted1.inferredEra, '1994');
  assert.equal(extracted1.props.includes('노란 우산'), true);

  const sample2 = '1998년 겨울 새벽 출근길 낡은 구두를 닦으시던 아버지의 손';
  const extracted2 = extractNarrativeKeywords(sample2);
  assert.equal(extracted2.inferredEra, '1998');
  assert.equal(extracted2.props.includes('낡은 가죽 구두'), true);
});

test('MASTERPIECE_STORIES contains 4 fully valid stories with real image URLs', () => {
  assert.equal(MASTERPIECE_STORIES.length, 4);
  for (const story of MASTERPIECE_STORIES) {
    assert.equal(validateStorySchema(story), true);
    assert.equal(story.panels.length, 4);
    for (const panel of story.panels) {
      assert.equal(panel.imageUrl.startsWith('/src/assets/images/'), true);
      assert.equal(panel.imageUrl.endsWith('.jpg'), true);
    }
  }
});

test('synthesizeStoryFromMemory guarantees valid 4-panel stories with image assets for any input', () => {
  const namsanStory = synthesizeStoryFromMemory('1988년 남산타워 핫도그');
  assert.equal(validateStorySchema(namsanStory), true);
  assert.equal(namsanStory.panels.every((p) => p.imageUrl.startsWith('/src/assets/images/')), true);

  const shoesStory = synthesizeStoryFromMemory('1998년 아버지의 구두와 캔커피');
  assert.equal(validateStorySchema(shoesStory), true);
  assert.equal(shoesStory.panels.every((p) => p.imageUrl.startsWith('/src/assets/images/')), true);

  const boriStory = synthesizeStoryFromMemory('반려견 골든 리트리버 보리와의 산책');
  assert.equal(validateStorySchema(boriStory), true);
  assert.equal(boriStory.panels.every((p) => p.imageUrl.startsWith('/src/assets/images/')), true);

  const customStory = synthesizeStoryFromMemory('시골 외할머니 댁 평상에서 먹던 시원한 수박');
  assert.equal(validateStorySchema(customStory), true);
  assert.equal(customStory.panels.every((p) => p.imageUrl.startsWith('/src/assets/images/')), true);
});

