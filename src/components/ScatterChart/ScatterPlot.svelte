<script lang="ts">
  import { extent, scaleLinear, scaleLog, line } from "d3";
  import Axis from "./Axis.svelte";
  import Grid from "./Grid.svelte";
  import { COLOURS } from '../../constants';
  import { calcSmoothedLine } from '../../lib/model';

  const margin = { top: 15, bottom: 25, left: 35, right: 15 };

  // Responsively sized dimensions
  export let width: number;
  $: height = width;
  $: innerHeight = height - margin.top - margin.bottom;
  $: innerWidth = width - margin.left - margin.right;

  export let xLabel: string;
  export let yLabel: string;
  export let trendline: boolean;
  export let grid: boolean;
  export let smoothingBandwidth: number;
  export let electorateHighlights: string[];
  export let xUnit: string;
  export let isDarkMode: boolean;
  export let data: any;
  export let isLog: boolean;

  let selectedPoint;
  let mouseX, mouseY;

  const setMousePosition = function(event) {
    mouseX = event.layerX;
    mouseY = event.layerY;
  }

  $: xScale = (isLog ? scaleLog() : scaleLinear())
    .domain(extent(data, (d) => d.x))
    .range([0, innerWidth]);

  $: yScale = scaleLinear()
    .domain(extent(data, (d) => d.y))
    .range([innerHeight, 0]);

  $: trendlinePath = line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
        (calcSmoothedLine(data, smoothingBandwidth))

  $: numTicks = innerWidth / 60;
</script>

<main class="graphic">

  <svg {width} {height}>
    <g transform={`translate(${margin.left},${margin.top})`}>
      {#if (grid && data.length !== 0)}
        <Grid {innerHeight} {numTicks} {innerWidth} {isDarkMode} scale={xScale} position="bottom" />
        <Grid {innerHeight} {numTicks} {innerWidth} {isDarkMode} scale={yScale} position="left" />
      {/if}
      <Axis {innerHeight} {numTicks} {isDarkMode} unit={xUnit} {isLog} scale={xScale} position="bottom" />
      <Axis {innerHeight} {numTicks} {isDarkMode} unit="%" isLog={false} scale={yScale} position="left" />

      {#if trendline}
        <path class="trendline" stroke={COLOURS(isDarkMode).TEXT} d={trendlinePath} />
      {/if}

      {#each data as point}
        {#if electorateHighlights.indexOf(point.electorate) === -1}
          <circle
            class="scatter-dot"
            cx={xScale(point.x)}
            cy={yScale(point.y)}
            r="3"
            color={point.colour(isDarkMode)}
            stroke={point.colour(isDarkMode)}
            data-electorate={point.electorate}
            on:mouseover={(event) => {selectedPoint = point; setMousePosition(event)}}
            on:mouseout={() => {selectedPoint = undefined;}}
            on:blur={() => ({})}
            on:focus={() => ({})}
          />
        {/if}
      {/each}

      <!-- Put the highlighted points after the non-highlighted so they sit on top -->
      {#each data as point}
        {#if electorateHighlights.indexOf(point.electorate) > -1}
          <circle
            class="scatter-dot highlight"
            cx={xScale(point.x)}
            cy={yScale(point.y)}
            r="3"
            color={point.colour(isDarkMode)}
            stroke={COLOURS(isDarkMode).TEXT}
            data-electorate={point.electorate}
            on:mouseover={(event) => {selectedPoint = point; setMousePosition(event)}}
            on:mouseout={() => {selectedPoint = undefined;}}
            on:blur={() => ({})}
            on:focus={() => ({})}
          />
        {/if}
      {/each}

      {#each data as point}
        {#if electorateHighlights.indexOf(point.electorate) > -1}
          <text class="dot-label" style={`fill:${point.labelColour(isDarkMode)}; stroke:${COLOURS(isDarkMode).BG}`} x={xScale(point.x)} y={yScale(point.y) - 10} text-anchor="middle">
            {point.electorate}
          </text>
        {/if}
      {/each}

      <text style={`fill:${COLOURS(isDarkMode).TEXT}`} class="axis-label-y" x={10} y={margin.top}>
        {yLabel}
      </text>
      <text style={`fill:${COLOURS(isDarkMode).TEXT}`} class="axis-label-x" x={innerWidth - 5} y={innerHeight - 10}>
        {xLabel}
      </text>
    </g>
  </svg>

  {#if selectedPoint != undefined}
    <div class="tooltip" style="left: {mouseX + 10}px; top: {mouseY - 10}px">
      {selectedPoint.electorate}
    </div>
  {/if}

</main>


<style>
  .graphic {
    position: relative;
  }

  .scatter-dot {
    fill: currentColor;
    fill-opacity: 0.6;
    stroke-width: 1.5px;
  }
  .scatter-dot.highlight {
    stroke-width: 2px;
  }

  .dot-label {
    font-weight: 700;
    font-size: 12px;

    fill-opacity: 1;
    stroke-opacity: 0.75;
    stroke-width: 2px;
    paint-order: stroke;
  }

  .tooltip {
    font-size: 12px;
    background: rgba(237, 240, 242, 0.9);
    box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.05);
    position: absolute;
    padding: 0.5rem;
    z-index: 9999;
  }

  .trendline {
    fill: none;
    stroke-width: 3px;
  }

  .axis-label-x {
    text-anchor: end;
    font-weight: 700;
    font-size: 14px;
  }
  .axis-label-y {
    text-anchor: start;
    font-weight: 700;
    font-size: 14px;
  }
</style>
