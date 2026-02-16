<script setup lang="ts">
import type { AdvancedFilter } from '@/models/AdvancedFilter';
import type { SimpleFilter } from '@/models/SimpleFilter';
import router from '@/router';
import { useTestsStore } from '@/stores/useTestsStore';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { ref } from 'vue';

const testsStore = useTestsStore();

const filters = ref<Record<string,AdvancedFilter | SimpleFilter>>({});

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]},
    weight: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]},
    isMandatory: { value: null, matchMode: FilterMatchMode.EQUALS }
  };
};

initFilters();

const clearFilter = () => {
  initFilters();
};

const onRowSelect = (event: any) => {
  router.push(`/main/tests/test/${event.data.id}`);
};

const getSeverity = (isMandatory: boolean): string => {
  if(isMandatory)
    return 'success';
  return 'info';
};
</script>

<template>
  <DataTable :value="testsStore.tests" class="custom-table"
  scrollable removableSort paginator paginatorPosition="bottom" :rows=10
  v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['name','weight','isMandatory']"
  @rowSelect="onRowSelect" selectionMode="single" :pt="{ headerRow: { 'data-cy': 'tests-table-header-row' } }">
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
        No tests found.
      </div>
    </template>
    <Column sortable field="name" header="Name" filterField="name">
      <template #body="{ data }">
        <div class="w-full h-full cursor-pointer px-3 py-4">
          {{ data.name }}
        </div>
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" placeholder="Search by Name" data-cy="name-input"/>
      </template>
    </Column>
    <Column field="weight" header="Weight" filterField="weight">
      <template #body="{ data }">
        <div class="w-full h-full cursor-pointer px-3 py-4">
          {{ data.weight }}
        </div>
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" placeholder="Search by Weight" data-cy="weight-input"/>
      </template>
    </Column>
    <Column field="isMandatory" header="Mandatory" dataType="boolean">
      <template #body="{ data }">
        <div class="w-full h-full cursor-pointer px-3 py-4">
            <Tag :value="data.isMandatory ? 'Yes' : 'No'" :severity="getSeverity(data.isMandatory)" />
        </div>
      </template>
      <template #filter="{ filterModel }">
        <label for="mandatory-filter" class="font-bold"> Mandatory </label>
        <Checkbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary inputId="mandatory-filter" data-cy="mandatory-checkbox"/>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
  @reference "@/assets/main.css";

  :deep(.p-datatable-table-container)	{
    @apply min-h-[500px] h-[56vh];
  }
</style>