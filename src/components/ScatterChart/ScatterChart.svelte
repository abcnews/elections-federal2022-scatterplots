<script lang="ts">
  import { getContext } from 'svelte';
  import type { Graph } from '../store';
  import ScatterPlot from "./ScatterPlot.svelte";
  import { fetchAbsData } from '../../lib/abs';

  import { Y_AXIS_METHODS } from '../../constants';

  const calcScatterData = (results: any, demographics: any, targetField: string, yAxisMethod: string, partyColours: boolean) => {
    if (!results || !demographics) {
      return [];
    }

    const electorates = results.map((result) => {
      const demo = demographics.find((d) => d.Electorate === result.name);
      if (!demo || !targetField) {
        return null;
      }

      // const isSafe = result.predicted?.predictionString?.startsWith('SAFE');
      // Ignore electorates that haven't been called
      // if (!isSafe) {
      //   return null;
      // }

      const winningParty = result.leadingCandidate?.party.code;
      
      // From ABC Datawrapper colour palette
      const colourMap = {
        LIB: '#0A52BF',
        NAT: '#0A52BF',
        ALP: '#E11F30',
        GRN: '#51A802',
        OTH: '#757575',
      };
      const DEFAULT_COLOUR = '#007BC7';

      const val = {
        x: 100 * demo[targetField] / demo.Total,
        y: 0,
        electorate: result.name,
        colour: partyColours ? (colourMap[winningParty] || colourMap.OTH) : DEFAULT_COLOUR, 
      };
      
      if (yAxisMethod === 'margin') {
        val.y = parseFloat(result.margin);
      } else if (yAxisMethod === 'swing') {
        const coalitionRes = result.swingDial.find(p => p.contestantType === 'GOVERNMENT');

        // TODO: What do we do when there's no Gov candidate involved?
        if (!coalitionRes) {
          return null;
        }

        // positive means away from gov
        const swing = -1 * parseFloat(coalitionRes.predicted2CP.swing);
        val.y = swing;
      }

      return val;
    });

    return electorates.filter((e) => !!e);
  };

  let graph = getContext<Graph>('graph');
  // The election results from news-web
  export let results;

  let data = [];
  let demographics = [];

  let yLabel;
  $: yLabel = Y_AXIS_METHODS.find(method => method.id === $graph.yAxisMethod)?.label || '';

  $: {
    fetchAbsData($graph.dataset).then(d => {
      demographics = d;
    });
  }
  $: data = calcScatterData(results, demographics, $graph.targetField, $graph.yAxisMethod, $graph.partyColours);
</script>

<ScatterPlot
  xLabel={$graph.targetField || 'No target field selected'}
  yLabel={yLabel}
  data={data}
  trendline={$graph.trendline}
  smoothingBandwidth={$graph.smoothingBandwidth}
/>
