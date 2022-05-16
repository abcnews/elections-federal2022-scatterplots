<script lang="ts">
  import { setContext, onMount } from 'svelte';
  import Tabs from 'carbon-components-svelte/src/Tabs/Tabs.svelte';
  import Tab from 'carbon-components-svelte/src/Tabs/Tab.svelte';
  import TabContent from 'carbon-components-svelte/src/Tabs/TabContent.svelte';
  import { createGraphStore } from '../../store';

  // import MarkersTab from '../MarkersTab.svelte';
  import PropertiesTab from '../PropertiesTab.svelte';
  import ScatterChart from '../ScatterChart/ScatterChart.svelte';

  import { fetchLiveResultsElectorates } from '../../lib/results';

  const graph = createGraphStore();

  let results;

  onMount(async () => {
    results = await fetchLiveResultsElectorates();
  });

  setContext('graph', graph);
</script>

<main>
  <article>
    <figure>
      <ScatterChart results={results} />
    </figure>
  </article>
  <aside>
    <Tabs autoWidth>
      <Tab label="Properties" />
      <svelte:fragment slot="content">
        <TabContent><PropertiesTab /></TabContent>
      </svelte:fragment>
    </Tabs>
  </aside>
</main>

<style>
  main {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;
    min-height: 100vh;
    font-family: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;
  }

  article {
    flex: 0 0 auto;
    margin: auto;
    width: 100%;
    max-width: 42rem;
  }

  figure {
    margin: auto;
  }

  aside {
    flex: 1 1 100%;
    border-top: 2px solid #e0e0e0;
    width: 100%;
  }

  @media (min-width: 72rem) {
    aside {
      align-self: stretch;
      margin: 0;
      border-top: 0;
      border-left: 2px solid #e0e0e0;
      max-width: 27rem;
      max-height: 100vh;
      overflow-x: hidden;
      overflow-y: scroll;
    }
  }

  aside :global(.bx--tabs) {
    position: relative;
  }

  aside :global(.bx--tabs)::before {
    content: '';
    z-index: 0;
    position: absolute;
    top: calc(2.5rem - 2px);
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #e0e0e0;
  }

  aside :global(.bx--accordion) {
    margin: -1rem;
    width: calc(100% + 2rem);
  }

  aside :global(.bx--accordion__item):first-child {
    border-top: 0;
  }

  aside :global(.bx--accordion__content) {
    padding-right: 1rem !important;
  }
</style>
