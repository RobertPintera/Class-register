<script setup lang="ts">
  import type { Grade } from '@/models/Grade';
  import type { Test } from '@/models/Test';
  import { useRegisterStore } from '@/stores/useRegisterStore';
  import { computed, onMounted, ref, watch } from 'vue';

  const props = defineProps<{
    visible: boolean;
    studentId: string;
    testId: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
  }>();

  const visibleLocal = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
  });

  const registerStore = useRegisterStore();

  const test = ref<Pick<Test, 'name' | 'maxScore'>>({
    name: "",
    maxScore: 0
  });

  const localGrade = ref<Grade>({
    studentId: props.studentId,
    testId: props.testId,
    score: 0,
  });
  
  const updateDataForm = (visible: boolean) =>{
    if (visible) {
      const existingTest = registerStore.getTest(props.testId);
      if (existingTest) {
        test.value = {
          name: existingTest.name,
          maxScore: existingTest.maxScore
        };
      };

      const existingGrade = registerStore.getGrade(props.studentId, props.testId);
      localGrade.value = existingGrade ? { ...existingGrade } : { studentId: props.studentId, testId: props.testId, score: 0 };
    }
  };

  onMounted(() => {
    const v = props.visible;
    updateDataForm(v);
  });

  watch(() => props.visible, (visible) => {
    updateDataForm(visible);
  });

  const resetForm = () => {
    localGrade.value = {
      studentId: "",
      testId: "",
      score: 0
    };
  };

  const submit = () => {
    const { score } = localGrade.value;
    if (score < 0 || score > test.value.maxScore) {
      console.warn('Invalid grade:', localGrade.value);
      return;
    }

    registerStore.updateGrade(localGrade.value);
    emit('update:visible', false);
  };

  const cancel = () => {
    resetForm();
    emit('update:visible', false);
  };

</script>

<template>
  <Dialog header="Edit Grade" v-model:visible="visibleLocal" modal>
    <div class="flex flex-col gap-3 mt-3">
      <div class="flex items-center">
        <label class="w-28">Score (0-{{ test.maxScore }})</label>
        <InputNumber
          v-model="localGrade.score"
          :min="0"
          :max="test.maxScore"
          class="flex-auto"
        />
      </div>
    </div>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" @click="cancel" />
      <Button label="Save" icon="pi pi-check" @click="submit" />
    </template>
  </Dialog>
</template>