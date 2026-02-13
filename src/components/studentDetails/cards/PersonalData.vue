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
      <p data-cy="name">Name: {{ props.name }}</p>
      <p data-cy="surname">Surname: {{ props.surname }}</p>
      <p data-cy="gender">Gender: {{ props.gender }}</p>
    </template>
  </Card>
</template>