<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import NewTestDialog from '@/components/testsList/NewTestDialog.vue';
import TestsDatatable from '@/components/testsList/TestsDatatable.vue';
import { Button } from 'primevue';
import { ref } from 'vue';

const showNewTestDialog = ref<boolean>(false);
</script>

<template>
  <h2 class="m-4">Tests</h2>
  <Card>
    <h3>List of tests</h3>
    <div class="mt-2 mb-4">
      <Button label="New" icon="pi pi-plus"  @click="showNewTestDialog = true"/>
    </div>
    <TestsDatatable/>
  </Card>

  <NewTestDialog v-model:visible="showNewTestDialog"/>
</template>