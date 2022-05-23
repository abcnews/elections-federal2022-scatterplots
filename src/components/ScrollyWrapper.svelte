<script lang="ts">
  import { setContext, onMount } from 'svelte';
  import Scrollyteller from 'svelte-scrollyteller';

  import { createGraphStore } from '../store';

  import { fetchDemographicData } from '../lib/demographics';
  import { fetchLiveResultsElectorates } from '../lib/results';
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

  // Prefetch all the datasets
  onMount(() => {
    fetchLiveResultsElectorates('2019');
    fetchLiveResultsElectorates('2022');
    fetchDemographicData('votecompass2');
    fetchDemographicData('geo');
    fetchDemographicData('education');
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

  @media (min-width: 96rem) {
    .wrapper {
      margin-right: 55%;
      max-width: 40vw;
    }
  }
</style>
