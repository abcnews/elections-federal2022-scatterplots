import { mount } from 'svelte';
import { fetchLiveResultsElectorates } from '../../lib/results';
import InlineHighlight from './InlineHighlight.svelte';

function mountInlineHighlight(node, props) {
  const newParent = document.createElement('span');
  node.replaceWith(newParent);
  mount(InlineHighlight, {
    target: newParent,
    props: {
      ...props
    }
  });
}

/**
 * Search panels for any <strong> elements with a party or electorate name and
 * colourise them accordingly.
 */
export function applyColourToPanels(panels) {
  fetchLiveResultsElectorates('2025').then(results =>
    panels.forEach(({ nodes }, i) => {
      (nodes as HTMLElement[]).forEach(node =>
        node.querySelectorAll('span,strong').forEach(stronk => {
          const textContent = String(stronk.textContent).trim();

          const resultForElectorate: any = results.find(e => e.name === textContent);
          if (resultForElectorate) {
            const allocation = resultForElectorate.winningParty;

            mountInlineHighlight(stronk, {
              name: textContent,
              allocation,
              certainty: true,
            });
          }
        })
      );
    })
  );

  return panels;
}

