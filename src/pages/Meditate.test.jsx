import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Meditate from './Meditate';

describe('Meditate page', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-29T10:00:00'));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('lets the user choose a preset duration and start a meditation', () => {
    render(
      <MemoryRouter>
        <Meditate />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /medita/i }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /10 minuti/i }),
    );

    expect(screen.getByText('10:00')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /^inizia$/i }),
    );

    expect(
      screen.getByRole('button', { name: /pausa/i }),
    ).toBeInTheDocument();
  });

  it('supports a custom duration while idle', () => {
    render(
      <MemoryRouter>
        <Meditate />
      </MemoryRouter>,
    );

    const customInput = screen.getByLabelText(/durata personalizzata/i);

    fireEvent.change(customInput, { target: { value: '12' } });
    fireEvent.click(
      screen.getByRole('button', { name: /usa durata/i }),
    );

    expect(screen.getByText('12:00')).toBeInTheDocument();
  });

  it('pauses, resumes and resets the active timer', () => {
    render(
      <MemoryRouter>
        <Meditate />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /^inizia$/i }),
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    fireEvent.click(
      screen.getByRole('button', { name: /pausa/i }),
    );

    expect(
      screen.getByRole('button', { name: /riprendi/i }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /riprendi/i }),
    );

    fireEvent.click(
      screen.getByRole('button', { name: /reset/i }),
    );

    expect(
      screen.getByRole('button', { name: /^inizia$/i }),
    ).toBeInTheDocument();
  });

  it('shows a completed state when the countdown reaches zero', () => {
    render(
      <MemoryRouter>
        <Meditate />
      </MemoryRouter>,
    );

    fireEvent.change(
      screen.getByLabelText(/durata personalizzata/i),
      { target: { value: '1' } },
    );

    fireEvent.click(
      screen.getByRole('button', { name: /usa durata/i }),
    );

    fireEvent.click(
      screen.getByRole('button', { name: /^inizia$/i }),
    );

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(
      screen.getByRole('heading', { name: /sessione completata/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /ancora/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /torna alla home/i }),
    ).toHaveAttribute('href', '/');
  });

  it('plays the completion chime once when the timer reaches zero', () => {
    const playMock = HTMLMediaElement.prototype.play;

    render(
      <MemoryRouter>
        <Meditate />
      </MemoryRouter>,
    );

    fireEvent.change(
      screen.getByLabelText(/durata personalizzata/i),
      { target: { value: '1' } },
    );
    fireEvent.click(screen.getByRole('button', { name: /usa durata/i }));
    fireEvent.click(screen.getByRole('button', { name: /^inizia$/i }));

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(playMock).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    expect(playMock).toHaveBeenCalledTimes(1);
  });
});
