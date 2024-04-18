import { component$, useSignal, useStylesScoped$, $ } from '@builder.io/qwik';

import styles from './navbar.css?inline';

export const Navbar = component$(() => {
  const value = useSignal(0);

  const update = $(() => value.value ++);

  useStylesScoped$(styles);

  return <header>
    <nav>
      <button onClick$={ update }>
        { value.value } Hello!
      </button>
    </nav>
  </header>;
});
