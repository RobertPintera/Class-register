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
      <h4>Name: {{ props.name }}</h4>
      <h4>Surname: {{ props.surname }}</h4>
      <h4>Gender: {{ props.gender }}</h4>
    </template>
  </Card>
</template>