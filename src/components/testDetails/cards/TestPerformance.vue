<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import PerformanceCard from '@/components/core/PerformanceCard.vue';

const props = defineProps<{
  maxPoints: number,
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
      <h3>Performance</h3>
    </template>
    <template #body>
      <div class="flex justify-evenly flex-wrap gap-4 mt-2">
        <PerformanceCard title="Weighted Average" :value="props.classPerformance.weightedAverage" :max="maxPoints"/>
        <PerformanceCard title="Median" :value="props.classPerformance.median" :max="maxPoints"/>
        <PerformanceCard title="Standard Deviation" :value="props.classPerformance.standardDeviation" :max="maxPoints/2"/>
        <PerformanceCard title="Max" :value="props.classPerformance.max" :max="maxPoints"/>
        <PerformanceCard title="Min" :value="props.classPerformance.min" :max="maxPoints"/>
      </div>
    </template>
  </Card>
</template>