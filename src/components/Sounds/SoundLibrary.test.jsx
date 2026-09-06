import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SoundLibrary from './SoundLibrary';

describe('SoundLibrary', () => {
  it('renders the three supplied categories and all seven sounds', () => {
    render(<SoundLibrary />);

    expect(
      screen.getByRole('heading', { name: /sound scape/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /relaxing storytelling/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /^bonus$/i }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByTitle(/youtube player/i),
    ).toHaveLength(7);

    expect(screen.getByText('Neural Dream')).toBeInTheDocument();
    expect(
      screen.getByText('Mellow Psychedelic Journey'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Rain in the Green City of the Future'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Waterfront Market'),
    ).toBeInTheDocument();
    expect(screen.getByText('Aerolab Station')).toBeInTheDocument();
    expect(screen.getByText('Asteroid Forge')).toBeInTheDocument();
    expect(
      screen.getByText('Lucy in the Sky with Diamonds (cover)'),
    ).toBeInTheDocument();
  });
});
