<script lang="ts" context="module">
  const MARKERS = [
    { label: 'Standalone graphic', prefix: 'scatter' },
    {
      label: 'Scrollyteller opener',
      note: `If you're placing multiple scrollytellers in a single story, each must have a unique NAME.`,
      prefix: 'scrollytellerNAMEuniqueGRAPHICscatter'
    },
    { label: 'Scrollyteller mark', prefix: 'mark' }
  ];
</script>

<script lang="ts">
  import { getContext } from 'svelte';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import CodeSnippet from 'carbon-components-svelte/src/CodeSnippet/CodeSnippet.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  // import HashtagIcon from 'carbon-icons-svelte/lib/Hashtag24/Hashtag24.svelte';

  import type { GraphStore } from '../store';
  import { alternatingCaseToPartialGraph, graphToAlternatingCase } from '../lib/encode';

  let graph = getContext<GraphStore>('graph');

  const importMarker = (marker: string) => {
    graph.updateMany(alternatingCaseToPartialGraph(marker));
  };

  $: alternatingCase = graphToAlternatingCase($graph);
  $: markersData = MARKERS.map(({ label, note, prefix }) => ({
    label,
    note,
    text: `#${prefix}${alternatingCase}`
  }));
</script>

    <!-- icon={HashtagIcon} -->
<div>
  <Button
    size="field"
    tooltipAlignment="end"
    on:click={() => {
      const marker = prompt('Paste a marker here to import its configuration');

      if (!marker || !marker.length) {
        return alert('No marker was provided');
      }

      importMarker(marker);
    }}
  >
    Import marker
  </Button>
  {#each markersData as { label, note, text }}
    <h4>{label}</h4>
    {#if note}
      <InlineNotification hideCloseButton kind="info" lowContrast subtitle={note} />
    {/if}
    <CodeSnippet type="single" code={text} />
  {/each}
</div>

<style>
  div :global(.bx--snippet--single) {
    height: auto;
  }

  div :global(pre) {
    white-space: initial;
  }

  div :global(code) {
    white-space: pre-wrap;
    word-break: break-all;
    overflow-wrap: break-word;
  }

  div :global(.bx--copy-btn) {
    height: 100%;
  }

  div :global(.bx--inline-notification) {
    max-width: unset !important;
  }
</style>