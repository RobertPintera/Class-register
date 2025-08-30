<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import { ref } from 'vue';
import GradingScaleDatatable from '../GradingScaleDatatable.vue';
import SelectSystemDialog from '../SelectSystemDialog.vue';
import NewGradeThresholdDialog from '../NewGradeThresholdDialog.vue';

const showSelectSystemDialog = ref<boolean>(false);
const showNewGradeThresholdDialog = ref<boolean>(false);

</script>

<template>
  <Card>
      <template #header>
        <h3>Grading thresholds</h3>
      </template>
      <template #body>
        <div class="mt-2 mb-4 flex justify-between">
          <Button label="New" icon="pi pi-plus" @click="showNewGradeThresholdDialog = true" />
          <Button variant="outlined" label="Select System" icon="pi pi-graduation-cap" @click="showSelectSystemDialog = true" />
        </div>
        <GradingScaleDatatable />
        <SelectSystemDialog v-model:visible="showSelectSystemDialog" />
        <NewGradeThresholdDialog v-model:visible="showNewGradeThresholdDialog" />
      </template>
    </Card>
</template>