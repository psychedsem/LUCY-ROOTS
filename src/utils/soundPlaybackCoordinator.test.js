import { describe, expect, it, vi } from 'vitest';
import { createSoundPlaybackCoordinator } from './soundPlaybackCoordinator';

function createFakePlayer() {
  return {
    play: vi.fn(),
    pause: vi.fn(),
  };
}

describe('sound playback coordinator', () => {
  it('keeps only one sound playing at a time', () => {
    const coordinator = createSoundPlaybackCoordinator();
    const first = createFakePlayer();
    const second = createFakePlayer();

    coordinator.register('first', first);
    coordinator.register('second', second);
    coordinator.handlePlaying('first');
    coordinator.handlePlaying('second');

    expect(first.pause).toHaveBeenCalledTimes(1);
    expect(second.pause).not.toHaveBeenCalled();
  });

  it('starts a requested sound as soon as its player is ready', () => {
    const coordinator = createSoundPlaybackCoordinator();
    const player = createFakePlayer();

    coordinator.play('ambient');
    coordinator.register('ambient', player);

    expect(player.play).toHaveBeenCalledTimes(1);
  });

  it('pauses the active sound for timer pause and stop', () => {
    const coordinator = createSoundPlaybackCoordinator();
    const player = createFakePlayer();

    coordinator.register('ambient', player);
    coordinator.handlePlaying('ambient');
    coordinator.pauseForTimer();

    expect(player.pause).toHaveBeenCalledTimes(1);

    coordinator.handlePlaying('ambient');
    coordinator.stopActive();

    expect(player.pause).toHaveBeenCalledTimes(2);
  });
});
