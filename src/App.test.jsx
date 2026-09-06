import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App routes', () => {
  it('renders Home at /', () => {
    renderAt('/');
    expect(
      screen.getByRole('heading', { name: /lucy\/\/roots/i }),
    ).toBeInTheDocument();
  });

  it('renders Meditate at /meditate', () => {
    renderAt('/meditate');
    expect(
      screen.getByRole('heading', { name: /medita/i }),
    ).toBeInTheDocument();
  });

  it('renders Learn at /learn', () => {
    renderAt('/learn');
    expect(
      screen.getByRole('heading', { name: /imparare a meditare/i }),
    ).toBeInTheDocument();
  });
});

describe('Navbar behavior', () => {
  it('keeps route links available and reveals the brand after scrolling', () => {
    renderAt('/');

    const header = screen.getByRole('banner');

    expect(header).not.toHaveAttribute('data-scrolled', 'true');
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /meditate/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /learn/i })).toBeInTheDocument();

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 120,
      writable: true,
    });

    fireEvent.scroll(window);

    expect(header).toHaveAttribute('data-scrolled', 'true');
    expect(screen.getByAltText('LUCY//ROOTS logo')).toBeInTheDocument();
    expect(screen.getByAltText('LUCY//ROOTS wordmark')).toBeInTheDocument();
  });
});
