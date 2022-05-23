<script lang="ts">
  import { setContext } from 'svelte';
  import Scrollyteller from 'svelte-scrollyteller';

  import { createGraphStore } from '../store';

  import { actoObjectToPartialGraph } from '../lib/encode';
  import ScatterChart from './ScatterChart/ScatterChart.svelte';

  // Initialise with default state
  const graph = createGraphStore({});
  export let scrollyData: any;

  // Setup room state
  setContext('graph', graph);

  // Pass markers into the room state
  let updateState = ((state: any) => {
    console.log(actoObjectToPartialGraph(state));
    graph.updateMany(actoObjectToPartialGraph(state));
  });
</script>

{#if !!scrollyData}
  <Scrollyteller
    panels={scrollyData.panels}
    onMarker={updateState}
  >
    <div class="wrapper">
      <ScatterChart />
    </div>
  </Scrollyteller>
{/if}


<style>
  .wrapper {
    margin: 3rem auto;
    /* width: 100vw; */
    /* height: 100%; */

    max-width: 40rem;

    position: relative;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }
</style>
