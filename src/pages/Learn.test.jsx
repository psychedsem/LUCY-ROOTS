import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Learn from './Learn';

describe('Learn page', () => {
  it('introduces meditation and presents holotropic breathwork as a prepared, facilitated practice', () => {
    render(
      <MemoryRouter>
        <Learn />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /imparare a meditare/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /che cos.è la meditazione/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /un modo semplice per iniziare/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /perché praticare/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /percorso verso la respirazione olotropica/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /facilitazione qualificata/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /integrazione/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/non è un protocollo/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('img', {
        name: /imparare la meditazione in un ambiente solarpunk/i,
      }),
    ).toBeInTheDocument();
  });
  it('returns to the top when the final meditation CTA opens the timer', () => {
    const scrollTo = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Learn />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole('link', { name: /inizia a meditare/i }),
    );

    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    scrollTo.mockRestore();
  });

});
