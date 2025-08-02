<script setup lang="ts">
   const props = defineProps<{
    totalTests: number, 
  }>();

</script>

<template>
  <div class="card">
    <h3>Tests Taken</h3>
    <div class="relative w-full h-[100px]">
      <Chart type="bar" :data="chartData" :options="chartOptions" class="w-full h-full"/>
    </div>
  </div>
</template>