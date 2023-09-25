<script lang="ts">
  import { setContext, onMount } from 'svelte';
  import Scrollyteller from '@abcnews/svelte-scrollyteller';

  import { createGraphStore } from '../store';

  import { fetchDemographicData } from '../lib/demographics';
  import { fetchErads, fetchLiveReferendumResults } from '../lib/results';
  import { actoObjectToPartialGraph } from '../lib/encode';
  import ScatterChart from './ScatterChart/ScatterChart.svelte';

  // Initialise with default state
  const graph = createGraphStore({});
  export let scrollyData: any;
  export let isOdyssey: boolean;

  // Setup room state
  setContext('graph', graph);

  // Pass markers into the room state
  let updateState = ((state: any) => {
    graph.updateMany(actoObjectToPartialGraph(state));
  });

  // Prefetch all the datasets used in the scrollyteller sections
  onMount(() => {
    fetchErads('2019');
    fetchErads('2022');
    fetchLiveReferendumResults();
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
      <ScatterChart isScrolly={true} {isOdyssey} />
    </div>
  </Scrollyteller>
{/if}


<style>
  .wrapper {
    margin: 0 auto;
    padding: 1rem 0 0;
    width: calc(100% - 2rem);
    max-width: 40rem;

    /* margin: 3rem auto; */
    /* padding: 1rem; */
    /* max-width: 50rem; */
    /* position: relative; */
    /* top: 40%; */
    /* -webkit-transform: translateY(-50%); */
    /* -ms-transform: translateY(-50%); */
    /* transform: translateY(-50%); */
  }

  @media (min-width: 76rem) {
    .wrapper {
      padding: 7.5vw 0 0;
      margin-left: calc(35% - 24.75rem) !important;
      width: 49.5rem !important;
    }
  }
</style>
