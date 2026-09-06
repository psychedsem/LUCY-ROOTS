import {
  act,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Meditate from './Meditate';

const STORAGE_KEY = 'lucy-roots-meditation-history';

function renderMeditate() {
  return render(
    <MemoryRouter>
      <Meditate />
    </MemoryRouter>,
  );
}

describe('Meditate history panel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-29T21:00:00'));
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.useRealTimers();
  });

  it('opens a right-side history panel and shows stored sessions as an accordion', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: 'session-1',
          name: 'Sessione 1',
          startedAt: new Date('2026-08-29T20:00:00').getTime(),
          lastCompletedAt: new Date('2026-08-29T20:25:00').getTime(),
          timers: [
            {
              id: 'timer-1',
              startedAt: new Date('2026-08-29T20:00:00').getTime(),
              endedAt: new Date('2026-08-29T20:10:00').getTime(),
              durationSeconds: 600,
            },
            {
              id: 'timer-2',
              startedAt: new Date('2026-08-29T20:15:00').getTime(),
              endedAt: new Date('2026-08-29T20:25:00').getTime(),
              durationSeconds: 600,
            },
          ],
        },
      ]),
    );

    renderMeditate();

    fireEvent.click(
      screen.getByRole('button', { name: /cronologia/i }),
    );

    const panel = screen.getByRole('complementary', {
      name: /cronologia meditazioni/i,
    });

    expect(
      within(panel).getByRole('heading', { name: /cronologia/i }),
    ).toBeInTheDocument();

    expect(
      within(panel).getByRole('button', { name: /^sessione 1$/i }),
    ).toBeInTheDocument();

    expect(within(panel).getByText(/timer 1/i)).toBeInTheDocument();
    expect(within(panel).getByText(/20:00/)).toBeInTheDocument();
    expect(within(panel).getByText(/timer 2/i)).toBeInTheDocument();
    expect(within(panel).getByText(/20:15/)).toBeInTheDocument();

    fireEvent.click(
      within(panel).getByRole('button', { name: /^sessione 1$/i }),
    );

    expect(
      within(panel).queryByText(/timer 1/i),
    ).not.toBeInTheDocument();
  });

  it('renames a session and persists the custom name', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: 'session-1',
          name: 'Sessione 1',
          startedAt: new Date('2026-08-29T20:00:00').getTime(),
          lastCompletedAt: new Date('2026-08-29T20:10:00').getTime(),
          timers: [
            {
              id: 'timer-1',
              startedAt: new Date('2026-08-29T20:00:00').getTime(),
              endedAt: new Date('2026-08-29T20:10:00').getTime(),
              durationSeconds: 600,
            },
          ],
        },
      ]),
    );

    renderMeditate();

    fireEvent.click(
      screen.getByRole('button', { name: /cronologia/i }),
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /rinomina sessione 1/i,
      }),
    );

    const nameInput = screen.getByLabelText(/nuovo nome sessione/i);

    fireEvent.change(nameInput, {
      target: { value: 'Meditazione serale' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /salva nome/i }),
    );

    expect(
      screen.getByRole('button', { name: /^meditazione serale$/i }),
    ).toBeInTheDocument();

    const storedHistory = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY),
    );

    expect(storedHistory[0].name).toBe('Meditazione serale');
  });

  it('stores only completed timers and makes them available in history', () => {
    renderMeditate();

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

    const storedHistory = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY),
    );

    expect(storedHistory).toHaveLength(1);
    expect(storedHistory[0].timers).toHaveLength(1);
    expect(storedHistory[0].timers[0].durationSeconds).toBe(60);

    fireEvent.click(
      screen.getByRole('button', { name: /ancora/i }),
    );

    fireEvent.click(
      screen.getByRole('button', { name: /cronologia/i }),
    );

    expect(screen.getByText(/timer 1/i)).toBeInTheDocument();
  });

  it('does not store a timer that is reset before completion', () => {
    renderMeditate();

    fireEvent.click(
      screen.getByRole('button', { name: /^inizia$/i }),
    );

    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    fireEvent.click(
      screen.getByRole('button', { name: /reset/i }),
    );

    expect(
      window.localStorage.getItem(STORAGE_KEY),
    ).toBeNull();
  });

  it('keeps the completed-screen history panel open once requested', () => {
    renderMeditate();

    fireEvent.change(
      screen.getByLabelText(/durata personalizzata/i),
      { target: { value: '1' } },
    );
    fireEvent.click(screen.getByRole('button', { name: /usa durata/i }));
    fireEvent.click(screen.getByRole('button', { name: /^inizia$/i }));

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    const historyButton = screen.getByRole('button', { name: /^cronologia$/i });
    fireEvent.click(historyButton);

    expect(
      screen.getByRole('complementary', { name: /cronologia meditazioni/i }),
    ).toBeInTheDocument();
    expect(historyButton).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(historyButton);

    expect(
      screen.getByRole('complementary', { name: /cronologia meditazioni/i }),
    ).toBeInTheDocument();
  });

  it('keeps history open when an active timer completes', () => {
    renderMeditate();

    fireEvent.click(screen.getByRole('button', { name: /^cronologia$/i }));
    fireEvent.change(
      screen.getByLabelText(/durata personalizzata/i),
      { target: { value: '1' } },
    );
    fireEvent.click(screen.getByRole('button', { name: /usa durata/i }));
    fireEvent.click(screen.getByRole('button', { name: /^inizia$/i }));

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(
      screen.getByRole('heading', { name: /sessione completata/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('complementary', { name: /cronologia meditazioni/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^cronologia$/i }),
    ).toHaveAttribute('aria-expanded', 'true');
  });
});
