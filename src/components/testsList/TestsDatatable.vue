<script setup lang="ts">
import { useRegisterStore } from '@/stores/useRegisterStore';

const registerStore = useRegisterStore();
</script>

<template>
  <DataTable :value="registerStore.tests">
    <template #empty>
      <div class="w-full h-full px-3 py-4">
        No tests found.
      </div>
    </template>
    <Column field="name" header="Name">
    </Column>
    <Column field="weight" header="Weight">
    </Column>
</DataTable>
</template>