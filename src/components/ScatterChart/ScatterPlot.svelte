<script lang="ts">
  import { extent, scaleLinear, scaleLog, line, min, max } from "d3";
  // import { fade } from 'svelte/transition';
  import Axis from "./Axis.svelte";
  import Hexagon from "./Hexagon.svelte";
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
  export let xZero: boolean;

  export let electorateHighlights: string[];

  export let grid: boolean;
  export let xAxisInverse: boolean;
  export let isLog: boolean;
  export let trendline: boolean;

  let mouseX, mouseY, selectedPoint;
  const onMouseOver = function(point, event) {
    selectedPoint = point;
    mouseX = event?.layerX;
    mouseY = event?.layerY;
  }

  $: labelOffsetY = -6;
  $: labelOffsetX = 5;
  $: isSwing = Y_AXIS_METHODS.find(m => m.id === yAxisMethod)?.isSwing || false;
  $: numTicks = Math.max(innerWidth / 100, 6);

  $: isZero = xLabel === ' ' || xLabel === '';

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
    } else if (isSwing) {
      yMin = Math.min(min(data, d => d.y), max(data, d => d.y) * -1) - 1;
      yMax = Math.max(max(data, d => d.y), min(data, d => d.y) * -1) + 1;
    } else if (!isSwing) {
      const negDiff = 50 - min(data, d => d.y);
      const posDiff = max(data, d => d.y) - 50;

      yMax = 50 + Math.max(posDiff, negDiff) + 1;
      yMin = 50 - Math.max(posDiff, negDiff) - 1;
    } else {
      yMin = 0;
      yMax = max(data, d => d.y) + 0.5;
    }
  }

  $: yScale = scaleLinear()
    .domain([yMin, yMax])
    .range([innerHeight, 0]);

  $: trendlinePath = trendline ? line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
        (calcSmoothedLine(data)) : '';

  $: selectedPointOnRight = mouseX > width * 0.8;
</script>

<main class="graphic">

  <svg {width} {height}>
    <g transform={`translate(${margin.left},${margin.top})`}>
      {#if (grid && data.length !== 0)}
        <Grid {innerWidth} isSwing={false} scale={xScale} position="bottom" />

        {#if yAxisMethod !== 'zero'}
          <Grid {innerWidth} {isSwing} scale={yScale} position="left" />
        {/if}
      {/if}

      {#if !xZero}
        <Axis {innerHeight} {innerWidth} {numTicks} {yAxisMethod} unit={xUnit} {isLog} scale={xScale} position="bottom" />
      {/if}
      <Axis {innerHeight} {innerWidth} {numTicks} {yAxisMethod} unit="%" isLog={false} scale={yScale} position="left" />

      {#if trendline}
        <path class="trendline" stroke="#737373" d={trendlinePath} />
      {/if}

      {#each data as point (point.electorate)}
        {#if electorateHighlights.indexOf(point.electorate) === -1 && point.y !== null && point.x !== null}
            <Hexagon
              x={xScale(point.x)}
              y={yScale(point.y)}
              colour={point.colour}
              stroke={point.colour}
              opacity={point.filtered ? 0.1 : 0.7}
              chartWidth={width}
              {point}
              {onMouseOver}
            />
        {/if}
      {/each}

      <!-- Put the highlighted points after the non-highlighted so they sit on top -->
      {#each data as point (point.electorate)}
        {#if electorateHighlights.indexOf(point.electorate) > -1}
          <Hexagon
            x={xScale(point.x)}
            y={yScale(point.y)}
            colour={point.colour}
            stroke={COLOURS.TEXT}
            strokeWidth={3}
            {point}
            {onMouseOver}
          />
        {/if}
      {/each}

      {#each data as point (point.electorate)}
        {#if electorateHighlights.indexOf(point.electorate) > -1}
          <g
            id={`${point.electorate}-label`}
            class="dot-label-wrapper"
            style={`transform: translate(${xScale(point.x) + labelOffsetX || 0}px, ${yScale(point.y) + labelOffsetY || 0}px)`}
          >
            <text class="dot-label"
              fill="black"
              x={0}
              y={0}
              text-anchor={isZero ? "left" : "middle"}
            >
              {point.electorate}
            </text>
          </g>
        {/if}
      {/each}

      <text style={`fill:${COLOURS.TEXT}`} class="axis-label-y" x={10} y={margin.top}>
        {yLabel}
      </text>
      {#if !xZero}
        <text style={`fill:${COLOURS.TEXT}`} class="axis-label-x" x={innerWidth - 5} y={innerHeight - 10}>
          {xLabel}
        </text>
      {/if}
    </g>
  </svg>

  {#if selectedPoint}
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
    max-height: 90vh;
  }

  .graphic > svg {
    margin-top: 0.75rem;
  }

  .dot-label {
    font-weight: 700;
    font-size: 12px;

    text-shadow: -1.25px -1.25px 0 #fff,
                  0      -1.25px 0 #fff,
                  1.25px -1.25px 0 #fff,
                  1.25px     0   0 #fff,
                  1.25px  1.25px 0 #fff,
                  0       1.25px 0 #fff,
                  -1.25px 1.25px 0 #fff,
                  -1.25px    0   0 #fff;

  }

  .dot-label-wrapper{
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
    stroke-width: 1px;
  }

  .axis-label-x {
    font-family: ABC Sans Nova, Helvetica, sans-serif;
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
    letter-spacing: 0em;
    text-anchor: end;
  }
  .axis-label-y {
    font-family: ABC Sans Nova, Helvetica, sans-serif;
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
    letter-spacing: 0em;
    text-anchor: start;
  }
</style>
