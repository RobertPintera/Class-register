<script setup lang="ts">
  import { useRegisterStore } from '@/stores/useRegisterStore';
  import router from '@/router';
  import { ref } from 'vue';

  const registerStore = useRegisterStore();

  const selectedGradeThreshold = ref();

  const onRowSelect = (event: any) => {
    console.log(event.data);
  };
</script>

<template>
  <DataTable :value="registerStore.thresholds" showGridlines class="custom-table"
    scrollable :selection="selectedGradeThreshold" @rowSelect="onRowSelect" selectionMode="single">
    <Column field="grade" header="Grade"></Column>
    <Column filed="minPercentage" header="Percentage"></Column>
  </DataTable>
</template>