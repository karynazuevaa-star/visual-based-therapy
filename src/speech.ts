let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(
  text: string,
  emotion?: string,
  intensity?: number,
  voiceStyle?: string
) {
  if (!text.trim()) return;
  if (!('speechSynthesis' in window)) {
    alert('Speech synthesis is not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  currentUtterance = utterance;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    utterance.voice = voices[0];
  }

  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  if (emotion === 'Calm' || voiceStyle === 'Soft') {
    utterance.rate = 0.9;
    utterance.pitch = 0.95;
  }

  if (emotion === 'Supportive' || voiceStyle === 'Warm') {
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
  }

  if (emotion === 'Critical' || emotion === 'Angry' || voiceStyle === 'Harsh') {
    utterance.rate = 1.02;
    utterance.pitch = 0.9;
  }

  if (voiceStyle === 'Firm') {
    utterance.rate = 0.98;
    utterance.pitch = 0.92;
  }

  if (typeof intensity === 'number') {
    const normalized = Math.max(1, Math.min(10, intensity));
    utterance.rate = Math.max(0.7, Math.min(1.3, utterance.rate + (normalized - 5) * 0.03));
    utterance.volume = Math.max(0.6, Math.min(1, 0.75 + normalized * 0.025));
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}
