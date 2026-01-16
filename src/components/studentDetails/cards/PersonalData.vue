<script setup lang="ts">
import Card from '@/components/core/Card.vue';

const props = defineProps<{ name: string, surname: string, gender: string }>();
</script>

<template>
  <Card>
    <template #header>
      <h3>Personal Data</h3>
    </template>
    <template #body>
      <p>Name: {{ props.name }}</p>
      <p>Surname: {{ props.surname }}</p>
      <p>Gender: {{ props.gender }}</p>
    </template>
  </Card>
</template>