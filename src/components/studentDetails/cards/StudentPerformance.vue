<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import PerformanceCard from '@/components/core/PerformanceCard.vue';

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
  <Card>
    <template #header>
      <h3>Performance</h3>
    </template>
    <template #body>
      <div class="flex justify-evenly flex-wrap gap-4 mt-2">
        <PerformanceCard title="Weighted Average" :value="props.individualPerformance.weightedAverage" />
        <PerformanceCard title="Median" :value="props.individualPerformance.median" />
        <PerformanceCard title="Standard Deviation" :value="props.individualPerformance.standardDeviation" :max="50"/>
        <PerformanceCard title="Max" :value="props.individualPerformance.max"/>
        <PerformanceCard title="Min" :value="props.individualPerformance.min"/>
      </div>
    </template>
  </Card>
</template>