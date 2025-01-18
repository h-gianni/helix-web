// hooks/use-animation.ts
import { useState, useEffect } from 'react';

// These are the possible states during an animation
type AnimationState = 'entering' | 'entered' | 'exiting' | 'exited';

// These are the options our hook will accept
interface UseAnimationProps {
  isOpen: boolean;        // Whether the component should be shown
  duration?: number;      // How long the animation takes
  onExited?: () => void; // Function to call when animation ends
}

// This is our hook function
export function useAnimation({ 
  isOpen, 
  duration = 250,  // Default duration
  onExited 
}: UseAnimationProps) {
  // Track the current animation state
  const [state, setState] = useState<AnimationState>(
    isOpen ? 'entered' : 'exited'
  );

  // This effect runs when isOpen changes
  useEffect(() => {
    // When opening
    if (isOpen && state === 'exited') {
      setState('entering');
      // After duration, set to entered
      const timer = setTimeout(() => setState('entered'), duration);
      return () => clearTimeout(timer);
    }
    
    // When closing
    if (!isOpen && state === 'entered') {
      setState('exiting');
      // After duration, set to exited and call onExited
      const timer = setTimeout(() => {
        setState('exited');
        onExited?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, state, onExited]);

  // Return useful values for the component
  return {
    isAnimating: state === 'entering' || state === 'exiting',
    shouldMount: state !== 'exited',
    animationState: state,
  };
}