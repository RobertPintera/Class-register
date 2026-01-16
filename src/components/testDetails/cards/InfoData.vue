<script setup lang="ts">
import Card from '@/components/core/Card.vue';

const props = defineProps<{ name: string, weight: number, requiredPoints: number | null, maxPoints: number, isMandatory: boolean }>();

const getSeverity = (isMandatory: boolean): string => {
  if(isMandatory)
    return 'success';
  return 'info';
};
</script>

<template>
  <Card>
    <template #header>
      <h3>Info data</h3>
    </template>
    <template #body>
      <p>Name: {{ props.name }}</p>
      <p>Weight: {{ props.weight }}</p>
      <p>Required points: {{ props.requiredPoints ?? '-' }}</p>
      <p>Max points: {{ props.maxPoints }}</p>
      <p>Mandatory: <Tag :value="isMandatory ? 'Yes' : 'No'" :severity="getSeverity(isMandatory)" /></p>
    </template>
  </Card>
</template>