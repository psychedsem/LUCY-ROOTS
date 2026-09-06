import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import SoundCard from './SoundCard';

describe('SoundCard', () => {
  let playerOptions;
  let playerTarget;

  beforeEach(() => {
    playerOptions = null;
    playerTarget = {
      playVideo: vi.fn(),
      pauseVideo: vi.fn(),
      seekTo: vi.fn(),
      getIframe: vi.fn(() => null),
    };

    function MockPlayer(_iframe, options) {
      playerOptions = options;
      this.destroy = vi.fn();
    }

    window.YT = {
      Player: MockPlayer,
      PlayerState: {
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
      },
    };
  });

  afterEach(() => {
    delete window.YT;
  });

  it('renders the privacy-enhanced player and YouTube fallback link', () => {
    render(
      <SoundCard
        title="Neural Dream"
        url="https://www.youtube.com/watch?v=IKa5SBJA2dU"
      />,
    );

    expect(screen.getByTitle('Neural Dream YouTube player').src).toContain(
      'youtube-nocookie.com/embed/IKa5SBJA2dU',
    );

    expect(
      screen.getByRole('link', { name: /open neural dream on youtube/i }),
    ).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=IKa5SBJA2dU',
    );
  });

  it('reports Loop changes without reloading the iframe', async () => {
    const user = userEvent.setup();
    const onLoopChange = vi.fn();

    const { rerender } = render(
      <SoundCard
        title="Neural Dream"
        url="https://www.youtube.com/watch?v=IKa5SBJA2dU"
        loop={false}
        onLoopChange={onLoopChange}
      />,
    );

    const iframe = screen.getByTitle('Neural Dream YouTube player');
    const srcBefore = iframe.getAttribute('src');

    await user.click(
      screen.getByRole('checkbox', { name: /loop neural dream/i }),
    );

    expect(onLoopChange).toHaveBeenCalledWith('IKa5SBJA2dU', true);

    rerender(
      <SoundCard
        title="Neural Dream"
        url="https://www.youtube.com/watch?v=IKa5SBJA2dU"
        loop
        onLoopChange={onLoopChange}
      />,
    );

    expect(screen.getByRole('checkbox', { name: /loop neural dream/i })).toBeChecked();
    expect(
      screen.getByTitle('Neural Dream YouTube player').getAttribute('src'),
    ).toBe(srcBefore);
  });

  it('restarts from the configured offset only when Loop is active', async () => {
    const { rerender } = render(
      <SoundCard
        title="Asteroid Forge"
        url="https://www.youtube.com/watch?v=Pvnvjqzj1O0&t=3s"
        loop={false}
      />,
    );

    await waitFor(() => {
      expect(playerOptions).not.toBeNull();
    });

    act(() => {
      playerOptions.events.onStateChange({
        data: window.YT.PlayerState.ENDED,
        target: playerTarget,
      });
    });

    expect(playerTarget.seekTo).not.toHaveBeenCalled();
    expect(playerTarget.playVideo).not.toHaveBeenCalled();

    rerender(
      <SoundCard
        title="Asteroid Forge"
        url="https://www.youtube.com/watch?v=Pvnvjqzj1O0&t=3s"
        loop
      />,
    );

    act(() => {
      playerOptions.events.onStateChange({
        data: window.YT.PlayerState.ENDED,
        target: playerTarget,
      });
    });

    expect(playerTarget.seekTo).toHaveBeenCalledWith(3, true);
    expect(playerTarget.playVideo).toHaveBeenCalledTimes(1);
  });
});
