import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

describe('Home page', () => {
  it('shows the supplied branding, Italian content and main actions', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('img', { name: /lucy\/\/roots logo e wordmark/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/go inward\. grow outward\./i)).toBeInTheDocument();

    expect(
      screen.getByText(
        /uno spazio digitale tranquillo per la meditazione a tempo, suoni immersivi e l.esplorazione consapevole/i,
      ),
    ).toBeInTheDocument();

    const sessionLinks = screen.getAllByRole('link', {
      name: /inizia sessione/i,
    });

    expect(sessionLinks).toHaveLength(2);
    sessionLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/meditate');
    });

    expect(
      screen.getByRole('heading', {
        name: /uno spazio semplice per tornare a te stesso/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /radicati/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /osserva/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /esplora/i })).toBeInTheDocument();

    expect(
      screen.getByRole('img', { name: /meditazione in una città solarpunk/i }),
    ).toBeInTheDocument();
  });
  it('returns to the top when the final session CTA opens the timer', () => {
    const scrollTo = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    const sessionLinks = screen.getAllByRole('link', {
      name: /inizia sessione/i,
    });

    fireEvent.click(sessionLinks[1]);

    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    scrollTo.mockRestore();
  });

});
