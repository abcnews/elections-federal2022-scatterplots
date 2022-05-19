<script lang="ts">
  import { extent, scaleLinear, scaleLog, line } from "d3";
  import Axis from "./Axis.svelte";
  import Grid from "./Grid.svelte";
  import { COLOURS } from '../../constants';
  import { calcSmoothedLine } from '../../lib/model';

  const margin = { top: 15, bottom: 50, left: 50, right: 20 };

  // Responsively sized dimensions
  export let width: number;
  $: height = width * 0.8;
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
    mouseX = event.clientX;
    mouseY = event.clientY;
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
</script>

<main>

  <svg {width} {height}>
    <g transform={`translate(${margin.left},${margin.top})`}>
      {#if (grid && data.length !== 0)}
        <Grid {innerHeight} {innerWidth} {isDarkMode} scale={xScale} position="bottom" />
        <Grid {innerHeight} {innerWidth} {isDarkMode} scale={yScale} position="left" />
      {/if}
      <Axis {innerHeight} {isDarkMode} unit={xUnit} scale={xScale} position="bottom" />
      <Axis {innerHeight} {isDarkMode} unit="%" scale={yScale} position="left" />

      <text style={`color:${COLOURS(isDarkMode).TEXT}`} class="axis-label" transform={`translate(${-30},${innerHeight / 2}) rotate(-90)`}>
        {yLabel}
      </text>
      <text style={`color:${COLOURS(isDarkMode).TEXT}`} class="axis-label" x={innerWidth / 2} y={innerHeight + 35}>
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
          r="4"
          color={electorateHighlights.indexOf(point.electorate) > -1 ? 'black' : point.colour}
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
  .scatter-dot {
    fill: currentColor;
    fill-opacity: 0.6;
    stroke: currentColor;
  }

  .dot-label {
    font-weight: 700;
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

  .axis-label {
    text-anchor: middle;
    font-weight: 700;
  }
</style>
