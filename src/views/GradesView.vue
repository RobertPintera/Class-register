<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import GradesDatatable from '@/components/grades/GradesDatatable.vue';
</script>

<template>
  <h2 class="title-section">Grades</h2>
  <div class="cards-section">
    <Card>
      <template #header>
        <h3>List of grades</h3>
      </template>
      <template #body>
        <div class="flex flex-col">
          <div class="flex justify-center">
            <GradesDatatable />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
