import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAIVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTextRef = useRef<string>('');

  const speak = useCallback(async (text: string) => {
    // Stop any current speech
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Don't repeat the same text immediately
    if (currentTextRef.current === text && isSpeaking) {
      return;
    }

    currentTextRef.current = text;
    setIsSpeaking(true);

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text }
      });

      if (error) throw error;

      if (data?.audioContent) {
        // Convert base64 to audio and play
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          currentTextRef.current = '';
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          currentTextRef.current = '';
        };

        await audio.play();
      }
    } catch (error) {
      console.error('AI Voice error:', error);
      setIsSpeaking(false);
      currentTextRef.current = '';
    }
  }, [isSpeaking]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
    currentTextRef.current = '';
  }, []);

  return {
    isSpeaking,
    speak,
    stopSpeaking,
  };
}
