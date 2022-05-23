import GoogleDocPreview from './components/GoogleDocPreview.svelte';
import { whenOdysseyLoaded } from '@abcnews/env-utils';
import regeneratorRuntime from "regenerator-runtime";

import './global.scss';

whenOdysseyLoaded.then(() => {
  const app = new GoogleDocPreview({
    target: document.body.querySelector('main') || document.body,
    anchor: document.body.querySelector('.FormatCredit') || undefined,
  });
});
