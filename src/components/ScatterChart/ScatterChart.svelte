<script lang="ts">
  import { getContext } from 'svelte';
  import type { GraphStore } from '../../store';

  import { fetchDemographicData } from '../../lib/demographics';
  import { fetchLiveResultsElectorates } from '../../lib/results';
  import { calcPearsonsCorrelation } from '../../lib/pearson';
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

  // const parentUrl =
  //   window.location !== window.parent.location
  //     ? document.referrer
  //     : document.location.href;

  //
  // Data Fetching / Calcs
  //
  $: {
    fetchLiveResultsElectorates($graph.resultsYear).then(r => {
      results = r;
    });
  }
  let fetching = false;
  $: {
    fetching = true;
    fetchDemographicData($graph.resultsYear, $graph.dataset).then(d => {
      fetching = false;
      demographics = d;
    });
  }

  $: {
    if (!fetching) {
      data = calcScatterData(
        results,
        $graph.resultsYear,
        demographics, 
        $graph.xAxisFields,
        $graph.yAxisMethod,
        $graph.colourBy,
        $graph.onlyCalledElectorates,
        $graph.electorateHighlights,
        {
          heldByFilters: $graph.heldByFilters,
          closenessFilters: $graph.closenessFilters,
          geoFilters: $graph.geoFilters,
          stateFilters: $graph.stateFilters,
        }
      );
    }
  }

  //
  // Graph Labels
  //
  $: xLabel = determineXAxisLabel($graph.xAxisLabelOverride, $graph.xAxisFields);
  $: yLabel = determineYAxisLabel($graph.yAxisLabelOverride, $graph.yAxisMethod);
  $: sourceLabel = DATASETS.find(d => d.id === $graph.dataset)?.sourceLabel ? `, ${DATASETS.find(d => d.id === $graph.dataset)?.sourceLabel}` : '';
  $: author = $graph.chartAuthor ? `Chart: ${$graph.chartAuthor} / ` : '';
  $: xZero = $graph.xAxisFields[0] === 'zero' || $graph.xAxisFields[0] === 'ranked';
</script>

{#if $graph.chartTitle}
  <h1 class="scatter-title">{$graph.chartTitle}</h1>
{/if}
{#if $graph.chartDescription}
  <p class="scatter-desc">{$graph.chartDescription}</p>
{/if}

<div bind:clientWidth={width} class={'wrapper'}>

  <ScatterPlot
    {width}
    {xLabel}
    {yLabel}
    {data}

    {xZero}
    xUnit={$graph.xAxisUnitOverride === null ? DATASETS.find(d => d.id === $graph.dataset)?.unit || "" : $graph.xAxisUnitOverride} 
    xAxisInverse={$graph.xAxisInverse}
    isLog={$graph.xAxisUseLog}
    yAxisMethod={$graph.yAxisMethod}

    grid={$graph.grid}
    trendline={$graph.trendlineEnabled}

    electorateHighlights={$graph.electorateHighlights}
  />

  {#if $graph.chartNotes}
    <p class="chart-notes">{$graph.chartNotes}</p>
  {/if}

  {#if $graph.showSource}
    <p class="data-source">
      {author}Source: <a href="https://www.abc.net.au/news/elections/federal-election-2022/">AEC/ABC</a>{sourceLabel}
    </p>
  {/if}

  {#if $graph.colourBy === 'party' || $graph.colourBy === 'result' || $graph.colourBy === 'state-result'}
    <Legend variant={$graph.colourBy} />
  {/if}
</div>

{#if $graph.pearsonCoefficientPreview && $graph.xAxisFields.length > 0}
  <p class="preview-text">[PREVIEW ONLY] Pearson coefficient: {calcPearsonsCorrelation(data)}</p>
{/if}

<style>
  .wrapper {
    font-family: var(--dls-font-stack-sans);
    width: 100%;
    margin-top: 0.5rem;
  }

  .scatter-title {
    font-family: ABCSansBold, ABCSans, Helvetica, sans-serif;
    font-weight: 900;
    font-size: 1.2rem;
  }

  .scatter-desc {
    font-family: var(--dls-font-stack-sans);
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

  .preview-text {
    font-weight: 700;
  }

</style>
