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
      <Axis {innerHeight} {numTicks} {isDarkMode} unit={xUnit} scale={xScale} position="bottom" />
      <Axis {innerHeight} {numTicks} {isDarkMode} unit="%" scale={yScale} position="left" />

      <text style={`color:${COLOURS(isDarkMode).TEXT}`} class="axis-label-y" x={5} y={margin.top}>
        {yLabel}
      </text>
      <text style={`color:${COLOURS(isDarkMode).TEXT}`} class="axis-label-x" x={innerWidth - 5} y={innerHeight - 5}>
        {xLabel}
      </text>

      {#if trendline}
        <path class="trendline" stroke={'black'} d={trendlinePath} />
      {/if}
      
      {#each data as point}
        <circle
          class="scatter-dot"
          cx={xScale(point.x)}
          cy={yScale(point.y)}
          r="3"
          color={point.colour}
          stroke={electorateHighlights.indexOf(point.electorate) > -1 ? 'black' : point.colour}
          data-electorate={point.electorate}
          on:mouseover={(event) => {selectedPoint = point; setMousePosition(event)}}
          on:mouseout={() => {selectedPoint = undefined;}}
          on:blur={() => ({})}
          on:focus={() => ({})}
        />
      {/each}

      {#each data as point}
        {#if electorateHighlights.indexOf(point.electorate) > -1}
          <text class="dot-label" x={xScale(point.x)} y={yScale(point.y) - 10} text-anchor="middle">
            {point.electorate}
          </text>
        {/if}
      {/each}
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

  .dot-label {
    font-weight: 700;
    font-size: 13px;

    fill: black;
    fill-opacity: 1;
    stroke: white;
    stroke-opacity: 0.75;
    stroke-width: 2px;
    paint-order: stroke;
  }

  .tooltip {
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
    font-size: 13px;
  }
  .axis-label-y {
    text-anchor: start;
    font-weight: 700;
    font-size: 13px;
  }
</style>
