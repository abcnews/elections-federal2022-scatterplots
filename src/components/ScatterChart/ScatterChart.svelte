<script lang="ts">
  import { getContext } from 'svelte';
  import type { GraphStore } from '../../store';

  import { fetchDemographicData } from '../../lib/demographics';
  import { fetchLiveResultsElectorates } from '../../lib/results';
  import { calcScatterData, determineXAxisLabel, determineYAxisLabel } from '../../lib/model';
  import { DATASETS } from '../../constants';

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
    fetchDemographicData($graph.dataset).then(d => {
      demographics = d;
    });
  }
  $: data = calcScatterData(results, demographics, $graph.xAxisFields, $graph.yAxisMethod, $graph.partyColours, $graph.xAxisInverse, $graph.heldByFilters, $graph.closenessFilters, $graph.geoFilters);

  //
  // Graph Labels
  //
  $: xLabel = determineXAxisLabel($graph);
  $: yLabel = determineYAxisLabel($graph);
  $: sourceLabel = DATASETS.find(d => d.id === $graph.dataset)?.sourceLabel ? `, ${DATASETS.find(d => d.id === $graph.dataset)?.sourceLabel}` : '';
  $: author = $graph.chartAuthor ? `Chart: ${$graph.chartAuthor} / ` : '';
</script>

<div bind:clientWidth={width} class={`wrapper ${isDarkMode ? 'dark' : ''}`}>
  {#if $graph.chartTitle}
    <h1 class="scatter-title">{$graph.chartTitle}</h1>
  {/if}
  {#if $graph.chartDescription}
    <p class="scatter-desc">{$graph.chartDescription}</p>
  {/if}

  {#if $graph.partyColours}
    <Legend {isDarkMode} />
  {/if}

  <ScatterPlot
    {width}
    {xLabel}
    {yLabel}
    {data}
    xUnit={$graph.xAxisUnitOverride === null ? DATASETS.find(d => d.id === $graph.dataset)?.unit || "" : $graph.xAxisUnitOverride} 
    isLog={$graph.xAxisUseLog}

    grid={$graph.grid}
    trendline={$graph.trendlineEnabled}
    trendlineMethod={$graph.trendlineMethod}
    smoothingBandwidth={$graph.smoothingBandwidth}

    isDarkMode={isDarkMode}
    electorateHighlights={$graph.electorateHighlights}
  />

  {#if $graph.chartNotes}
    <p class="chart-notes">{$graph.chartNotes}</p>
  {/if}

  <p class="data-source">
    {author}Source: <a href="https://www.abc.net.au/news/elections/federal-election-2022/">AEC/ABC</a>{sourceLabel}
  </p>
</div>


<style>
  .wrapper {
    width: 100%;
  }
  .wrapper.dark {
    width: 100%;
    background: black;
  }
  .wrapper.dark {
    width: 100%;
    background: black;
    color: white;
  }

  .scatter-title {
    font-weight: 900;
    font-size: 1.2rem;
  }

  .scatter-desc {
    font-size: 1rem;
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

  .chart-notes {
    font-style: italic;
    font-weight: 400;
    font-size: 13px;
    line-height: 18px;
  }

</style>
