import { whenDOMReady } from '@abcnews/env-utils';
import { getMountValue, selectMounts } from '@abcnews/mount-utils';
import type { Mount } from '@abcnews/mount-utils';
import App from './components/App/App.svelte';

import './global.scss';

let appMountEl: Mount;
let appProps;

whenDOMReady.then(() => {
  [appMountEl] = selectMounts('elections-federal2022-scatterplots');

  if (appMountEl) {
    new App({
      target: appMountEl,
      props: {}
    });
  }
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[elections-federal2022-scatterplots] public path: ${__webpack_public_path__}`);
}
