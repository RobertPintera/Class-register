<script setup lang="ts">
  import { Button } from 'primevue';
  import { ref } from 'vue';

  const showNewTestDialog = ref<boolean>(false);
</script>

<template>
  <h2 class="m-4">Tests</h2>
  <div class="card">
    <Button label="New" icon="pi pi-plus"  @click="showNewTestDialog = true"/>
  </div>
  <NewTestDialog v-model:visible="showNewTestDialog"/>
</template>