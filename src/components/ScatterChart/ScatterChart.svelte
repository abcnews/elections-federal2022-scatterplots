<script lang="ts">
  import { getContext } from 'svelte';
  import type { Graph } from '../store';
  import ScatterPlot from "./ScatterPlot.svelte";
  import { fetchAbsData } from '../../lib/abs';
  import { calcScatterData, determineXAxisLabel } from '../../lib/model';

  import { Y_AXIS_METHODS, PARTY_COLOURS, FOCUS_ORANGE, DATASETS, RESULTS_SOURCE_LABEL } from '../../constants';

  // The election results from news-web
  export let results;

  let data = [];
  let demographics = [];
  let graph = getContext<Graph>('graph');

  //
  // Data Fetching / Calcs
  //
  $: {
    fetchAbsData($graph.dataset).then(d => {
      demographics = d;
    });
  }
  $: data = calcScatterData(results, demographics, $graph.xAxisFields, $graph.yAxisMethod, $graph.partyColours, $graph.xAxisInverse, $graph.heldByFilters, $graph.closenessFilters, $graph.categoryFilters);

  //
  // Graph Labels
  //
  $: xLabel = determineXAxisLabel($graph);
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
  xLabel={xLabel}
  yLabel={yLabel}
  data={data}

  grid={$graph.grid}
  trendline={$graph.trendline}
  trendlineColour={$graph.partyColours ? 'black' : 'black'}
  smoothingBandwidth={$graph.smoothingBandwidth}

  electorateHighlights={$graph.electorateHighlights}
/>

<p class="data-source">
  Source: {DATASETS.find(d => d.id === $graph.dataset)?.sourceLabel}, {RESULTS_SOURCE_LABEL}
</p>


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

  .data-source {
    align-items: center;
    color: #888;
    display: flex;
    font-size: 12px;
    font-style: italic;
    font-weight: 400;
    justify-content: space-between;
    line-height: 18px;
    text-decoration: none;
  }

</style>
