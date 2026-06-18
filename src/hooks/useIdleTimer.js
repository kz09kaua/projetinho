import { useEffect, useRef } from "react";

export const useIdleTimer = (timeoutMinutes = 30, onIdle) => {
  const timerRef = useRef();

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(onIdle, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((ev) => window.addEventListener(ev, resetTimer));
    resetTimer();

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
      clearTimeout(timerRef.current);
    };
  }, [timeoutMinutes, onIdle]);
};
