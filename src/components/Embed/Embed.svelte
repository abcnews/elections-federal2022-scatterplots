<script lang="ts">
  import ScatterChart from '../ScatterChart/ScatterChart.svelte';
  import { createGraphStore } from '../../store';
  import { setContext } from 'svelte';

  export let graphData;

  const graph = createGraphStore(graphData);
  setContext('graph', graph);

</script>

<ScatterChart isScrolly={false} />
