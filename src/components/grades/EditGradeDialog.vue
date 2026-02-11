<script setup lang="ts">
import type { Grade } from '@/models/Grade';
import type { Test } from '@/models/Test';
import { useGradesStore } from '@/stores/useGradesStore';
import { useTestsStore } from '@/stores/useTestsStore';
import type { Form, FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { computed, nextTick, reactive, ref, watch } from 'vue';
import z from 'zod';

const testsStore = useTestsStore();
const gradesStore = useGradesStore();

const visible = defineModel<boolean>('visible', {default: false});

const props = defineProps<{ studentId: string, testId: string }>();

const test = reactive<Pick<Test, 'name' | 'maxPoints'>>({
  name: "",
  maxPoints: 0
});

const initialValues = reactive<{score: null | number}>(
  { score: null }
);

const updateDataForm = async (visible: boolean) =>{
  if (visible) {
    const existingTest = testsStore.getTest(props.testId);
    if (existingTest) {
      Object.assign(test, { name: existingTest.name, maxPoints: existingTest.maxPoints});
    }

    const existingGrade = gradesStore.getGrade(props.studentId, props.testId);
    const initialScore = existingGrade?.points ?? null;

    initialValues.score = initialScore;
    await nextTick();
    initialValues.score = null;
  }
};

watch(() => visible.value, (visible) => {
  updateDataForm(visible);
});

const cancel = () => {
  visible.value = false;
};  

const resolver = computed(() => zodResolver(
  z.object({
    score: z.number("Score is required")
      .min(0,"Score cannot be less than 0")
      .max(test.maxPoints, `Score cannot be greater than ${test.maxPoints}`)
      .nullable()
  })
));

const submit = (event: FormSubmitEvent<Record<string, any>>) => {
  if (event.valid) {
    const score = event.states.score?.value;

    if(typeof score === 'number' || score === null){
      const grade: Grade = {
        studentId: props.studentId,
        testId: props.testId,
        points: score,
      };

      if(score !== undefined) {
        gradesStore.updateGrade(grade);
      }
      else{
        gradesStore.deleteGrade(props.studentId, props.testId);
      }
      
      cancel();
    } else {
      console.error("Wrong data from form!");
    }
  }
};
</script>

<template>
  <Dialog header="Edit Grade" v-model:visible="visible" :modal="true" :draggable="false" class="w-70">
    <Form v-slot="$form" :initial-values="initialValues" :resolver="resolver" @submit="submit" 
    class="flex flex-col gap-3 mt-2 w-full">
      <h5>Number must be between 0 and {{ test.maxPoints }}</h5>
      <div class="flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputNumber id="score" name="score" class="w-full" variant="filled" :min="0" :max="test.maxPoints" :maxFractionDigits="1" :step="0.1" :allowEmpty="true"/>
          <label for="score">Score</label>
        </FloatLabel>
        <Message v-if="$form.score?.invalid" severity="error" size="small" variant="simple">{{ $form.score.error?.message }}</Message>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancel" severity="secondary" variant="outlined" icon="pi pi-times" data-cy="cancel-button" @click="cancel" />
        <Button label="Save" icon="pi pi-check" type="submit" data-cy="save-button" autofocus />
      </div>
    </Form>
  </Dialog>
</template>