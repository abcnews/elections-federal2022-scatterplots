<script lang="ts">
  import { select } from "d3-selection";
  import { axisBottom, axisLeft } from "d3-axis";
  import { COLOURS } from '../../constants';

  export let innerHeight: number;
  export let innerWidth: number;
  export let position: "bottom" | "left";
  export let isDarkMode: boolean;
  export let scale;

  let transform: string;
  let g;

  $: {
    select(g).selectAll("*").remove();
    let grid;
    switch (position) {
      case "bottom":
        grid = axisBottom(scale).tickSize(-1 * innerHeight).tickFormat("");
        transform = `translate(0, ${innerHeight})`;
        break;
      case "left":
        grid = axisLeft(scale).tickSize(-1 * innerWidth).tickFormat("");
        transform = `translate(0, 0)`;
    }
    select(g).call(grid).attr('color', COLOURS(isDarkMode).GRID);
  }
</script>

<g class="grid" bind:this={g} {transform} />
