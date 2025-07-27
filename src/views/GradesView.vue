<script setup lang="ts">
  import GradesDatatable from '@/components/grades/GradesDatatable.vue';
</script>

<template>
  <h2 class="m-4">Grades</h2>
  <div class="card">
    <div class="mb-4 flex justify-start">
      <ButtonGroup>
        <Button label="Export" icon="pi pi-file-export" />
        <Button label="Import" icon="pi pi-file-import" />
      </ButtonGroup>
    </div>
    
    <div class="flex justify-center">
      <GradesDatatable />
    </div>
  </div>
</template>

<style scoped>

</style>
