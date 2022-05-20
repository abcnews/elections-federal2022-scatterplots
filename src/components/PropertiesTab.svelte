<script lang="ts">
  import Accordion from 'carbon-components-svelte/src/Accordion/Accordion.svelte';
  import AccordionItem from 'carbon-components-svelte/src/Accordion/AccordionItem.svelte';
  import MultiSelect from 'carbon-components-svelte/src/MultiSelect/MultiSelect.svelte';
  import Select from 'carbon-components-svelte/src/Select/Select.svelte';
  import SelectItem from 'carbon-components-svelte/src/Select/SelectItem.svelte';

  import Checkbox from 'carbon-components-svelte/src/Checkbox/Checkbox.svelte';
  import NumberInput from 'carbon-components-svelte/src/NumberInput/NumberInput.svelte';
  import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';

  import { fetchDemographicData } from '../lib/demographics';
  import { determineXAxisLabel } from '../lib/model';
  import { DATASETS, Y_AXIS_METHODS } from '../constants';
  import ELECTORATES from '../electorate_categories.json';

  import { getContext } from 'svelte';
  import type { Graph } from '../store';
  let graph = getContext<Graph>('graph');

  let datasetFields: string[] = [];
  $: {
    fetchDemographicData($graph.dataset).then(demographics => {
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
    <AccordionItem title="Data" open>
      <Select
        labelText="Results"
        bind:selected={$graph.resultsYear}
      >
        <SelectItem value="2019local" text="2019 (dev)" />
        <SelectItem value="2019" text="2019" />
        <SelectItem value="2022" text="2022" />
      </Select>

      <Select
        labelText="Dataset"
        selected={$graph.dataset}
        on:change={e => {
          if (e.detail !== $graph.dataset) {
            $graph.dataset = e.detail;
            $graph.xAxisFields = [];
            $graph.xAxisLabelOverride = '';
            datasetFields = [];
          }
        }}
      >
        {#each DATASETS as dataset}
          <SelectItem value={dataset.id} text={dataset.label} />
        {/each}
      </Select>

      <MultiSelect
        titleText="Labelled Electorates"
        filterable
        bind:selectedIds={$graph.electorateHighlights}
        items={ELECTORATES.map(d => ({ id: d.Electorate, text: d.Electorate }))}
        sortItem={() => {}}
      />

    </AccordionItem>

    <AccordionItem title="Axes" open>
      <Select
        labelText="Y Axis"
        bind:selected={$graph.yAxisMethod}
      >
        {#each Y_AXIS_METHODS as method}
          <SelectItem value={method.id} text={method.label} />
        {/each}
      </Select>

      <TextInput
        bind:value={$graph.yAxisLabelOverride}
        labelText="Y Axis Custom Label"
      />

      {#if DATASETS.find(d => d.id === $graph.dataset)?.canCombine}
        <MultiSelect
          titleText="X Axis"
          bind:selectedIds={$graph.xAxisFields}
          disabled={datasetFields.length === 0}
          label={datasetFields.length === 0 ? 'Loading...' : ''}
          items={datasetFields.map(d => ({ id: d, text: d }))}
          invalid={datasetFields.length > 0 && $graph.xAxisFields.length === 0}
          invalidText="Required"
          sortItem={() => {}}
        />
      {:else}
        <Select
          labelText="X Axis"
          selected={$graph.xAxisFields[0]}
          disabled={datasetFields.length === 0}
          invalid={datasetFields.length > 0 && !$graph.xAxisFields[0]}
          on:change={e => {
            if (e.detail && e.detail !== $graph.xAxisFields[0]) {
              $graph.xAxisFields = [e.detail];
          } else if (e.detail === '' && $graph.xAxisFields[0]) {
              $graph.xAxisFields = [];
            }
          }}
        >
          <SelectItem text={datasetFields.length === 0 ? 'Loading...' : 'None'} />
          {#each datasetFields as field}
            <SelectItem value={field} text={field} />
          {/each}
        </Select>
      {/if}

      <TextInput
        bind:value={$graph.xAxisLabelOverride}
        labelText="X Axis Custom Label"
        invalid={datasetFields.length > 0 && $graph.xAxisFields.length > 0 && determineXAxisLabel($graph) === 'X Axis Label Override Needed!'}
        invalidText="Required"
      />

      <TextInput
        bind:value={$graph.xAxisUnitOverride}
        labelText="X Axis Unit"
      />


      <Checkbox
        checked={$graph.xAxisUseLog}
        labelText="X Axis Log Scale"
        on:check={() => {
          $graph.xAxisUseLog = !$graph.xAxisUseLog;

          // Auto update the trendline to suit the axis to avoid accidentally using the wrong one
          if ($graph.xAxisUseLog) {
            $graph.trendlineMethod = 'log';
          } else {
            $graph.trendlineMethod = 'linear';
          }
        }}
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

    <AccordionItem title="General" open>
      <TextInput
        bind:value={$graph.chartTitle}
        labelText="Chart Title"
      />
      <TextInput
        bind:value={$graph.chartDescription}
        labelText="Chart Description"
      />
      <TextInput
        bind:value={$graph.chartAuthor}
        labelText="Chart Author"
      />
      <TextInput
        bind:value={$graph.chartNotes}
        labelText="Chart Notes"
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
        bind:checked={$graph.darkModePreview}
        labelText="Dark Mode Preview"
      />
    </AccordionItem>

    <AccordionItem title="Trendline">
      <Checkbox
        bind:checked={$graph.trendlineEnabled}
        labelText="Enable"
      />

      <Select
        labelText="Method"
        bind:selected={$graph.trendlineMethod}
      >
        <SelectItem value="linear" text="Linear Regression" />
        <SelectItem value="log" text="Logarithmic Regression" />
        <SelectItem value="gaussian" text="Gaussian Smoothing" />
      </Select>

      <NumberInput
        min={1}
        max={10}
        step={1}
        bind:value={$graph.smoothingBandwidth}
        label="Gaussian Smoothing"
        disabled={$graph.trendlineMethod !== 'gaussian'}
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
