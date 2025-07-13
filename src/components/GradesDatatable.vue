<script setup lang="ts">
  import { useRegisterStore } from '@/stores/useRegisterStore';

  const registerStore = useRegisterStore();
</script>
    
<template>
  <DataTable :value="registerStore.studentGrades" tableStyle="min-width: 50rem">
    <Column field="fullName" header="Student" />
    <Column
      v-for="col in registerStore.testColumns"
      :key="col.field"
      :field="col.field"
      :header="col.header"
    />
  </DataTable>
</template>