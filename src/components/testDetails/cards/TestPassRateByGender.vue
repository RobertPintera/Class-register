<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Card from '@/components/core/Card.vue';
import type { PassRate } from '@/models/PassRate';

const props = defineProps<{passRateByMale: PassRate, passRateByFemale: PassRate}>();

const chartData = computed(() => ({
  labels: ["Passed","Failed","Not taken"],
  datasets: [
    {
      label: 'Male',
      data: [
        props.passRateByMale.passed,
        props.passRateByMale.failed,
        props.passRateByMale.notTaken,
      ],
      backgroundColor: 'rgba(34, 197, 94, 0.6)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 1,
    },
    {
      label: 'Female',
      data: [
        props.passRateByFemale.passed,
        props.passRateByFemale.failed,
        props.passRateByFemale.notTaken,
      ],
      backgroundColor: 'rgba(6, 182, 212, 0.6)',
      borderColor: 'rgb(6, 182, 212)',
      borderWidth: 1,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

</script>

<template>
  <Card>
    <template #header>
      <h3>Pass rate by gender</h3>
    </template>
    <template #body>
      <div class="relative w-full h-[90%]">
        <Chart
          type="bar"
          :data="chartData"
          :options="chartOptions"
          class="w-full h-full max-h-[360px]"
        />
      </div>
    </template>
  </Card>
</template>