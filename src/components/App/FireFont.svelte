<script lang="ts">
  let { children } = $props();
</script>

<span class="fire-font">
  {@render children()}
</span>

<style lang="scss">
  /**
   * Firefox-only: translate the font by a pixel because font rendering is
   * technically correct, but looks jank.
   */
  @supports (image-rendering: -moz-crisp-edges) {
    .fire-font {
      translate: 0 1px;
    }
  }
</style>
