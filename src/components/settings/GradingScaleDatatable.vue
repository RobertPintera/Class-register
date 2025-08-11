<script setup lang="ts">
  import { useRegisterStore } from '@/stores/useRegisterStore';
  import { computed, ref } from 'vue';
  import EditGradeThresholdDialog from './EditGradeThresholdDialog.vue';

  const registerStore = useRegisterStore();

  const selectedGradeThreshold = ref();
  const editingGradeId = ref<string>("");
  const showEditGradeThresholdDialog = ref<boolean>(false);

  const sortedThresholds = computed(() => {
    return [...registerStore.thresholds].sort((a, b) => b.minPercentage - a.minPercentage);
  });

  const onRowSelect = (event: any) => {
    editingGradeId.value = event.data.id;
    showEditGradeThresholdDialog.value = true;
  };
</script>

<template>
  <DataTable :value="sortedThresholds" showGridlines
    scrollable :selection="selectedGradeThreshold" @rowSelect="onRowSelect" selectionMode="single">
    <Column field="name" header="Grade"></Column>
    <Column field="minPercentage" header="Percentage"></Column>
  </DataTable>
  <EditGradeThresholdDialog :id="editingGradeId" v-model:visible="showEditGradeThresholdDialog"/>
</template>