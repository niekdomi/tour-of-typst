<div class="layout">
  <div class="left-panel">
    <section class="content"></section>
  </div>
  <div class="right-panel">
    <section class="editor"></section>
    <section class="preview"></section>
  </div>
</div>

<style>
  .layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 100vh;
  }

  :right-panel {
    display: flex;
    flex-direction: column;
  }

  .editor,
  .preview {
    flex: 1;
    background: red;
  }

  .left-panel {
    background: blue;
  }
</style>
