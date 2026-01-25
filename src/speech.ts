import type { Emotion, VoiceStyle } from './types';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function speak(text: string, emotion: Emotion, intensity: number, voice: VoiceStyle) {
  if (!('speechSynthesis' in window)) {
    alert('Speech Synthesis is not supported in this browser.');
    return;
  }
  window.speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  const i = clamp(intensity, 1, 5);

  // Demo mapping: emotion & intensity → rate/pitch/volume
  const baseRate = 1.0;
  const basePitch = 1.0;
  const baseVolume = 1.0;

  const emotionAdjust = (() => {
    switch (emotion) {
      case 'Calm': return { rate: -0.08, pitch: -0.03, volume: -0.05 };
      case 'Supportive': return { rate: -0.03, pitch: +0.08, volume: 0.0 };
      case 'Angry': return { rate: +0.05, pitch: -0.10, volume: +0.10 };
      case 'Critical': return { rate: +0.02, pitch: -0.15, volume: +0.05 };
      case 'Anxious': return { rate: +0.10, pitch: +0.12, volume: -0.02 };
      default: return { rate: 0, pitch: 0, volume: 0 };
    }
  })();

  const voiceAdjust = (() => {
    switch (voice) {
      case 'Warm': return { pitch: +0.10, rate: -0.03 };
      case 'Firm': return { pitch: -0.05, rate: +0.02 };
      case 'Soft': return { pitch: +0.05, rate: -0.05 };
      case 'Harsh': return { pitch: -0.15, rate: +0.04 };
      default: return { pitch: 0, rate: 0 };
    }
  })();

  const intensityAdjust = {
    rate: (i - 3) * 0.04,
    pitch: (i - 3) * 0.05,
    volume: (i - 3) * 0.06,
  };

  u.rate = clamp(baseRate + emotionAdjust.rate + voiceAdjust.rate + intensityAdjust.rate, 0.7, 1.3);
  u.pitch = clamp(basePitch + emotionAdjust.pitch + voiceAdjust.pitch + intensityAdjust.pitch, 0.6, 1.4);
  u.volume = clamp(baseVolume + emotionAdjust.volume + intensityAdjust.volume, 0.2, 1.0);

  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
