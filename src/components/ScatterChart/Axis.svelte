<script lang="ts">
  import { select } from "d3-selection";
  import { axisBottom, axisLeft } from "d3-axis";
  import { COLOURS } from '../../constants';

  export let innerHeight: number;
  export let position: "bottom" | "left";
  export let isDarkMode: boolean;
  export let scale;

  let transform: string;
  let g;

  $: {
    select(g).selectAll("*").remove();
    let axis;
    switch (position) {
      case "bottom":
        axis = axisBottom(scale).tickSizeOuter(0);
        transform = `translate(0, ${innerHeight})`;
        break;
      case "left":
        axis = axisLeft(scale).tickSizeOuter(0);
        transform = `translate(0, 0)`;
    }
    select(g).call(axis).attr('color', COLOURS(isDarkMode).AXIS);
  }
</script>

<g class="axis" bind:this={g} {transform} />
