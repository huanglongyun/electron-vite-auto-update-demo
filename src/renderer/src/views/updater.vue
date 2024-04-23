<template>
  <div>updater</div>
</template>

<script setup lang="ts">
console.log('html')
window.electron.ipcRenderer.on('hide-loading-show-main', () => {
  console.log('html-updater')
  window.electron.ipcRenderer.invoke('render-to-main')
})
</script>

<style scoped></style>
