<script setup lang="ts">
  import { useRegisterStore } from '@/stores/useRegisterStore';

  const registerStore = useRegisterStore();
</script>

<template>
  <DataTable :value="registerStore.students">
    <Column field="name" header="Name">
    </Column>
    <Column field="surname" header="Surname">
    </Column>
  </DataTable>
</template>