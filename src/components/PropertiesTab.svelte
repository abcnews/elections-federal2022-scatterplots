<script lang="ts">
  import Accordion from 'carbon-components-svelte/src/Accordion/Accordion.svelte';
  import AccordionItem from 'carbon-components-svelte/src/Accordion/AccordionItem.svelte';
  import Select from 'carbon-components-svelte/src/Select/Select.svelte';
  import SelectItem from 'carbon-components-svelte/src/Select/SelectItem.svelte';

  // import NumberInput from 'carbon-components-svelte/src/NumberInput/NumberInput.svelte';
  // import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';
  import Checkbox from 'carbon-components-svelte/src/Checkbox/Checkbox.svelte';
  // import Tile from 'carbon-components-svelte/src/Tile/Tile.svelte';

  import { fetchAbsData } from '../lib/abs';
  import { DATASETS, Y_AXIS_METHODS } from '../constants';

  import { getContext } from 'svelte';
  import type { Graph } from '../store';
  let graph = getContext<Graph>('graph');

  let datasetFields: string[] = [];
  $: {
    fetchAbsData($graph.dataset).then(demographics => {
      datasetFields = Object.keys(demographics[0] || {})
        .filter(d => d !== '' && d !== 'Total' && d !== 'Electorate');
    });
  }
</script>

<div>
  <Accordion>
    <AccordionItem title="Dataset Builder" open>
      <Select
        labelText="Dataset"
        selected={$graph.dataset}
        on:change={e => {
          if (e.detail !== $graph.dataset) {
            $graph.dataset = e.detail;
            $graph.targetField = null;
          }
        }}
      >
        {#each DATASETS as dataset}
          <SelectItem value={dataset.id} text={dataset.label} />
        {/each}
      </Select>

      <Select
        labelText="X Axis"
        bind:selected={$graph.targetField}
      >
        <SelectItem text="Not Selected" />
        {#each datasetFields as field}
          <SelectItem value={field} text={field} />
        {/each}
      </Select>

      <Select
        labelText="Y Axis"
        bind:selected={$graph.yAxisMethod}
      >
        {#each Y_AXIS_METHODS as method}
          <SelectItem value={method.id} text={method.label} />
        {/each}
      </Select>

      <Checkbox
        bind:checked={$graph.partyColours}
        labelText="Enable Party Colours"
      />
    </AccordionItem>
  </Accordion>
</div>

<style>
  :global(.bx--accordion__title) {
    font-weight: bold;
  }

  :global(.bx--checkbox-wrapper) {
    flex-direction: row;
  }

  :global(.bx--checkbox-label) {
    margin-left: 0.5rem;
  }

  :global(.bx--tile) {
    margin-bottom: 1rem;
  }

  :global(.bx--select) {
    margin-bottom: 1rem;
  }
</style>
