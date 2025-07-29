<script setup lang="ts">
  import type { AdvancedFilter } from '@/models/AdvancedFilter';
  import router from '@/router';
  import { useRegisterStore } from '@/stores/useRegisterStore';
  import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
  import { ref } from 'vue';

  const registerStore = useRegisterStore();

  const selectedStudent = ref();
  const filters = ref<Record<string,AdvancedFilter>>({});

  const initFilters = () => {
    filters.value = {
      name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]},
      surname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]},
    };
  };

  initFilters();

  const clearFilter = () => {
    initFilters();
  };
  
  const onRowSelect = (event: any) => {
    router.push(`/student/${event.data.id}`);
  };
</script>

<template>
  <DataTable :value="registerStore.students" showGridlines class="custom-table"
    scrollable removableSort paginator paginatorPosition="bottom" :rows=10
    :filters="filters" filterDisplay="menu"
    :selection="selectedStudent" @rowSelect="onRowSelect" selectionMode="single">
    <template #header>
      <div class="flex flex-wrap gap-2 items-center justify-between">
        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
      </div>
    </template>
    <template #empty>
      <div class="w-full h-full px-3 py-4">
        No students found.
      </div>
    </template>
    <Column sortable field="name" header="Name" filterField="name">
      <template #body="{ data }">
        <div class="w-full h-full cursor-pointer px-3 py-4">
          {{ data.name }}
        </div>
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" placeholder="Search by Name" />
      </template>
    </Column>
    <Column sortable field="surname" header="Surname" filterField="surname">
      <template #body="{ data }">
        <div class="w-full h-full cursor-pointer px-3 py-4">
          {{ data.surname }}
        </div>
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" placeholder="Search by Surname" />
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
  @reference "@/assets/main.css";

  .custom-table{
  	--p-datatable-body-cell-padding: 0rem 0rem;
    @apply w-[100%];
  }

  .p-datatable {
    @apply m-1;
  }

  :deep(.p-paginator){
    @apply border-t border-[var(--p-datatable-border-color)];
  }

  :deep(.p-datatable-table-container)	{
    @apply min-h-[500px] h-[60vh] border-l border-r border-[var(--p-datatable-border-color)];
  }
</style>