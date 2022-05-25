<script lang="ts">
  import ScatterChart from '../ScatterChart/ScatterChart.svelte';
  import { createGraphStore } from '../../store';
  import { setContext } from 'svelte';

  export let graphData;
  export let isOdyssey: boolean;

  const graph = createGraphStore(graphData);
  setContext('graph', graph);

</script>

<ScatterChart isScrolly={false} {isOdyssey} />
