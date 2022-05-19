<script lang="ts">
  import { getContext } from 'svelte';
  import type { GraphStore } from '../../store';

  import { fetchAbsData } from '../../lib/abs';
  import { fetchLiveResultsElectorates } from '../../lib/results';
  import { calcScatterData, determineXAxisLabel } from '../../lib/model';
  import { Y_AXIS_METHODS, DATASETS } from '../../constants';

  import ScatterPlot from "./ScatterPlot.svelte";
  import Legend from "./Legend.svelte";

  let graph = getContext<GraphStore>('graph');
  let data = [];
  let demographics = [];
  let results;

  // Set responsively to the width of the div the chart is placed in
  let width: number;

  const parentUrl =
    window.location !== window.parent.location
      ? document.referrer
      : document.location.href;

  const newsWebDarkMode = parentUrl?.includes("newsapp") &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  $: isDarkMode = newsWebDarkMode || $graph.darkModePreview;

  //
  // Data Fetching / Calcs
  //
  $: {
    fetchLiveResultsElectorates($graph.resultsYear).then(r => {
      results = r;
    });
  }
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
  $: sourceLabel = DATASETS.find(d => d.id === $graph.dataset)?.sourceLabel ? `, ${DATASETS.find(d => d.id === $graph.dataset)?.sourceLabel}` : '';
  $: author = $graph.chartAuthor ? `Chart: ${$graph.chartAuthor} / ` : '';
</script>

<div bind:clientWidth={width} class="wrapper">
  {#if $graph.title}
    <h4 class="scatter-title">{$graph.title}</h4>
  {/if}
  {#if $graph.description}
    <p class="scatter-desc">{$graph.description}</p>
  {/if}

  {#if $graph.partyColours}
    <Legend {isDarkMode} />
  {/if}

  <ScatterPlot
    {width}
    {xLabel}
    {yLabel}
    {data}
    xUnit={DATASETS.find(d => d.id === $graph.dataset)?.unit || ''}
    isLog={$graph.xAxisUseLog}

    grid={$graph.grid}
    trendline={$graph.trendlineEnabled}
    smoothingBandwidth={$graph.smoothingBandwidth}

    isDarkMode={isDarkMode}
    electorateHighlights={$graph.electorateHighlights}
  />

  <p class="data-source">
    {author}Source: <a href="https://www.abc.net.au/news/elections/federal-election-2022/">AEC/ABC</a>{sourceLabel}
  </p>
</div>


<style>
  .wrapper {
    width: 100%;
    margin: 0.5rem;
  }

  .scatter-title {
    font-weight: 900;
    font-size: 18px;
  }

  .scatter-desc {
    font-size: 16px;
    line-height: 24px;
  }

  .data-source {
    align-items: center;
    color: #888;
    font-size: 12px;
    font-style: italic;
    font-weight: 400;
    justify-content: space-between;
    line-height: 18px;
    text-decoration: none;
  }

</style>
