import { whenDOMReady, whenOdysseyLoaded } from '@abcnews/env-utils';
import acto from '@abcnews/alternating-case-to-object';
import { getMountValue, selectMounts } from '@abcnews/mount-utils';
import type { Mount } from '@abcnews/mount-utils';

import Embed from './components/Embed/Embed.svelte';

import { alternatingCaseToPartialGraph } from './lib/encode';

import './embed.scss';

let appProps;

whenDOMReady.then(() => {
  const mounts = selectMounts('scatter');

  mounts.map(m => {
    appProps = alternatingCaseToPartialGraph(getMountValue(m, 'scatter'));
    new Embed({
      target: m,
      props: {
        graphData: appProps,
        isOdyssey: false,
      }
    });
  });
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[elections-federal2022-scatterplots] public path: ${__webpack_public_path__}`);
}
