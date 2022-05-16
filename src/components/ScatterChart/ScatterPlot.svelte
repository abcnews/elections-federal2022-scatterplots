<script lang="ts">
  import { extent, scaleLinear } from "d3";
  import Axis from "./Axis.svelte";

  const margin = { top: 15, bottom: 50, left: 50, right: 20 };
  const width = 900;
  const height = 600;

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  export let xLabel;
  export let yLabel;
  export let data;

  $: xScale = scaleLinear()
    .domain(extent(data, (d) => d.x))
    .range([0, innerWidth]);

  $: yScale = scaleLinear()
    .domain(extent(data, (d) => d.y))
    .range([innerHeight, 0]);
</script>

<main>
  <svg {width} {height}>
    <g transform={`translate(${margin.left},${margin.top})`}>
      <Axis {innerHeight} scale={xScale} position="bottom" />
      <Axis {innerHeight} scale={yScale} position="left" />

      <text transform={`translate(${-30},${innerHeight / 2}) rotate(-90)`}>
        {yLabel} (%)
      </text>
      <text x={innerWidth / 2} y={innerHeight + 35}>
        {xLabel} (% of electorate)
      </text>

      {#each data as point, i}
        <circle
          cx={xScale(point.x)}
          cy={yScale(point.y)}
          r="5"
          style={`fill:${point.colour || 'red'}`}
        />
      {/each}
    </g>
  </svg>
</main>
