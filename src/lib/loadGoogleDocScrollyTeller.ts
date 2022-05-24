import { loadScrollyteller } from 'jtfell-svelte-scrollyteller';

const IDENTITY = (el: Element) => el;

export const loadGoogleDocAsScrollyTeller = (url, opts) => {
  const { name, className, markerName } = opts?.scrollyTellerArgs || {};
  const pubURL = url.replace(/\/[^/]+?$/, '/pub');

  return fetch(pubURL)
    .catch(() => fetch(`https://cors-anywhere.herokuapp.com/${pubURL}`))
    .then(response => response.text())
    .then(html => {
      const body = new DOMParser().parseFromString(html, 'text/html').querySelector('#contents > div');

      if (!body) {
        throw new Error('Body not found');
      }

      Array.from(body.querySelectorAll('*')).forEach(el => {
        el.removeAttribute('class');
        el.removeAttribute('id');
      });

      const coreEls: Element[] = Array.from(body.children).map(
        opts.preprocessCoreEl ? opts.preprocessCoreEl : IDENTITY
      );

      const intro = coreEls.reduce<any>((memo, el) => {
        const text = String(el.textContent).trim();

        if (text.indexOf('#scrollyteller') === 0) {
          memo.hasEnded = true;
        }
        if (!memo.hasEnded && text) {
          memo.pars.push(text);
        }

        return memo;
      }, { hasEnded: false, pars: [] });

      const { scrollytellingEls } = coreEls.reduce<{
        hasBegun: boolean;
        hasEnded: boolean;
        isRemoving: boolean;
        scrollytellingEls: Element[];
      }>(
        (memo, el) => {
          if (memo.hasEnded) {
            return memo;
          }

          const text = String(el.textContent).trim();

          if (text.indexOf('#remove') === 0) {
            memo.isRemoving = true;
          } else if (text.indexOf('#endremove') === 0) {
            memo.isRemoving = false;
          } else if (text.indexOf('#') === 0) {
            if (text.indexOf(`#scrollyteller${name ? `NAME${name}` : ''}`) === 0 && !memo.hasBegun) {
              memo.hasBegun = true;
            } else if (text.indexOf('#endscrollyteller') === 0) {
              memo.hasEnded = true;
            }

            memo.scrollytellingEls.push(mountTextToMountEl(text));
          } else if (!memo.hasBegun || memo.isRemoving || text === '') {
            // skip
          } else {
            memo.scrollytellingEls.push(el);
          }

          return memo;
        },
        {
          hasBegun: false,
          hasEnded: false,
          isRemoving: false,
          scrollytellingEls: []
        }
      );

      const tempContainerEl = document.createElement('div');

      // TODO
      // tempContainerEl.className = styles.tempContainer;

      scrollytellingEls.forEach(scrollytellingEl => tempContainerEl.appendChild(scrollytellingEl));
      document.body.appendChild(tempContainerEl);

      let scrollytellerDefinition = loadScrollyteller(name, className, markerName);

      document.body.removeChild(tempContainerEl);

      return { intro: intro.pars, scrollytellerDefinition };
    });
};

function mountTextToMountEl(mountText: string) {
  const mountEl = document.createElement('div');

  mountEl.setAttribute('data-mount', '');
  mountEl.setAttribute('id', mountText.slice(1));

  return mountEl;
}
