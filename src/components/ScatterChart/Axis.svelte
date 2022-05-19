<script lang="ts">
  import { select } from "d3-selection";
  import { axisBottom, axisLeft } from "d3-axis";
  import { COLOURS } from '../../constants';

  export let innerHeight: number;
  export let position: "bottom" | "left";
  export let isDarkMode: boolean;
  export let unit: string;
  export let scale;
  export let numTicks: number;

  let transform: string;
  let g;

  $: {
    select(g).selectAll("*").remove();
    let axis;
    switch (position) {
      case "bottom":
        axis = axisBottom(scale).ticks(numTicks).tickSize(0).tickFormat(t => `${t}${unit || ''}`);
        transform = `translate(0, ${innerHeight})`;
        break;
      case "left":
        axis = axisLeft(scale).ticks(numTicks).tickSize(0).tickFormat(t => `${t}${unit || ''}`);
        transform = `translate(0, 0)`;
    }
    select(g).call(axis).attr('color', COLOURS(isDarkMode).AXIS);
  }
</script>

<g class={`axis ${position}`} bind:this={g} {transform} />

<style>
  :global(.tick > text) {
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    padding-top: 0.5rem;
  }

  :global(.axis.bottom > .tick > text) {
    transform: translate(0, 4px);
  }
</style>
