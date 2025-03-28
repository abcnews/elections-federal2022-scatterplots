
import { whenDOMReady, whenOdysseyLoaded } from '@abcnews/env-utils';
import acto from '@abcnews/alternating-case-to-object';
import { getMountValue, selectMounts } from '@abcnews/mount-utils';
import type { Mount } from '@abcnews/mount-utils';
import { mount } from 'svelte';
import { loadScrollyteller } from '@abcnews/svelte-scrollyteller';

import App from './components/App/App.svelte';

import { alternatingCaseToPartialGraph } from './lib/encode';

let appMountEl1;
let appMountEl2;
// let appProps;

let appMountEl: Mount;
let appProps;

whenDOMReady.then(() => {
  [appMountEl] = selectMounts('elections-federal2022-scatterplots');

  if (appMountEl) {
    mount(App, {
      target: appMountEl,
      props: {}
    });
  }
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[federal-election2025-scatterplots] public path: ${__webpack_public_path__}`);
}
