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
      <p data-cy="name">Name: {{ props.name }}</p>
      <p data-cy="weight">Weight: {{ props.weight }}</p>
      <p data-cy="required-points">Required points: {{ props.requiredPoints ?? '-' }}</p>
      <p data-cy="max-points">Max points: {{ props.maxPoints }}</p>
      <p data-cy="mandatory">Mandatory: <Tag :value="isMandatory ? 'Yes' : 'No'" :severity="getSeverity(isMandatory)" /></p>
    </template>
  </Card>
</template>