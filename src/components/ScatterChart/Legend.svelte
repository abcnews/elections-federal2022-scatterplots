<script lang="ts">
  import { COLOURS } from '../../constants';
</script>

<div class="scatter-key">
  <svg viewBox="0 0 20 20">
    <circle stroke={COLOURS.PARTIES.LIB} fill={COLOURS.PARTIES.LIB} cx="10" cy="10" r="8"/>
  </svg>
  <span style={`color:${COLOURS.PARTY_LABELS.LIB}`}>Liberal/National</span>

  <svg viewBox="0 0 20 20">
    <circle stroke={COLOURS.PARTIES.ALP} fill={COLOURS.PARTIES.ALP} cx="10" cy="10" r="8"/>
  </svg>
  <span style={`color:${COLOURS.PARTY_LABELS.ALP}`}>Labor</span>

  <svg viewBox="0 0 20 20">
    <circle stroke={COLOURS.PARTIES.GRN} fill={COLOURS.PARTIES.GRN} cx="10" cy="10" r="8"/>
  </svg>
  <span style={`color:${COLOURS.PARTY_LABELS.GRN}`}>Greens</span>

  <svg viewBox="0 0 20 20">
    <circle stroke={COLOURS.PARTIES.OTH} fill={COLOURS.PARTIES.OTH} cx="10" cy="10" r="8"/>
  </svg>
  <span style={`color:${COLOURS.PARTY_LABELS.OTH}`}>Others</span>
</div>

<style>
  .scatter-key > svg {
    width: 0.75em;
    height: 0.75em;
  }
  .scatter-key > svg > circle {
    stroke-width: 2px;
    fill-opacity: 0.6;
  }
  .scatter-key > span {
    padding-right: 0.5em;
  }

  .scatter-key {
    font-family: ABCSans, Helvetica, sans-serif;
    font-size: 12px;
    font-weight: 700;
    line-height: 13px;
    letter-spacing: 0em;
    text-align: left;

    position: absolute;
    top: -5px;
  }
</style>
