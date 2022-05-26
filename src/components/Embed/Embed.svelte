<script lang="ts">
  import ScatterChart from '../ScatterChart/ScatterChart.svelte';
  import { createGraphStore } from '../../store';
  import { setContext } from 'svelte';

  export let graphData;
  export let isOdyssey: boolean;

  const graph = createGraphStore(graphData);
  setContext('graph', graph);

</script>

<div class="scatter-embed">
  <ScatterChart isScrolly={false} {isOdyssey} />
</div>

<style>
  .scatter-embed {
    padding-left: 14px;
    padding-right: 14px;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
</style>
