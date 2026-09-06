import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SoundQuickSelect from './SoundQuickSelect';

describe('SoundQuickSelect', () => {
  it('offers silence and the seven background sounds', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SoundQuickSelect value="" onChange={onChange} />);

    const select = screen.getByLabelText(/background sound/i);

    expect(select).toHaveValue('');
    expect(screen.getAllByRole('option')).toHaveLength(8);
    expect(screen.getByRole('option', { name: /nessuno/i })).toHaveValue('');
    expect(screen.getByRole('option', { name: /neural dream/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /waterfront market/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /aerolab station/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /asteroid forge/i })).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /lucy in the sky with diamonds/i }),
    ).toBeInTheDocument();

    await user.selectOptions(select, 'IKa5SBJA2dU');
    expect(onChange).toHaveBeenCalledWith('IKa5SBJA2dU');
  });

  it('shows the quick Loop control for a selected sound', async () => {
    const user = userEvent.setup();
    const onLoopChange = vi.fn();

    render(
      <SoundQuickSelect
        value="IKa5SBJA2dU"
        onChange={vi.fn()}
        loop={false}
        onLoopChange={onLoopChange}
      />,
    );

    const loopToggle = screen.getByRole('checkbox', { name: /^loop$/i });

    expect(loopToggle).not.toBeChecked();
    await user.click(loopToggle);
    expect(onLoopChange).toHaveBeenCalledWith(true);
  });
});
