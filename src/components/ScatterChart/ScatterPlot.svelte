<script lang="ts">
  import { extent, scaleLinear, sum, range, min, max, line } from "d3";
  import Axis from "./Axis.svelte";

  const margin = { top: 15, bottom: 50, left: 50, right: 20 };
  const width = 700;
  const height = 600;

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  export let xLabel: string;
  export let yLabel: string;
  export let trendline: boolean;
  export let smoothingBandwidth: number | undefined;
  export let data: any;

  // https://bl.ocks.org/rpgove/073d6cb996d7de1d52935790139c4240
  const gaussian = (target: number, source: number, bandwidth: number) => {
    return Math.exp(-Math.pow(target - source, 2) / (2*bandwidth*bandwidth));
  };

  // Compute estimated value at each target x coordinate using the
  // source particles (the samples).
  const calcSmoothedLine = (data, bandwidth: number) => {
    const targets = range(min(data, s => s.x), max(data, s => s.x), 0.5);
    return targets.map(x => {
      const numerator = sum(data, s => gaussian(s.x, x, bandwidth) * s.y);
      const denominator = sum(data, s => gaussian(s.x, x, bandwidth));

      return {
        x,
        y: numerator / denominator
      };
    });
  };

  $: smoothedData = calcSmoothedLine(data, smoothingBandwidth || 4);

  $: xScale = scaleLinear()
    .domain(extent(data, (d) => d.x))
    .range([0, innerWidth]);

  $: yScale = scaleLinear()
    .domain(extent(data, (d) => d.y))
    .range([innerHeight, 0]);

  $: trendlinePath = line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
        (smoothedData);

  $: console.log(min(data, d => d.y));
  $: console.log(yScale(max(data, d => d.y)));
  $: console.log(yScale(min(data, d => d.y)));
  $: {
    data.map(d => {
      if (d.y > 9) {
        console.log(d, yScale(d.y));
      }
    });
  }
</script>

<main>
  <svg {width} {height}>
    <g transform={`translate(${margin.left},${margin.top})`}>
      <Axis {innerHeight} scale={xScale} position="bottom" />
      <Axis {innerHeight} scale={yScale} position="left" />

      <text transform={`translate(${-30},${innerHeight / 2}) rotate(-90)`}>
        {yLabel} (%)
      </text>
      <text x={innerWidth / 3} y={innerHeight + 35}>
        {xLabel} (% of electorate)
      </text>

      {#if trendline}
        <path class="trendline" d={trendlinePath} />
      {/if}
      
      {#each data as point, i}
        <circle
          class="scatter-dot"k
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
    stroke: #E52A00;
    stroke-width: 3px;
  }
</style>
