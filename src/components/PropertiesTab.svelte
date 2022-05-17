<script lang="ts">
  import Accordion from 'carbon-components-svelte/src/Accordion/Accordion.svelte';
  import AccordionItem from 'carbon-components-svelte/src/Accordion/AccordionItem.svelte';
  import MultiSelect from 'carbon-components-svelte/src/MultiSelect/MultiSelect.svelte';
  import Select from 'carbon-components-svelte/src/Select/Select.svelte';
  import SelectItem from 'carbon-components-svelte/src/Select/SelectItem.svelte';

  import Checkbox from 'carbon-components-svelte/src/Checkbox/Checkbox.svelte';
  import NumberInput from 'carbon-components-svelte/src/NumberInput/NumberInput.svelte';
  import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';

  import { fetchAbsData } from '../lib/abs';
  import { determineXAxisLabel } from '../lib/model';
  import { DATASETS, Y_AXIS_METHODS } from '../constants';
  import ELECTORATES from '../electorate_categories.json';

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

  let ELECTORATE_CATEGORIES = [
    'Inner Metro',
    'Outer Metro',
    'Regional Seats',
    'Rural',
  ];
  let ELECTORATE_CLOSENESS = [
    'Marginal',
    'Safe',
    'Very Safe',
  ];
  let ELECTORATE_HELD_BY = [
    'Liberal',
    'Labor',
  ];
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
        bind:selectedIds={$graph.xAxisFields}
        disabled={datasetFields.length === 0}
        label={datasetFields.length === 0 ? 'Loading...' : ''}
        items={datasetFields.map(d => ({ id: d, text: d }))}
        invalid={datasetFields.length > 0 && $graph.xAxisFields.length === 0}
        invalidText="Required"
        sortItem={() => {}}
      />

      <TextInput
        bind:value={$graph.xAxisLabelOverride}
        labelText="X Axis Custom Label"
        invalid={datasetFields.length > 0 && $graph.xAxisFields.length > 0 && determineXAxisLabel($graph) === 'X Axis Label Override Needed!'}
        invalidText="Required"
      />

      <Select
        labelText="Y Axis"
        bind:selected={$graph.yAxisMethod}
      >
        {#each Y_AXIS_METHODS as method}
          <SelectItem value={method.id} text={method.label} />
        {/each}
      </Select>

      <MultiSelect
        titleText="Highlight Electorates"
        filterable
        bind:selectedIds={$graph.electorateHighlights}
        items={ELECTORATES.map(d => ({ id: d.Electorate, text: d.Electorate }))}
        sortItem={() => {}}
      />

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

    <AccordionItem title="Filters" open>
      <MultiSelect
        titleText="Geo Category"
        bind:selectedIds={$graph.categoryFilters}
        items={ELECTORATE_CATEGORIES.map(d => ({ id: d, text: d }))}
        sortItem={() => {}}
      />

      <MultiSelect
        titleText="Held By"
        bind:selectedIds={$graph.heldByFilters}
        items={ELECTORATE_HELD_BY.map(d => ({ id: d, text: d }))}
        sortItem={() => {}}
      />

      <MultiSelect
        titleText="Closeness"
        bind:selectedIds={$graph.closenessFilters}
        items={ELECTORATE_CLOSENESS.map(d => ({ id: d, text: d }))}
        sortItem={() => {}}
      />
    </AccordionItem>
    <AccordionItem title="Trendline">
      <NumberInput
        min={1}
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

  :global(.bx--multi-select__wrapper) {
    margin-bottom: 1rem;
  }

  :global(.bx--text-input-wrapper) {
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
