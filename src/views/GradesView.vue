<script setup lang="ts">
  import GradesDatatable from '@/components/GradesDatatable.vue';
  import AddStudentDialog from '@/components/AddStudentDialog.vue';
  import { ref } from 'vue';
  import AddTestView from '@/components/AddTestView.vue';

  const showAddStudentDialog = ref<boolean>(false);
  const showAddTestDialog = ref<boolean>(false);
</script>

<template>
  <div class="w-full">
    <div class="card">
      <Toolbar>
          <template #start>
            <ButtonGroup>
              <Button label="Add student" icon="pi pi-user-plus" @click="showAddStudentDialog = true"/>
              <Button label="Add test" icon="pi pi-book" @click="showAddTestDialog = true"/>
            </ButtonGroup>
          </template>
          <template #end>
            <ButtonGroup>
              <Button label="Export" icon="pi pi-file-export" />
              <Button label="Import" icon="pi pi-file-import" />
            </ButtonGroup>
          </template>
      </Toolbar>
      <div class="flex justify-center">
        <GradesDatatable />
      </div>

      <AddStudentDialog v-model:visible="showAddStudentDialog" />
      <AddTestView v-model:visible="showAddTestDialog"/>
    </div>
  </div>
   
</template>

<style scoped>

</style>
