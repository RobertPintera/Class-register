<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Card from '@/components/core/Card.vue';
import type { Test } from '@/models/Test';

const props = defineProps<{ tests: Test[] }>();

const chartData = computed(() => {
  let mandatory = 0;
  let optional = 0;

  props.tests.forEach(test => {
    if (test.isMandatory) {
      mandatory++;
    } else {
      optional++;
    }
  });

  return {
    labels: ['Mandatory', 'Optional'],
    datasets: [
      {
        data: [mandatory, optional],
        backgroundColor: [
          'rgba(101, 219, 144, 0.6)',
          'rgba(6, 182, 212, 0.6)',
        ],
        borderColor: [
          'rgb(101, 219, 144)',
          'rgb(6, 182, 212)',
        ],
        borderWidth: 1,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
};

</script>

<template>
  <Card>
    <template #header>
      <h3>Mandatory Tests Count</h3>
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