<script lang="ts">
  import { extent, scaleLinear, line } from "d3";
  import Axis from "./Axis.svelte";
  import Grid from "./Grid.svelte";
  import { calcSmoothedLine } from '../../lib/model';

  const margin = { top: 15, bottom: 50, left: 50, right: 20 };
  const width = 700;
  const height = 600;

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  export let xLabel: string;
  export let yLabel: string;
  export let trendline: boolean;
  export let grid: boolean;
  export let smoothingBandwidth: number;
  export let trendlineColour: string;
  export let data: any;

  $: xScale = scaleLinear()
    .domain(extent(data, (d) => d.x))
    .range([0, innerWidth]);

  $: yScale = scaleLinear()
    .domain(extent(data, (d) => d.y))
    .range([innerHeight, 0]);

  $: trendlinePath = line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
        (calcSmoothedLine(data, smoothingBandwidth));
</script>

<main>
  <svg {width} {height}>
    <g transform={`translate(${margin.left},${margin.top})`}>
      {#if grid}
        <Grid {innerHeight} {innerWidth} scale={xScale} position="bottom" />
        <Grid {innerHeight} {innerWidth} scale={yScale} position="left" />
      {/if}
      <Axis {innerHeight} scale={xScale} position="bottom" />
      <Axis {innerHeight} scale={yScale} position="left" />

      <text class="axis-label" transform={`translate(${-30},${innerHeight / 2}) rotate(-90)`}>
        {yLabel} (%)
      </text>
      <text class="axis-label" x={innerWidth / 2} y={innerHeight + 35}>
        {xLabel} (% of electorate)
      </text>

      {#if trendline}
        <path class="trendline" stroke={trendlineColour} d={trendlinePath} />
      {/if}
      
      {#each data as point}
        <circle
          class="scatter-dot"
          cx={xScale(point.x)}
          cy={yScale(point.y)}
          r="4"
          color={point.colour}
        />
      {/each}
    </g>
  </svg>
</main>

<style>
  .scatter-dot {
    fill: currentColor;
    fill-opacity: 0.6;
    stroke: currentColor;
  }

  .trendline {
    fill: none;
    stroke-width: 3px;
  }

  .axis-label {
    text-anchor: middle;
  }
</style>
