import { useState, useEffect, useRef, useCallback } from "react";

interface UseTypewriterOptions {
  speed?: number; // milliseconds per character
  onComplete?: () => void;
}

interface UseTypewriterReturn {
  displayedText: string;
  isTyping: boolean;
  isComplete: boolean;
  skip: () => void;
}

export function useTypewriter(
  text: string,
  enabled: boolean = true,
  options: UseTypewriterOptions = {}
): UseTypewriterReturn {
  const { speed = 15, onComplete } = options;
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const skip = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayedText(text);
    setIsTyping(false);
    setIsComplete(true);
    onComplete?.();
  }, [text, onComplete]);

  useEffect(() => {
    // Reset when text changes
    if (!enabled || !text) {
      setDisplayedText(text);
      setIsTyping(false);
      setIsComplete(true);
      return;
    }

    // Start fresh for new text
    indexRef.current = 0;
    setDisplayedText("");
    setIsTyping(true);
    setIsComplete(false);

    intervalRef.current = setInterval(() => {
      indexRef.current++;

      if (indexRef.current >= text.length) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplayedText(text);
        setIsTyping(false);
        setIsComplete(true);
        onComplete?.();
      } else {
        setDisplayedText(text.slice(0, indexRef.current));
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, enabled, speed, onComplete]);

  return {
    displayedText,
    isTyping,
    isComplete,
    skip,
  };
}
