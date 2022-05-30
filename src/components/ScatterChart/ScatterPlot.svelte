<script lang="ts">
  import { extent, scaleLinear, scaleLog, line, min, max } from "d3";
  import Axis from "./Axis.svelte";
  import Grid from "./Grid.svelte";
  import { COLOURS, MOBILE_BREAKPOINT, Y_AXIS_METHODS } from '../../constants';
  import { calcSmoothedLine } from '../../lib/model';

  const margin = { top: 15, bottom: 25, left: 35, right: 35 };

  // Responsively sized dimensions (1:1 on mobile, 2:3 on desktop)
  export let width: number;

  $: height = width > MOBILE_BREAKPOINT ? width * 2/3 : width;
  $: innerHeight = height - margin.top - margin.bottom;
  $: innerWidth = width - margin.left - margin.right;

  export let data: any;
  export let yAxisMethod: string;

  export let xLabel: string;
  export let yLabel: string;
  export let xUnit: string;

  export let trendlineMethod: string;
  export let smoothingBandwidth: number;
  export let electorateHighlights: string[];

  export let grid: boolean;
  export let xAxisInverse: boolean;
  export let isDarkMode: boolean;
  export let isLog: boolean;
  export let trendline: boolean;
  export let isScrolly: boolean;

  let selectedPoint;
  let mouseX, mouseY;

  const setMousePosition = function(event) {
    mouseX = event.layerX;
    mouseY = event.layerY;
  }

  $: isSwing = Y_AXIS_METHODS.find(m => m.id === yAxisMethod)?.isSwing || false;
  $: numTicks = Math.max(innerWidth / 100, 6);

  $: xScale = (isLog ? scaleLog() : scaleLinear())
    .domain(extent(data, (d) => d.x))
    .range(xAxisInverse ? [innerWidth, 0] : [0, innerWidth]);

  // Ensure that the 0% or 50% line is always in the middle
  let yMin: number;
  let yMax: number;
  $: {
    if (yAxisMethod === 'zero') {
      yMin = 0;
      yMax = 0;
    } else if (isSwing && isScrolly) {
      yMin = Math.min(min(data, d => d.y), max(data, d => d.y) * -1) - 5;
      yMax = Math.max(max(data, d => d.y), min(data, d => d.y) * -1) + 5;
    } else if (!isSwing && isScrolly) {
      const negDiff = 50 - min(data, d => d.y);
      const posDiff = max(data, d => d.y) - 50;

      yMax = 50 + Math.max(posDiff, negDiff) + 5;
      yMin = 50 - Math.max(posDiff, negDiff) - 5;
    } else {
      yMin = min(data, d => d.y) - 5;
      yMax = max(data, d => d.y) + 5;
    }
  }

  $: yScale = scaleLinear()
    .domain([yMin, yMax])
    .range([innerHeight, 0]);

  $: trendlinePath = trendline ? line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
        (calcSmoothedLine(data, smoothingBandwidth, trendlineMethod)) : '';

  $: selectedPointOnRight = mouseX > width * 0.8;
</script>

<main class="graphic">

  <svg {width} {height}>
    <g transform={`translate(${margin.left},${margin.top})`}>
      {#if (grid && data.length !== 0)}
        <Grid {innerHeight} {numTicks} {innerWidth} {isDarkMode} isSwing={false} scale={xScale} position="bottom" />
        {#if yAxisMethod !== 'zero'}
          <Grid {innerHeight} {numTicks} {innerWidth} {isDarkMode} {isSwing} scale={yScale} position="left" />
        {/if}
      {/if}

      <Axis {innerHeight} {innerWidth} {numTicks} {yAxisMethod} {isDarkMode} isSwing={false} unit={xUnit} {isLog} scale={xScale} position="bottom" />
      <Axis {innerHeight} {innerWidth} {numTicks} {yAxisMethod} {isDarkMode} {isSwing} unit="%" isLog={false} scale={yScale} position="left" />

      {#if trendline}
        <path class="trendline" stroke={COLOURS(isDarkMode).TEXT} d={trendlinePath} />
      {/if}

      {#each data as point (point.electorate)}
        {#if electorateHighlights.indexOf(point.electorate) === -1 && point.y !== null && point.x !== null}
            <circle
              id={point.electorate}
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
      {#each data as point (point.electorate)}
        {#if electorateHighlights.indexOf(point.electorate) > -1}
          <circle
            id={point.electorate}
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

      {#each data as point (point.electorate)}
        {#if electorateHighlights.indexOf(point.electorate) > -1}
          <text class="dot-label"
            id={`${point.electorate}-label`}
            style={`fill:${point.labelColour(isDarkMode)}; stroke:${COLOURS(isDarkMode).BG}; transform: translate(${xScale(point.x) || 0}px, ${yScale(point.y) - 10 || 0}px)`}
            x={0}
            y={0}
            text-anchor="middle"
          >
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
    <!-- align the tooltip to the left of mouse when near the right side of the chart -->
      <div
        class="tooltip"
        style="left: {mouseX + 10}px; top: {mouseY - 10}px; transform: translateX(-{selectedPointOnRight ? 120 : 0}%)"
      >
        {selectedPoint.electorate}
      </div>
  {/if}

</main>


<style>
  .graphic {
    position: relative;
  }

  .graphic > svg {
    margin-top: 0.75rem;
  }

  .scatter-dot {
    fill: currentColor;
    fill-opacity: 0.6;
    stroke-width: 1.5px;

    transition-property: cx, cy;
    transition-duration: 2s;
  }
  .scatter-dot.highlight {
    stroke-width: 2px;
    /* Ensure that the dots animate with their labels */
    /* transition-property: cx, cy; */
  }

  .dot-label {
    font-weight: 700;
    font-size: 12px;

    fill-opacity: 1;
    stroke-opacity: 0.9;
    stroke-width: 4px;
    paint-order: stroke;

    transition-property: transform;
    transition-duration: 2s;
  }

  .tooltip {
    color: black;
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
    font-size: 14px;
  }
  .axis-label-y {
    text-anchor: start;
    font-size: 14px;
  }
</style>
