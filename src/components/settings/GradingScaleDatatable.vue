<script setup lang="ts">
  import { useRegisterStore } from '@/stores/useRegisterStore';
  import { computed, ref } from 'vue';

  const registerStore = useRegisterStore();

  const selectedGradeThreshold = ref();

  const sortedThresholds = computed(() => {
    return [...registerStore.thresholds].sort((a, b) => b.minPercentage - a.minPercentage);
  });

  const onRowSelect = (event: any) => {
    console.log(event.data);
  };
</script>

<template>
  <DataTable :value="sortedThresholds" showGridlines class="custom-table"
    scrollable :selection="selectedGradeThreshold" @rowSelect="onRowSelect" selectionMode="single">
    <Column field="grade" header="Grade"></Column>
    <Column field="minPercentage" header="Percentage"></Column>
  </DataTable>
</template>