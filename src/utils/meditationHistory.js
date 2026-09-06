export const SESSION_GAP_MS = 20 * 60 * 1000;

function createTimer(timer) {
  return {
    id: `timer-${timer.startedAt}`,
    startedAt: timer.startedAt,
    endedAt: timer.endedAt,
    durationSeconds: timer.durationSeconds,
  };
}

function createSession(timer, sessionNumber) {
  return {
    id: `session-${timer.startedAt}`,
    name: `Sessione ${sessionNumber}`,
    startedAt: timer.startedAt,
    lastCompletedAt: timer.endedAt,
    timers: [createTimer(timer)],
  };
}

export function addCompletedTimer(history, timer) {
  const nextTimer = createTimer(timer);

  if (history.length === 0) {
    return [createSession(timer, 1)];
  }

  const lastSession = history[history.length - 1];
  const lastTimer = lastSession.timers[lastSession.timers.length - 1];
  const gapFromPreviousCompletion = timer.startedAt - lastTimer.endedAt;

  // Timers started within 20 minutes of the previous completion stay together.
  const belongsToLastSession =
    gapFromPreviousCompletion >= 0 &&
    gapFromPreviousCompletion <= SESSION_GAP_MS;

  if (!belongsToLastSession) {
    return [...history, createSession(timer, history.length + 1)];
  }

  const updatedSession = {
    ...lastSession,
    lastCompletedAt: timer.endedAt,
    timers: [...lastSession.timers, nextTimer],
  };

  return [...history.slice(0, -1), updatedSession];
}

export function formatTimerStart(timerStartedAt, sessionStartedAt) {
  const timerDate = new Date(timerStartedAt);
  const sessionDate = new Date(sessionStartedAt);

  const hours = String(timerDate.getHours()).padStart(2, '0');
  const minutes = String(timerDate.getMinutes()).padStart(2, '0');

  const isDifferentCalendarDay =
    timerDate.getFullYear() !== sessionDate.getFullYear() ||
    timerDate.getMonth() !== sessionDate.getMonth() ||
    timerDate.getDate() !== sessionDate.getDate();

  return `${hours}:${minutes}${isDifferentCalendarDay ? '*' : ''}`;
}
