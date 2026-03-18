export type Emotion =
  | 'Neutral'
  | 'Calm'
  | 'Supportive'
  | 'Angry'
  | 'Critical'
  | 'Anxious';

export type VoiceStyle =
  | 'Default'
  | 'Warm'
  | 'Firm'
  | 'Soft'
  | 'Harsh';

export type Scene = {
  id: string;
  title: string;
  line: string;
  emotion: Emotion;
  intensity: number;
  voice: VoiceStyle;
  createdAt: number;
  updatedAt: number;

  // optional (используются в SceneDetail)
  avatarDescription?: string;
  avatarImageDataUrl?: string;

  reflection?: {
    feelings?: string;
    thoughts?: string;
    body?: string;
    nextStep?: string;
  };
};
