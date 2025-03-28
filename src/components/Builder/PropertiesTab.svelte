<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    MultiSelect,
    Select,
    SelectItem,
    Checkbox,
    NumberInput,
    TextInput
  } from 'carbon-components-svelte';

  import { fetchDemographicData } from '../../lib/demographics';
  import { determineXAxisLabel } from '../../lib/model';
  import { DATASETS, Y_AXIS_METHODS, COLOUR_METHODS, ELECTORATE_GEO, ELECTORATE_CLOSENESS, ELECTORATE_HELD_BY, HIGHLIGHT_OPTS } from '../../constants';

  import { getContext } from 'svelte';
  import type { GraphStore } from '../store';
  let graph = getContext<GraphStore>('graph');

  let datasetFields: string[] = [];
  $: {
    fetchDemographicData($graph.resultsYear, $graph.dataset).then(demographics => {
      datasetFields = Object.keys(demographics[0] || {})
        .filter(d => d !== '' && d !== 'Total' && d !== 'Electorate');
    });
  }

</script>

<div>
  <Accordion>
    <AccordionItem title="Data" open>
      <Select
        labelText="Election year"
        bind:selected={$graph.resultsYear}
      >
        <SelectItem value="2022" text="2022" />
        <SelectItem value="2025" text="2025" />
      </Select>
      <Select
        labelText="Y Axis Metric"
        bind:selected={$graph.yAxisMethod}
      >
        {#each Y_AXIS_METHODS as method}
          <SelectItem value={method.id} text={method.label} />
        {/each}
      </Select>

      <Select
        labelText="Dataset"
        selected={$graph.dataset}
        onchange={e => {
          const { value } = e.target;
          if (value !== $graph.dataset) {
            $graph.dataset = value;
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

      {#if DATASETS.find(d => d.id === $graph.dataset)?.canCombine}
        <MultiSelect
          titleText="X Axis Metric"
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
          onchange={e => {
            const { value } = e.target;
            if (value && value !== $graph.xAxisFields[0]) {
              $graph.xAxisFields = [value];
            } else if (value === '' && $graph.xAxisFields[0]) {
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

      <MultiSelect
        titleText="Labelled Electorates"
        filterable
        bind:selectedIds={$graph.electorateHighlights}
        items={HIGHLIGHT_OPTS.map(d => ({ id: d, text: d}))}
        sortItem={() => {}}
      />

      <Select
        labelText="Colour By"
        bind:selected={$graph.colourBy}
      >
        {#each COLOUR_METHODS as method}
          <SelectItem value={method.id} text={method.label} />
        {/each}
      </Select>

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
      <TextInput
        bind:value={$graph.yAxisLabelOverride}
        labelText="Y Axis Label"
      />

      <TextInput
        bind:value={$graph.xAxisLabelOverride}
        labelText="X Axis Label"
        invalid={
          $graph.xAxisFields.length > 0 &&
          determineXAxisLabel($graph.xAxisLabelOverride, $graph.xAxisFields) === 'X Axis Label Override Needed!'
        }
        invalidText="Required"
      />

      <TextInput
        bind:value={$graph.xAxisUnitOverride}
        labelText="X Axis Unit"
      />

      <Checkbox
        bind:checked={$graph.xAxisUseLog}
        labelText="X Axis Log Scale"
      />

      <Checkbox
        bind:checked={$graph.xAxisInverse}
        labelText="Reverse X Axis"
      />
      <Checkbox
        bind:checked={$graph.grid}
        labelText="Enable Grid"
      />
      <Checkbox
        bind:checked={$graph.trendlineEnabled}
        labelText="Enable Trendline"
      />
      <Checkbox
        bind:checked={$graph.showSource}
        labelText="Show Data Source"
      />

      <Checkbox
        bind:checked={$graph.pearsonCoefficientPreview}
        labelText="Pearson Coefficient Preview"
      />
    </AccordionItem>

    <AccordionItem title="Filters">
      <MultiSelect
        titleText="Geo Category"
        bind:selectedIds={$graph.geoFilters}
        items={ELECTORATE_GEO.map(d => ({ id: d, text: d }))}
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

      <Checkbox
        bind:checked={$graph.onlyCalledElectorates}
        labelText="Only show electorates that have been called"
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
