<script lang="ts">
  import { getContext } from 'svelte';
  import type { Graph } from '../store';
  import ScatterPlot from "./ScatterPlot.svelte";
  import { fetchAbsData } from '../../lib/abs';
  import { calcScatterData } from '../../lib/model';

  import { Y_AXIS_METHODS, PARTY_COLOURS, FOCUS_ORANGE } from '../../constants';

  // The election results from news-web
  export let results;

  let data = [];
  let demographics = [];
  let graph = getContext<Graph>('graph');

  $: {
    fetchAbsData($graph.dataset).then(d => {
      demographics = d;
    });
  }
  $: data = calcScatterData(results, demographics, $graph.targetField, $graph.yAxisMethod, $graph.partyColours);
  $: yLabel = Y_AXIS_METHODS.find(method => method.id === $graph.yAxisMethod)?.label || '';
</script>

{#if $graph.partyColours}
  <div class="scatter-key">
    <svg viewBox="0 0 20 20">
      <circle stroke={PARTY_COLOURS.LIB} fill={PARTY_COLOURS.LIB} cx="10" cy="10" r="8"/>
    </svg>
    <span>Liberal/National</span>

    <svg viewBox="0 0 20 20">
      <circle stroke={PARTY_COLOURS.ALP} fill={PARTY_COLOURS.ALP} cx="10" cy="10" r="8"/>
    </svg>
    <span>Labor</span>

    <svg viewBox="0 0 20 20">
      <circle stroke={PARTY_COLOURS.GRN} fill={PARTY_COLOURS.GRN} cx="10" cy="10" r="8"/>
    </svg>
    <span>Greens</span>

    <svg viewBox="0 0 20 20">
      <circle stroke={PARTY_COLOURS.OTH} fill={PARTY_COLOURS.OTH} cx="10" cy="10" r="8"/>
    </svg>
    <span>Others</span>
  </div>
{/if}

<ScatterPlot
  xLabel={$graph.targetField || 'No target field selected'}
  yLabel={yLabel}
  data={data}

  grid={$graph.grid}
  trendline={$graph.trendline}
  trendlineColour={$graph.partyColours ? 'black' : 'black'}
  smoothingBandwidth={$graph.smoothingBandwidth}
/>

<style>
  .scatter-key > svg {
    width: 0.75em;
    height: 0.75em;
  }
  .scatter-key > svg > circle {
    stroke-width: 2px;
    fill-opacity: 0.6;
  }
  .scatter-key > span {
    padding-right: 0.5em;
  }

  .scatter-key {
    font-family: ABC Sans Nova;
    font-size: 12px;
    font-weight: 700;
    line-height: 13px;
    letter-spacing: 0em;
    text-align: left;
  }

</style>
