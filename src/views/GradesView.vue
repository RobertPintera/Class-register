<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import GradesDatatable from '@/components/grades/GradesDatatable.vue';
</script>

<template>
  <h2 class="title-section">Grades</h2>
  <div class="cards-section">
    <Card>
      <h3>List of grades</h3>
      <div class="flex justify-center">
        <GradesDatatable />
      </div>
    </Card>
  </div>
</template>
