import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useMeditationTimer from './useMeditationTimer';

describe('useMeditationTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-29T10:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts, pauses, resumes, completes once and reports the completed run', () => {
    const onComplete = vi.fn();

    const { result } = renderHook(() =>
      useMeditationTimer({
        initialDurationSeconds: 10,
        onComplete,
      }),
    );

    act(() => {
      result.current.start();
    });

    expect(result.current.status).toBe('running');

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(result.current.remainingSeconds).toBe(6);

    act(() => {
      result.current.pause();
    });

    expect(result.current.status).toBe('paused');

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.remainingSeconds).toBe(6);

    act(() => {
      result.current.resume();
      vi.advanceTimersByTime(6000);
    });

    expect(result.current.status).toBe('completed');
    expect(result.current.remainingSeconds).toBe(0);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toMatchObject({
      durationSeconds: 10,
      startedAt: new Date('2026-08-29T10:00:00').getTime(),
    });
  });

  it('uses a deadline so delayed ticks catch up instead of drifting', () => {
    const { result } = renderHook(() =>
      useMeditationTimer({ initialDurationSeconds: 60 }),
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.setSystemTime(new Date('2026-08-29T10:00:44'));
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.remainingSeconds).toBe(15);
  });

  it('reset discards the active run and restores the selected duration', () => {
    const onComplete = vi.fn();

    const { result } = renderHook(() =>
      useMeditationTimer({
        initialDurationSeconds: 20,
        onComplete,
      }),
    );

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(5000);
      result.current.reset();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.remainingSeconds).toBe(20);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('does not allow duration changes while running or paused', () => {
    const { result } = renderHook(() =>
      useMeditationTimer({ initialDurationSeconds: 300 }),
    );

    act(() => {
      result.current.start();
      result.current.setDurationSeconds(600);
    });

    expect(result.current.selectedDurationSeconds).toBe(300);

    act(() => {
      result.current.pause();
      result.current.setDurationSeconds(900);
    });

    expect(result.current.selectedDurationSeconds).toBe(300);
  });

  it('updates the selected duration while idle and exposes progress', () => {
    const { result } = renderHook(() =>
      useMeditationTimer({ initialDurationSeconds: 300 }),
    );

    act(() => {
      result.current.setDurationSeconds(600);
    });

    expect(result.current.selectedDurationSeconds).toBe(600);
    expect(result.current.remainingSeconds).toBe(600);
    expect(result.current.progress).toBe(0);
  });
});
