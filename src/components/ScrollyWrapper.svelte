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
    padding: 1rem;
    max-width: 50rem;
    position: relative;
    top: 40%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }
</style>
