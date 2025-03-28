<script lang="ts">
  export let value;
  export let labelText;
  export let items = [];
</script>

<div class="fieldset">
  <label>
    <span>{label}</span>
    <select name="layout" bind:value={value}>
      {#each items as item}
        <option value={item.id}>{item.label}</option>
      {/each}
    </select>
  </label>
</div>
