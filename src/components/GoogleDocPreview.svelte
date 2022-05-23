<script lang="ts">
  import { loadGoogleDocAsScrollyTeller } from '../lib/loadGoogleDocScrollyTeller';
  import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';
  import ScrollyWrapper from './ScrollyWrapper.svelte';

  const URL_LOCALSTORAGE_KEY = 'last-successfully-loaded-google-doc-url';

  let googleDocUrl = localStorage.getItem(URL_LOCALSTORAGE_KEY) || '';

  let scrollyData;
  let introPars = [];

  const updateDoc = async (url: string) => {
    localStorage.setItem(URL_LOCALSTORAGE_KEY, url);

    if (!url) {
      introPars = [];
      scrollyData = null;
      return;
    }
    try {
      const { intro, scrollytellerDefinition } = await loadGoogleDocAsScrollyTeller(url, {});
      if (scrollytellerDefinition) {
        introPars = intro;
        scrollyData = scrollytellerDefinition;
      } else {
        introPars = [];
        scrollyData = null;
      }
    } catch (e) {
      introPars = [];
      scrollyData = null;
    }
  };

  $: updateDoc(googleDocUrl);

</script>

<div class="google-doc-input">
  <TextInput labelText="Google Doc URL" bind:value={googleDocUrl} />
</div>

{#if scrollyData}
  {#each introPars as par, i}
    <p class={i === 0 ? "first u-dropcap" : ""}>{par}</p>
  {/each}

  <div class="u-full">
    <ScrollyWrapper scrollyData={scrollyData} />
  </div>
{:else}
    <p class="FormatCredit">
      SELECT A GOOGLE DOC TO PREVIEW
    </p>
{/if}

<style>
  .FormatCredit {
    padding-top: 150px;
    padding-bottom: 150px;
    text-align: center;
  }
  .google-doc-input {
    padding: 1rem;
    background: rgba(179,179,179,.7);
  }
</style>
