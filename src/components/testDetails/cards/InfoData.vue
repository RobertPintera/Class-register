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
      <h4>Name: {{ props.name }}</h4>
      <h4>Weight: {{ props.weight }}</h4>
      <h4>Required points: {{ props.requiredPoints ?? '-' }}</h4>
      <h4>Max points: {{ props.maxPoints }}</h4>
      <h4>Mandatory: <Tag :value="isMandatory ? 'Yes' : 'No'" :severity="getSeverity(isMandatory)" /></h4>
    </template>
  </Card>
</template>