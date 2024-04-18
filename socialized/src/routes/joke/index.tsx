import { component$, useSignal, useTask$, useStylesScoped$, StreamWriter } from '@builder.io/qwik';
import { routeAction$, routeLoader$, Form, server$, RequestHandler, QwikCityProvider } from '@builder.io/qwik-city';

// ?inline - inlines the styles into the component
// Good for header as this is render blocking
import styles from "./index.css?inline";
import { renderToStream, renderToString } from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';

export const onGet: RequestHandler = async ({ html,  }) => {
  const renderedHTML = await renderToString(
    (<header>
      <nav><ul><li>Howdy</li></ul></nav>
    </header>),
    {
      containerTagName: 'header',
      manifest
    }
  );

  html(200, renderedHTML.html);
}

// loaded eagerly on the route
export const useDadJoke = routeLoader$(async () => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' },
  });

  return (await response.json()) as {
    id: string;
    status: number;
    joke: string;
  };
});

export const useJokeVoteAction = routeAction$(props => {
  console.log('VOTE', props);
});

export default component$(() => {
  const dadJokeSignal = useDadJoke();
  const favoriteJokeAction = useJokeVoteAction();
  const isFavoriteSignal = useSignal(false);

  useStylesScoped$(styles);

  useTask$(({ track }) => {
    track(() => isFavoriteSignal.value);
    console.log('FAVORITE (isomorphic)', isFavoriteSignal.value);
    server$(() => {
      console.log('FAVORITE (server)', isFavoriteSignal.value);
    })();
  });

  return (
    <section class="section bright">
      <p>{dadJokeSignal.value.joke}</p>
      <Form action={favoriteJokeAction}>
        <input type="hidden" name="jokeID" value={dadJokeSignal.value.id} />
        <button name="vote" value="up">👍</button>
        <button name="vote" value="down">👎</button>
      </Form>
      <button
          onClick$={() => {
            isFavoriteSignal.value = !isFavoriteSignal.value;
          }}>
        {isFavoriteSignal.value ? '❤️' : '🤍'}
      </button>
    </section>
  );
});
