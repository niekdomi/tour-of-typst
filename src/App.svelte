<script lang="ts">
  import Header from "./components/Header.svelte";
</script>

<div class="app">
  <Header />
  <div class="layout">
    <div class="left-panel">
      <section class="content"></section>
    </div>
    <div class="right-panel">
      <section class="editor"></section>
      <section class="preview"></section>
    </div>
  </div>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    flex: 1;
  }

  .right-panel {
    display: flex;
    flex-direction: column;
  }

  .editor,
  .preview {
    flex: 1;
    background-color: darkred;
  }

  .left-panel {
    background-color: darkblue;
  }
</style>
