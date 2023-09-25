import { whenDOMReady, whenOdysseyLoaded } from '@abcnews/env-utils';
import acto from '@abcnews/alternating-case-to-object';
import { getMountValue, selectMounts } from '@abcnews/mount-utils';
import type { Mount } from '@abcnews/mount-utils';
import { loadScrollyteller } from '@abcnews/svelte-scrollyteller';

import Embed from './components/Embed/Embed.svelte';
import ScrollyWrapper from './components/ScrollyWrapper.svelte';

import { alternatingCaseToPartialGraph } from './lib/encode';

import './embed.scss';

let appMountEl1;
let appMountEl2;
let appProps;

whenOdysseyLoaded.then(() => {
  const mounts = selectMounts('scatter');

  mounts.map(m => {
    appProps = alternatingCaseToPartialGraph(getMountValue(m, 'scatter'));
    new Embed({
      target: m,
      props: {
        graphData: appProps,
        isOdyssey: true,
      }
    });
  });

  try {
    const scrollyData = loadScrollyteller('scrollyscatter1', 'u-full', 'mark');
    appMountEl1 = scrollyData.mountNode;
    if (appMountEl1) {
      new ScrollyWrapper({
        target: appMountEl1,
        props: { scrollyData, isOdyssey: true }
      });
    }
  } catch (e) {
    console.log(e);
  }
  try {
    const scrollyData = loadScrollyteller('scrollyscatter2', 'u-full', 'mark');
    appMountEl2 = scrollyData.mountNode;
    if (appMountEl2) {
      new ScrollyWrapper({
        target: appMountEl2,
        props: { scrollyData, isOdyssey: true }
      });
    }
  } catch (e) {
    console.log(e);
  }
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[elections-federal2022-scatterplots] public path: ${__webpack_public_path__}`);
}
