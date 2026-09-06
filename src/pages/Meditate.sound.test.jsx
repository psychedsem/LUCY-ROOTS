import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Meditate from './Meditate';

const { coordinator } = vi.hoisted(() => ({
  coordinator: {
    register: vi.fn(),
    unregister: vi.fn(),
    handlePlaying: vi.fn(),
    handlePaused: vi.fn(),
    pauseForTimer: vi.fn(),
    stopActive: vi.fn(),
    play: vi.fn(),
  },
}));

vi.mock('../utils/soundPlaybackCoordinator', () => ({
  createSoundPlaybackCoordinator: () => coordinator,
}));

vi.mock('../components/Sounds/SoundLibrary', () => ({
  default: ({ onSoundSelect, onLoopChange, loopBySoundId = {} }) => (
    <section aria-label="Fake sound library">
      <button
        type="button"
        onClick={() => onSoundSelect?.('4bTw5IKUwZ4')}
      >
        Simula Waterfront in play
      </button>

      <button
        type="button"
        onClick={() => onLoopChange?.('4bTw5IKUwZ4', true)}
      >
        Attiva loop Waterfront
      </button>

      <span data-testid="waterfront-loop-state">
        {loopBySoundId['4bTw5IKUwZ4'] ? 'on' : 'off'}
      </span>
    </section>
  ),
}));

function renderMeditate() {
  return render(
    <MemoryRouter>
      <Meditate />
    </MemoryRouter>,
  );
}

describe('Meditate background sound controls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('starts the selected sound with the meditation', async () => {
    const user = userEvent.setup();
    renderMeditate();

    const select = screen.getByLabelText(/background sound/i);

    await user.selectOptions(select, 'IKa5SBJA2dU');
    expect(coordinator.play).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /^inizia$/i }));
    expect(coordinator.play).toHaveBeenCalledWith('IKa5SBJA2dU');
  });

  it('switches sound while running and supports silence', async () => {
    const user = userEvent.setup();
    renderMeditate();

    const select = screen.getByLabelText(/background sound/i);

    await user.selectOptions(select, 'IKa5SBJA2dU');
    await user.click(screen.getByRole('button', { name: /^inizia$/i }));

    coordinator.play.mockClear();
    coordinator.stopActive.mockClear();

    await user.selectOptions(select, '4bTw5IKUwZ4');
    expect(coordinator.play).toHaveBeenCalledWith('4bTw5IKUwZ4');

    await user.selectOptions(select, '');
    expect(coordinator.stopActive).toHaveBeenCalledTimes(1);
  });

  it('pauses and resumes the selected sound with the timer', async () => {
    const user = userEvent.setup();
    renderMeditate();

    await user.selectOptions(
      screen.getByLabelText(/background sound/i),
      'IKa5SBJA2dU',
    );
    await user.click(screen.getByRole('button', { name: /^inizia$/i }));

    coordinator.play.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /pausa/i }));
    expect(coordinator.pauseForTimer).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /riprendi/i }));
    expect(coordinator.play).toHaveBeenCalledWith('IKa5SBJA2dU');
  });

  it('syncs the quick select when a library sound starts', async () => {
    const user = userEvent.setup();
    renderMeditate();

    const select = screen.getByLabelText(/background sound/i);

    await user.click(
      screen.getByRole('button', { name: /simula waterfront in play/i }),
    );

    expect(select).toHaveValue('4bTw5IKUwZ4');
  });

  it('keeps Loop synchronized between quick controls and the library', async () => {
    const user = userEvent.setup();
    renderMeditate();

    await user.click(
      screen.getByRole('button', { name: /simula waterfront in play/i }),
    );

    const quickLoop = screen.getByRole('checkbox', { name: /^loop$/i });
    expect(quickLoop).not.toBeChecked();

    await user.click(quickLoop);
    expect(screen.getByTestId('waterfront-loop-state')).toHaveTextContent('on');

    await user.click(
      screen.getByRole('button', { name: /attiva loop waterfront/i }),
    );
    expect(quickLoop).toBeChecked();
  });
});
