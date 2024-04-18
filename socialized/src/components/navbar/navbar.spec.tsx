import { createDOM } from '@builder.io/qwik/testing';
import { test, expect } from 'vitest';
import { Navbar } from './navbar';

test(`[Navbar Component]: Should render`, async () => {
  const { screen, render } = await createDOM();
  await render(<Navbar />);
  expect(screen.innerHTML).toContain('Navbar works!');
});
