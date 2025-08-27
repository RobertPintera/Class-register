<script setup lang="ts">
import Card from '@/components/core/Card.vue';

const props = defineProps<{ name: string, weight: number, requiredPoints: number | null, maxPoints: number, isMandatory: boolean }>();
</script>

<template>
  <Card>
    <template #header>
      <h3>Info Data</h3>
    </template>
    <template #body>
      <h4>Name: {{ props.name }}</h4>
      <h4>Weight: {{ props.weight }}</h4>
      <h4>Required points: {{ props.requiredPoints ?? '-' }}</h4>
      <h4>Max points: {{ props.maxPoints }}</h4>
      <h4>Mandatory: {{ props.isMandatory ? 'yes' : 'no' }}</h4>
    </template>
  </Card>
</template>