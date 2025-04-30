<script lang="ts">
  import { COLOURS } from '../../constants';
  import Hexagon from './Hexagon.svelte';

  export let variant: string;

  const OFFSET_Y = 7;
  const OFFSET_X = 5;
  const SCALE = 1.6;
</script>

<div class="scatter-key">

  {#if variant === 'result' || variant === 'state-result'}
    <svg viewBox="0 0 20 20">
      <g transform="translate(-{OFFSET_X}, -{OFFSET_Y}) scale({SCALE})">
        <Hexagon strokeWidth={0.1} colour={COLOURS.YES} x={10} y={10} />
      </g>
    </svg>
    <span>Yes</span>

    <svg viewBox="0 0 20 20">
      <g transform="translate(-{OFFSET_X}, -{OFFSET_Y}) scale({SCALE})">
        <Hexagon strokeWidth={0.1} colour={COLOURS.NO} x={10} y={10} />
      </g>
    </svg>
    <span>No</span>

  {/if}

  {#if variant === 'party'}
    <svg viewBox="0 0 20 20">
      <g transform="translate(-{OFFSET_X}, -{OFFSET_Y}) scale({SCALE})">
        <Hexagon strokeWidth={0.1} colour={COLOURS.PARTIES.LIB} x={10} y={10} />
      </g>
    </svg>
    <span>Lib / Nat</span>

    <svg viewBox="0 0 20 20">
      <g transform="translate(-{OFFSET_X}, -{OFFSET_Y}) scale({SCALE})">
        <Hexagon strokeWidth={0.1} colour={COLOURS.PARTIES.ALP} x={10} y={10} />
      </g>
    </svg>
    <span>Labor</span>

    <svg viewBox="0 0 20 20">
      <g transform="translate(-{OFFSET_X}, -{OFFSET_Y}) scale({SCALE})">
        <Hexagon strokeWidth={0.1} colour={COLOURS.PARTIES.GRN} x={10} y={10} />
      </g>
    </svg>
    <span>Greens</span>

    <svg viewBox="0 0 20 20">
      <g transform="translate(-{OFFSET_X}, -{OFFSET_Y}) scale({SCALE})">
        <Hexagon strokeWidth={0.1} colour={COLOURS.PARTIES.OTH} x={10} y={10} />
      </g>
    </svg>
    <span>Others</span>
  {/if}

</div>

<style>
  .scatter-key > svg {
    width: 1.5em;
    height: 1.5em;
    margin: 5px;
  }
  .scatter-key > span {
    padding-right: 0.5em;
  }

  .scatter-key {
    font-family: var(--dls-font-stack-sans);
    color: #4D4D4D;
    font-size: 12px;
    font-weight: 400;
    line-height: 19px;
    letter-spacing: 0em;

    position: absolute;
    /* bottom: -50px; */

    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media (min-width: 72rem) {
    .scatter-key {
      font-size: 14px;
    }
  }
</style>
