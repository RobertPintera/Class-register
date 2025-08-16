<script setup lang="ts">
import type { AdvancedFilter } from '@/models/AdvancedFilter';
import type { SimpleFilter } from '@/models/SimpleFilter';
import router from '@/router';
import { useRegisterStore } from '@/stores/useRegisterStore';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { ref } from 'vue';

const registerStore = useRegisterStore();

const filters = ref<Record<string,AdvancedFilter | SimpleFilter>>({});

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
  <DataTable :value="registerStore.students" class="custom-table"
    scrollable removableSort paginator paginatorPosition="bottom" :rows=10
    :filters="filters" filterDisplay="menu" :globalFilterFields="['name','surname']"
    @rowSelect="onRowSelect" selectionMode="single">
    <template #header>
      <div class="flex flex-wrap gap-2 items-center justify-between">
        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
        <IconField>
          <InputIcon>
              <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="(filters.global as SimpleFilter).value" placeholder="Keyword Search" />
        </IconField>
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
  :deep(.p-datatable-table-container)	{
    @apply min-h-[500px] h-[56vh];
  }
</style>