<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import NewTestDialog from '@/components/testsList/NewTestDialog.vue';
import TestsDatatable from '@/components/testsList/TestsDatatable.vue';
import { Button } from 'primevue';
import { ref } from 'vue';

const showNewTestDialog = ref<boolean>(false);
</script>

<template>
  <h1 class="sr-only">Register - Tests</h1>
  <h2 class="title-section">Tests</h2>
  <div class="cards-section">
    <Card>
      <template #header>
        <h3>List of tests</h3>
      </template>
      <template #body>
        <div class="mb-4">
          <Button label="New" icon="pi pi-plus"  @click="showNewTestDialog = true"/>
        </div>
        <TestsDatatable/>
      </template>
    </Card>
  </div>
  <NewTestDialog v-model:visible="showNewTestDialog"/>
</template>