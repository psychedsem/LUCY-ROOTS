import { render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

vi.mock('./pages/Learn', () => ({
  default: function BrokenLearn() {
    throw new Error('Broken route');
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
});

it('keeps navigation available when a route crashes', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <MemoryRouter initialEntries={['/learn']}>
      <App />
    </MemoryRouter>,
  );

  expect(
    await screen.findByRole('alert'),
  ).toHaveTextContent(/questa sezione non è disponibile/i);

  expect(
    screen.getByRole('banner'),
  ).toBeInTheDocument();
});