<script lang="ts">
  import { select } from "d3-selection";
  import { axisBottom, axisLeft } from "d3-axis";
  import { COLOURS } from '../../constants';

  export let isDarkMode: boolean;
  export let isLog: boolean;
  export let isSwing: boolean;

  export let innerWidth: number;
  export let innerHeight: number;
  export let position: "bottom" | "left";
  export let unit: string;
  export let scale;
  export let numTicks: number;
  export let yAxisMethod: string;

  let transform: string;
  let g;

  const LOG_SCALE = [
    10,
    100,
    1000,
  ];

  $: {
    if (yAxisMethod !== 'zero' || position === 'bottom') {
      let axis;
      switch (position) {
        case "bottom":
          axis = axisBottom(scale).ticks(numTicks).tickSize(0).tickFormat(t => {
            if (isLog && LOG_SCALE.indexOf(t) === -1) {
              return '';
            }
            // Avoid 0.5, 1.5, 2.5 on campaign visits chart
            if (Math.round(t) !== t) {
              return '';
            }
            return `${t}${unit || ''}`;
          });
          transform = `translate(0, ${innerHeight})`;
          select(g).transition().duration(1000).call(axis).attr('color', COLOURS(isDarkMode).AXIS);
          break;
        case "left":
          axis = axisLeft(scale).ticks(numTicks).tickSize(0).tickFormat(t => {
            // Add + to positive vote change
            if (t > 0 && isSwing) {
              return `+${t}${unit || ''}`;
            }
            return `${t}${unit || ''}`;
          });
          transform = `translate(0, 0)`;
          select(g).transition().duration(1000).call(axis).attr('color', COLOURS(isDarkMode).AXIS);
      }
    }
  }
</script>

{#if yAxisMethod !== 'zero' || position === 'bottom'}
  <g class={`axis ${position}`} bind:this={g} {transform} >

    <!-- Duplicate the bottom axis so it doesn't rotate on x-axis inversion --> 
    {#if position === 'bottom'}
      <path class="static-axis" stroke="currentColor" d="M{innerWidth},0.5H0.5"></path>
    {/if}
  </g>
{/if}

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
