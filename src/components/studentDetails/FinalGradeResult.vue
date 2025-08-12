<script setup lang="ts">
import { computed } from 'vue';
import Card from '../core/Card.vue';
import { useRegisterStore } from '@/stores/useRegisterStore';

const registerStore = useRegisterStore();
const props = defineProps<{weightedAverage: number}>();

const bestGrade = computed(() => {
  return registerStore.thresholds
    // keep only thresholds that are achieved
    .filter(t => props.weightedAverage >= t.minPercentage)
    // sort descending by minPercentage and take the first
    .sort((a, b) => b.minPercentage - a.minPercentage)[0]?.name ?? '—';
});



</script>

<template>
  <Card>
    <h3>Final Grade</h3>
    <div class="flex justify-center items-center h-full">
      <h4 class="text-[clamp(1rem,5vw,4rem)]">{{ bestGrade }}</h4>
    </div>
    <MeterGroup :value="stats"/>
  </Card>
</template>