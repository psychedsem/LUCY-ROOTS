import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';
import App from './App';

it('shows a loading state while a route is loaded lazily', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );

  expect(
    screen.getByText(/caricamento/i),
  ).toBeInTheDocument();

  expect(
    await screen.findByRole('heading', {
      name: /lucy\/\/roots/i,
    }),
  ).toBeInTheDocument();
});