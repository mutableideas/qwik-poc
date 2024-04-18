import { RequestHandler } from "@builder.io/qwik-city";
import { getQwikLoaderScript, getQwikPrefetchWorkerScript, renderToString } from "@builder.io/qwik/server";
import { manifest } from "@qwik-client-manifest";
import { Navbar } from "../../components/navbar/navbar";

export const onGet: RequestHandler = async ({ html }) => {
  const qwikLoaderScript = `
    <link href="/manifest.json" rel="mainfest" q:head />
    <script type="text/javscript">
      ${getQwikLoaderScript()}
      ${getQwikPrefetchWorkerScript()}
    </script>`;

  const renderedHTML = await renderToString(
    (<Navbar></Navbar>),
    {
      containerTagName: 'header',
      base: '/build/',
      manifest
    }
  );

  html(200, [qwikLoaderScript, renderedHTML.html].join(''));
}
