import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';

describe('App test', () => {
  it('should pass', () => {
    render(<HomePage />);
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
});
