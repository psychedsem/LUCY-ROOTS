import { describe, expect, it } from 'vitest';
import {
  addCompletedTimer,
  formatTimerStart,
  SESSION_GAP_MS,
} from './meditationHistory';

describe('meditation history logic', () => {
  it('keeps a new timer in the same session when it starts within 20 minutes of the previous completion', () => {
    const firstTimer = {
      startedAt: new Date('2026-08-29T21:00:00').getTime(),
      endedAt: new Date('2026-08-29T21:10:00').getTime(),
      durationSeconds: 600,
    };

    const secondTimer = {
      startedAt: new Date('2026-08-29T21:29:59').getTime(),
      endedAt: new Date('2026-08-29T21:44:59').getTime(),
      durationSeconds: 900,
    };

    let history = addCompletedTimer([], firstTimer);
    history = addCompletedTimer(history, secondTimer);

    expect(SESSION_GAP_MS).toBe(20 * 60 * 1000);
    expect(history).toHaveLength(1);
    expect(history[0].timers).toHaveLength(2);
    expect(history[0].name).toBe('Sessione 1');
  });

  it('creates a new session when more than 20 minutes pass after the previous timer ends', () => {
    const firstTimer = {
      startedAt: new Date('2026-08-29T21:00:00').getTime(),
      endedAt: new Date('2026-08-29T21:10:00').getTime(),
      durationSeconds: 600,
    };

    const secondTimer = {
      startedAt: new Date('2026-08-29T21:30:01').getTime(),
      endedAt: new Date('2026-08-29T21:35:01').getTime(),
      durationSeconds: 300,
    };

    let history = addCompletedTimer([], firstTimer);
    history = addCompletedTimer(history, secondTimer);

    expect(history).toHaveLength(2);
    expect(history[0].name).toBe('Sessione 1');
    expect(history[1].name).toBe('Sessione 2');
  });

  it('keeps cross-midnight timers inside the same session and marks the following calendar day', () => {
    const firstTimer = {
      startedAt: new Date('2026-08-29T23:50:00').getTime(),
      endedAt: new Date('2026-08-30T00:00:00').getTime(),
      durationSeconds: 600,
    };

    const secondTimer = {
      startedAt: new Date('2026-08-30T00:19:00').getTime(),
      endedAt: new Date('2026-08-30T00:34:00').getTime(),
      durationSeconds: 900,
    };

    let history = addCompletedTimer([], firstTimer);
    history = addCompletedTimer(history, secondTimer);

    expect(history).toHaveLength(1);
    expect(history[0].startedAt).toBe(firstTimer.startedAt);
    expect(formatTimerStart(secondTimer.startedAt, history[0].startedAt)).toMatch(
      /00:19\*$/,
    );
  });

  it('does not mutate the previous history array', () => {
    const originalHistory = [];
    const timer = {
      startedAt: new Date('2026-08-29T10:00:00').getTime(),
      endedAt: new Date('2026-08-29T10:05:00').getTime(),
      durationSeconds: 300,
    };

    const nextHistory = addCompletedTimer(originalHistory, timer);

    expect(nextHistory).not.toBe(originalHistory);
    expect(originalHistory).toEqual([]);
  });
});
