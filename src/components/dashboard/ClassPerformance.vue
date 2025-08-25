<script setup lang="ts">
import Card from '../core/Card.vue';
import PerformanceCard from '../core/PerformanceCard.vue';

const props = defineProps<{
  classPerformance: {
    weightedAverage: number;
    median: number;
    standardDeviation: number;
    max: number;
    min: number;
  };
}>();

</script>

<template>
  <Card>
    <template #header>
      <h3>Class performance</h3>
    </template>
    <template #body>
      <div class="flex justify-evenly flex-wrap gap-4 mt-2">
        <PerformanceCard title="Weighted Average" :value="props.classPerformance.weightedAverage" />
        <PerformanceCard title="Median" :value="props.classPerformance.median" />
        <PerformanceCard title="Standard Deviation" :value="props.classPerformance.standardDeviation" />
        <PerformanceCard title="Max" :value="props.classPerformance.max"/>
        <PerformanceCard title="Min" :value="props.classPerformance.min"/>
      </div>
    </template>
  </Card>
</template>