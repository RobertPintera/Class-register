<script setup lang="ts">
  import PerformanceCard from './PerformanceCard.vue';

  const props = defineProps<{
  individualPerformance: {
    weightedAverage: number;
    median: number;
    standardDeviation: number;
    max: number;
    min: number;
  };

}>();

</script>

<template>
  <div class="card">
    <h3>Performance</h3>
    <div class="flex justify-evenly flex-wrap gap-4 mt-2">
      <PerformanceCard title="Weighted Average" :value="props.individualPerformance.weightedAverage" />
      <PerformanceCard title="Median" :value="props.individualPerformance.median" />
      <PerformanceCard title="Standard Deviation" :value="props.individualPerformance.standardDeviation" />
      <PerformanceCard title="Max" :value="props.individualPerformance.max"/>
      <PerformanceCard title="Min" :value="props.individualPerformance.min"/>
    </div>
  </div>
</template>