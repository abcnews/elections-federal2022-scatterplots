<script lang="ts">
  import { select } from "d3-selection";
  import { axisBottom, axisLeft } from "d3-axis";
  import { COLOURS } from '../../constants';

  export let innerHeight: number;
  export let innerWidth: number;
  export let position: "bottom" | "left";
  export let isDarkMode: boolean;
  export let scale;
  export let numTicks: number;

  let transform: string;
  let g;

  $: {
    select(g).selectAll("*").remove();
    let grid;
    switch (position) {
      case "bottom":
        grid = axisBottom(scale).ticks(numTicks).tickSize(-1 * innerHeight).tickSizeOuter(0).tickFormat("");
        transform = `translate(0, ${innerHeight})`;
        break;
      case "left":
        grid = axisLeft(scale).ticks(numTicks).tickSize(-1 * innerWidth).tickSizeOuter(0).tickFormat("");
        transform = `translate(0, 0)`;
    }
    select(g)
      .call(grid)
      .attr('color', COLOURS(isDarkMode).GRID);
  }
</script>

<g class="grid" bind:this={g} {transform} />

<!-- emphasize the 0% gridline on the y-axis -->
{#if position === 'left'}
  <g class="tick origin" opacity="1" transform={`translate(0,${scale(0)})`}>
    <line stroke={COLOURS(isDarkMode).AXIS} x2={innerWidth}></line>
  </g>
{/if}
