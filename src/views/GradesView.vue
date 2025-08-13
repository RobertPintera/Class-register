<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import GradesDatatable from '@/components/grades/GradesDatatable.vue';
</script>

<template>
  <h2 class="m-4">Grades</h2>
  <Card>
    <h3>List of grades</h3>
    <div class="flex justify-center">
      <GradesDatatable />
    </div>
  </Card>
</template>

<style scoped>

</style>
