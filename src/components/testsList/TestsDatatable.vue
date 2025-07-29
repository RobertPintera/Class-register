<script setup lang="ts">
  import { useRegisterStore } from '@/stores/useRegisterStore';

  const registerStore = useRegisterStore();
</script>

<template>
  <DataTable :value="registerStore.tests">
  <Column field="name" header="Name">
  </Column>
  <Column field="weight" header="Weight">
  </Column>
</DataTable>
</template>