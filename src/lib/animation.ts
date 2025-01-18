// lib/animation.ts
export type AnimationState = 'entering' | 'entered' | 'exiting' | 'exited';

export const ANIMATION_DURATION = {
  instant: 50,
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

export type AnimationDuration = keyof typeof ANIMATION_DURATION;