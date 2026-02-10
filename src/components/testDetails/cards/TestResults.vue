<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Card from '@/components/core/Card.vue';
import type { StudentResult } from '@/models/StudentResult';
import type { Test } from '@/models/Test';

const props = defineProps<{ test: Test, results: StudentResult[] }>();

const currentPage = ref(0);
const rowsPerPage = 4;

const totalRecords = computed(() => props.results.length);

const chartData = computed(() => {
  const start = currentPage.value * rowsPerPage;
  const end = start + rowsPerPage;
  const pageScores = props.results.slice(start, end);

  return {
    labels: pageScores.map(t => `${t.name} ${t.surname}`),
    datasets: [
      {
        label: 'Score',
        data: pageScores.map(t => t.percentage),
        scores: pageScores.map(t => t.points),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };
});

const chartOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          const dataset = ctx.dataset;
          const index = ctx.dataIndex;
          return `${dataset.scores[index]} / ${props.test.maxPoints} points (${ctx.formattedValue}%)`;
        },
      },
    },
  },
  scales: {
    x: { min: 0, max: 100 },
  },
};

const onPageChange = (event: { page: number }) => {
  currentPage.value = event.page;
};

</script>

<template>
  <Card>
    <template #header>
      <h3>Results</h3>
    </template>
    <template #body>
      <div class="flex-1 min-w-64 h-fit">
        <div class="relative w-full h-[400px]">
          <Chart type="bar" :data="chartData" :options="chartOptions" class="w-full h-full"/>
        </div>
        <Paginator :rows="rowsPerPage" :totalRecords="totalRecords" :page="currentPage" @page="onPageChange"/>
      </div>
    </template>
  </Card>
</template>