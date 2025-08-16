<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import NewTestDialog from '@/components/testsList/NewTestDialog.vue';
import TestsDatatable from '@/components/testsList/TestsDatatable.vue';
import { Button } from 'primevue';
import { ref } from 'vue';

const showNewTestDialog = ref<boolean>(false);
</script>

<template>
  <h2 class="title-section">Tests</h2>
  <div class="cards-section">
    <Card>
      <h3>List of tests</h3>
      <div class="mt-2 mb-4">
        <Button label="New" icon="pi pi-plus"  @click="showNewTestDialog = true"/>
      </div>
      <TestsDatatable/>
    </Card>
  </div>
  <NewTestDialog v-model:visible="showNewTestDialog"/>
</template>