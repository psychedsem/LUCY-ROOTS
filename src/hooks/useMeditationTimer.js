import { useEffect, useState } from 'react';

const TICK_INTERVAL_MS = 250;

function normalizeDuration(value) {
  const duration = Math.round(Number(value));
  return Number.isFinite(duration) && duration > 0 ? duration : 1;
}

function useMeditationTimer({
  initialDurationSeconds = 300,
  onComplete,
} = {}) {
  const initialDuration = normalizeDuration(initialDurationSeconds);

  const [timer, setTimer] = useState(() => ({
    selectedDurationSeconds: initialDuration,
    remainingSeconds: initialDuration,
    status: 'idle',
    startedAt: null,
    deadline: null,
    completedTimer: null,
  }));

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimer((current) => {
        if (current.status !== 'running' || current.deadline === null) {
          return current;
        }

        const now = Date.now();
        const secondsLeft = Math.max(
          0,
          Math.ceil((current.deadline - now) / 1000),
        );

        if (secondsLeft <= 0) {
          return {
            ...current,
            remainingSeconds: 0,
            status: 'completed',
            deadline: null,
            completedTimer: {
              durationSeconds: current.selectedDurationSeconds,
              startedAt: current.startedAt,
              endedAt: now,
            },
          };
        }

        if (secondsLeft === current.remainingSeconds) {
          return current;
        }

        return {
          ...current,
          remainingSeconds: secondsLeft,
        };
      });
    }, TICK_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (timer.status === 'completed' && timer.completedTimer) {
      onComplete?.(timer.completedTimer);
    }
  }, [timer.status, timer.completedTimer, onComplete]);

  function start() {
    setTimer((current) => {
      if (current.status !== 'idle' && current.status !== 'completed') {
        return current;
      }

      const now = Date.now();

      return {
        ...current,
        remainingSeconds: current.selectedDurationSeconds,
        status: 'running',
        startedAt: now,
        deadline: now + current.selectedDurationSeconds * 1000,
        completedTimer: null,
      };
    });
  }

  function pause() {
    setTimer((current) => {
      if (current.status !== 'running') {
        return current;
      }

      const now = Date.now();
      const secondsLeft = Math.max(
        0,
        Math.ceil((current.deadline - now) / 1000),
      );

      if (secondsLeft <= 0) {
        return {
          ...current,
          remainingSeconds: 0,
          status: 'completed',
          deadline: null,
          completedTimer: {
            durationSeconds: current.selectedDurationSeconds,
            startedAt: current.startedAt,
            endedAt: now,
          },
        };
      }

      return {
        ...current,
        remainingSeconds: secondsLeft,
        status: 'paused',
        deadline: null,
      };
    });
  }

  function resume() {
    setTimer((current) => {
      if (current.status !== 'paused') {
        return current;
      }

      return {
        ...current,
        status: 'running',
        deadline: Date.now() + current.remainingSeconds * 1000,
      };
    });
  }

  function reset() {
    setTimer((current) => ({
      ...current,
      remainingSeconds: current.selectedDurationSeconds,
      status: 'idle',
      startedAt: null,
      deadline: null,
      completedTimer: null,
    }));
  }

  function setDurationSeconds(value) {
    setTimer((current) => {
      if (current.status === 'running' || current.status === 'paused') {
        return current;
      }

      const duration = normalizeDuration(value);

      return {
        ...current,
        selectedDurationSeconds: duration,
        remainingSeconds: duration,
        status: 'idle',
        startedAt: null,
        deadline: null,
        completedTimer: null,
      };
    });
  }

  const progress =
    timer.selectedDurationSeconds > 0
      ? Math.min(
          1,
          Math.max(
            0,
            (timer.selectedDurationSeconds - timer.remainingSeconds) /
              timer.selectedDurationSeconds,
          ),
        )
      : 0;

  return {
    selectedDurationSeconds: timer.selectedDurationSeconds,
    remainingSeconds: timer.remainingSeconds,
    status: timer.status,
    progress,
    start,
    pause,
    resume,
    reset,
    setDurationSeconds,
  };
}

export default useMeditationTimer;