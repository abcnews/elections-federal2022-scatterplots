<script lang="ts">
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
  import { fade } from 'svelte/transition';

  export let x: number;
  export let y: number;
  export let colour: string;
  export let stroke: string | undefined;
  export let strokeWidth = 1.5;
  export let opacity = 0.7;
  export let chartWidth;

  export let point;
  export let onMouseOver: any = () => ({});

  $: scaleMultiplier = chartWidth > 600 ? 0.7 : 0.55;
  let scaleMultiplier;
  $: {
    if (chartWidth > 900) {
      scaleMultiplier = 0.9;
    } else if (chartWidth > 600) {
      scaleMultiplier = 0.7;
    } else {
      scaleMultiplier = 0.55;
    }
  }
</script>

<g
  class="hex"
  transform={`
    translate(${x - 5}, ${y - 5}) scale(${scaleMultiplier})
  `}
>
  <path
    role="figure"

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

  /* @media screen and (min-width: 600px) { */
  /*   .hex { */
  /*     transform: scale(1); */
  /*   } */
  /* } */
</style>
