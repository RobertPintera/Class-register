<script setup lang="ts">
import NewTestDialog from '@/components/testsList/NewTestDialog.vue';
import TestsDatatable from '@/components/testsList/TestsDatatable.vue';
import { Button } from 'primevue';
import { ref } from 'vue';

const showNewTestDialog = ref<boolean>(false);
</script>

<template>
  <h2 class="m-4">Tests</h2>
  <div class="card">
    <Button label="New" icon="pi pi-plus"  @click="showNewTestDialog = true"/>
    <TestsDatatable/>
  </div>


  <NewTestDialog v-model:visible="showNewTestDialog"/>
</template>