<script setup lang="ts">
import ActionsTest from '@/components/testDetails/ActionsTest.vue';
import InfoData from '@/components/testDetails/InfoData.vue';
import TestPassRate from '@/components/testDetails/TestPassRate.vue';
import TestPassRateByGender from '@/components/testDetails/TestPassRateByGender.vue';
import type { Test } from '@/models/Test';
import { useRegisterStore } from '@/stores/useRegisterStore';
import { onMounted, ref } from 'vue';

const registerStore = useRegisterStore();
const props = defineProps<{ testId: string }>();
const test = ref<Test>();

function loadTestData(){
  const s = registerStore.getTest(props.testId);
  if (!s) return;
  test.value = s;
}

onMounted(() => {
  loadTestData();
});
</script>

<template>
  <h2 class="title-section">Test Details</h2>
  <div class="cards-section">
    <div v-if="test" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto w-full">
      <InfoData class="col-span-2" :name="test?.name" :weight="test?.weight" :required-points="test?.requiredPoints" :max-points="test?.maxPoints" :is-mandatory="test?.isMandatory"/>
      <ActionsTest class="col-span-2 col-start-1 row-start-2"/>
      <TestPassRate :test-id="test.id" :required-points="test.requiredPoints" class="row-span-2 col-start-3 row-start-1"/>
      <TestPassRateByGender :test-id="test.id" :required-points="test.requiredPoints" class="row-span-2 col-start-4 row-start-1"/>
    </div>
  </div>
</template>