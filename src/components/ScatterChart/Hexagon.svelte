<script lang="ts">
  // import { fade } from 'svelte/transition';

  export let x: number;
  export let y: number;
  export let colour: string;
  export let stroke: string | undefined;
  export let strokeWidth = 1.5;
  export let opacity = 0.7;

  export let point;
  export let onMouseOver: any = () => ({});
</script>

<g
  class="hex"
  transform={`translate(${x - 5}, ${y - 5}) scale(0.55)`}
>
  <path

    on:mouseover={(event) => onMouseOver(point, event)}
    on:mouseout={() => onMouseOver(null, null)}
    on:blur={() => ({})}
    on:focus={() => ({})}

    class="scatter-hex"
    d="M0.303711 13.5V4.5L8.10771 0L15.9117 4.5V13.5L8.10771 18L0.303711 13.5Z"
    fill={colour}
    stroke={stroke || colour}
    stroke-width={strokeWidth || 1.5}
    fill-opacity={opacity || 0.7}
    stroke-opacity={opacity || 1}
  />
</g>

<style>
  .hex {
    transition-property: transform;
    transition-duration: 2s;
  }
</style>
