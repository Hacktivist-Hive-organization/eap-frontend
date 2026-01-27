import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { store } from '@/store';
import { HomePage } from './HomePage';

describe('App test', () => {
  it('should pass', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
});
