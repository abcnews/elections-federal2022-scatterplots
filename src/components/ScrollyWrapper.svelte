<script lang="ts">
  import { setContext, onMount } from 'svelte';
  import Scrollyteller from '@abcnews/svelte-scrollyteller';

  import { createGraphStore } from '../store';

  // import { fetchDemographicData } from '../lib/demographics';
  import { fetchErads } from '../lib/results';
  import { actoObjectToPartialGraph } from '../lib/encode';
  import ScatterChart from './ScatterChart/ScatterChart.svelte';

  // Initialise with default state
  const graph = createGraphStore({});
  export let panels: any;

  // Setup room state
  setContext('graph', graph);

  // Pass markers into the room state
  let updateState = ((state: any) => {
    graph.updateMany(actoObjectToPartialGraph(state));
  });

  // Prefetch all the datasets used in the scrollyteller sections
  onMount(() => {
    // fetchErads('2019');
    // fetchErads('2022');
    fetchErads('2025');
    // fetchDemographicData('votecompass2');
    // fetchDemographicData('geo');
    // fetchDemographicData('education');
  });
</script>

{#if !!panels || !panels.length}
  <Scrollyteller
    panels={panels}
    onMarker={updateState}
    layout={{ align: 'left', resizeInteractive: true }}
  >
    <div class="wrapper">
      <ScatterChart />
    </div>
  </Scrollyteller>
{/if}


<style lang="scss">
  .wrapper {
    /* position: absolute; */
    /* left: 0; */
    /* top: 0; */
    /* width: 100%; */
    /* height: 100%; */

    /* aspect-ratio: 1; */
    height: 100%;
    width: unset;
    @container (max-aspect-ratio:16/9) {
      width: 100%;
      height: auto;
    }
  }
</style>
