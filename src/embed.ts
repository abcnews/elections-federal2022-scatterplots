import { whenDOMReady, whenOdysseyLoaded } from '@abcnews/env-utils';
import acto from '@abcnews/alternating-case-to-object';
import { getMountValue, selectMounts } from '@abcnews/mount-utils';
import type { Mount } from '@abcnews/mount-utils';
import { loadScrollyteller } from 'jtfell-svelte-scrollyteller';

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
      }
    });
  });

  try {
    const scrollyData = loadScrollyteller('chart1', 'u-full', 'mark');
    appMountEl1 = scrollyData.mountNode;
    if (appMountEl1) {
      new ScrollyWrapper({
        target: appMountEl1,
        props: { scrollyData }
      });
    }
  } catch (e) {
    console.log(e);
  }
  try {
    const scrollyData = loadScrollyteller('chart2', 'u-full', 'mark');
    appMountEl2 = scrollyData.mountNode;
    if (appMountEl2) {
      new ScrollyWrapper({
        target: appMountEl2,
        props: { scrollyData }
      });
    }
  } catch (e) {
    console.log(e);
  }
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[elections-federal2022-scatterplots] public path: ${__webpack_public_path__}`);
}
