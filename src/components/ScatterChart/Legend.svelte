<script lang="ts">
  import { COLOURS } from '../../constants';

  export let isDarkMode: boolean;
</script>

<div class="scatter-key">
  <svg viewBox="0 0 20 20">
    <circle stroke={COLOURS(isDarkMode).PARTIES.LIB} fill={COLOURS(isDarkMode).PARTIES.LIB} cx="10" cy="10" r="8"/>
  </svg>
  <span style={`color:${COLOURS(isDarkMode).PARTY_LABELS.LIB}`}>Liberal</span>

  <svg viewBox="0 0 20 20">
    <circle stroke={COLOURS(isDarkMode).PARTIES.ALP} fill={COLOURS(isDarkMode).PARTIES.ALP} cx="10" cy="10" r="8"/>
  </svg>
  <span style={`color:${COLOURS(isDarkMode).PARTY_LABELS.ALP}`}>Labor</span>

  <svg viewBox="0 0 20 20">
    <circle stroke={COLOURS(isDarkMode).PARTIES.GRN} fill={COLOURS(isDarkMode).PARTIES.GRN} cx="10" cy="10" r="8"/>
  </svg>
  <span style={`color:${COLOURS(isDarkMode).PARTY_LABELS.GRN}`}>Greens</span>

  <svg viewBox="0 0 20 20">
    <circle stroke={COLOURS(isDarkMode).PARTIES.NAT} fill={COLOURS(isDarkMode).PARTIES.NAT} cx="10" cy="10" r="8"/>
  </svg>
  <span style={`color:${COLOURS(isDarkMode).PARTY_LABELS.NAT}`}>Nats / LNP</span>

  <svg viewBox="0 0 20 20">
    <circle stroke={COLOURS(isDarkMode).PARTIES.OTH} fill={COLOURS(isDarkMode).PARTIES.OTH} cx="10" cy="10" r="8"/>
  </svg>
  <span style={`color:${COLOURS(isDarkMode).PARTY_LABELS.OTH}`}>Others</span>
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
