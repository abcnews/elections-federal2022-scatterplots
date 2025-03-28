
import { whenDOMReady, whenOdysseyLoaded } from '@abcnews/env-utils';
import acto from '@abcnews/alternating-case-to-object';
import { getMountValue, selectMounts } from '@abcnews/mount-utils';
import type { Mount } from '@abcnews/mount-utils';
import { mount } from 'svelte';
import { loadScrollyteller } from '@abcnews/svelte-scrollyteller';

import ScrollyWrapper from './components/ScrollyWrapper.svelte';

import { alternatingCaseToPartialGraph } from './lib/encode';

let appMountEl1;
let appMountEl2;
// let appProps;

let appMountEl: Mount;
let appProps;

whenOdysseyLoaded.then(() => {

  const MARKER_NAME = 'scrollyscatter';
  const mounts = selectMounts(MARKER_NAME);
  mounts.forEach(appMountNode => {
    const id = appMountNode.id.match(/\d+$/)?.[0];
    if (mounts.length > 1 && !id) {
      console.error(`IDs must be specified when multiple mounts are used. E.g. #${MARKER_NAME}1`);
      return;
    }

    try {
      const scrollyConfig = loadScrollyteller(MARKER_NAME + (id || ''), 'u-full', 'mark');

      mount(ScrollyWrapper, {
        target: scrollyConfig.mountNode,
        props: { panels: scrollyConfig.panels }
      });
    } catch (e) {
      const errorMessage = 'Unable to load interactive.';
      console.error(errorMessage, e);
      appMountNode.innerHTML = `<p style="border:1px solid red;padding:1rem;">${errorMessage}</p>`;
    }
  });
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[federal-election2025-scatterplots] public path: ${__webpack_public_path__}`);
}
