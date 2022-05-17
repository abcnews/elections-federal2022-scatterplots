<script lang="ts">
  import Accordion from 'carbon-components-svelte/src/Accordion/Accordion.svelte';
  import AccordionItem from 'carbon-components-svelte/src/Accordion/AccordionItem.svelte';
  import MultiSelect from 'carbon-components-svelte/src/MultiSelect/MultiSelect.svelte';
  import Select from 'carbon-components-svelte/src/Select/Select.svelte';
  import Select from 'carbon-components-svelte/src/Select/Select.svelte';
  import SelectItem from 'carbon-components-svelte/src/Select/SelectItem.svelte';

  import Checkbox from 'carbon-components-svelte/src/Checkbox/Checkbox.svelte';
  import NumberInput from 'carbon-components-svelte/src/NumberInput/NumberInput.svelte';
  // import Tile from 'carbon-components-svelte/src/Tile/Tile.svelte';
  import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';

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
    <AccordionItem title="General" open>
      <Select
        labelText="Dataset"
        selected={$graph.dataset}
        on:change={e => {
          if (e.detail !== $graph.dataset) {
            $graph.dataset = e.detail;
            $graph.xAxisFields = [];
            datasetFields = [];
          }
        }}
      >
        {#each DATASETS as dataset}
          <SelectItem value={dataset.id} text={dataset.label} />
        {/each}
      </Select>

      <MultiSelect
        titleText="X Axis Field Selection"
        selectedIds={$graph.xAxisFields}
        on:select={e => {
          $graph.xAxisFields = e.detail.selectedIds;
        }}
        disabled={datasetFields.length === 0}
        label={datasetFields.length === 0 ? 'Loading...' : ''}
        items={datasetFields.map(d => ({ id: d, text: d }))}
        sortItem={() => {}}
      />

      <TextInput
        bind:value={$graph.xAxisLabelOverride}
        labelText="X Axis Custom Label"
      />

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
      <Checkbox
        bind:checked={$graph.grid}
        labelText="Enable Grid"
      />
      <Checkbox
        bind:checked={$graph.xAxisInverse}
        labelText="Invert X Axis Selection"
      />
    </AccordionItem>

    <AccordionItem title="Trendline" open>
      <NumberInput
        min={2}
        max={10}
        step={1}
        bind:value={$graph.smoothingBandwidth}
        label="Smoothing"
      />
      <Checkbox
        bind:checked={$graph.trendline}
        labelText="Enable"
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
    margin-bottom: 0.5rem;
  }

  :global(.bx--multi-select) {
    margin-bottom: 1rem;
  }

  :global(.bx--text-input) {
    margin-bottom: 1rem;
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

  :global(.bx--number) {
    margin-bottom: 1rem;
  }
</style>
