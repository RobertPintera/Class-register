<script setup lang="ts">
import type { Grade } from '@/models/Grade';
import type { Test } from '@/models/Test';
import { useGradesStore } from '@/stores/useGradesStore';
import { useTestsStore } from '@/stores/useTestsStore';
import { reactive, ref, watch } from 'vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';

const testsStore = useTestsStore();
const gradesStore = useGradesStore();

const visible = defineModel<boolean>('visible', {default: false});
const props = defineProps<{ studentId: string, testId: string }>();

const test = reactive<Pick<Test, 'name' | 'maxPoints'>>({
  name: "",
  maxPoints: 0
});

const schema = yup.object({
  score: yup
    .number()
    .nullable()
    .min(0, 'Score cannot be less than 0')
});

const { defineField, handleSubmit, resetForm, errors } = useForm({
  validationSchema: schema,
});

const [score] = defineField('score');

const updateDataForm = (visible: boolean) =>{
  if (visible) {
    const existingTest = testsStore.getTest(props.testId);
    if (existingTest) {
      Object.assign(test, { name: existingTest.name, maxPoints: existingTest.maxPoints});
    }

    const existingGrade = gradesStore.getGrade(props.studentId, props.testId);
    score.value = existingGrade?.points ?? null;
  }
};

watch(() => visible.value, (visible) => {
  updateDataForm(visible);
});

const cancel = () => {
  visible.value = false;
};  

const onSubmit = handleSubmit((values) => {
  if (values) {
    const score = values.score;

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
});
</script>

<template>
  <Dialog header="Edit Grade" v-model:visible="visible" :modal="true" :draggable="false" class="w-60">
    <form @submit="onSubmit" 
    class="flex flex-col gap-3 mt-2 w-full">
      <h5 class="text-center">Number must be between 0 and {{ test.maxPoints }}</h5>
      <div class="flex flex-col gap-1">
        <FloatLabel variant="in">
          <InputNumber id="score" name="score" class="w-60" variant="filled" :min="0" :max="test.maxPoints" :maxFractionDigits="1" :step="0.1" 
          v-model="score" :allowEmpty="true" :class="'w-full'"/>
          <label for="score">Score</label>
        </FloatLabel>
        <Message v-if="errors.score" severity="error" size="small" variant="simple">{{ errors.score }}</Message>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancel" variant="outlined" icon="pi pi-times" @click="cancel" />
        <Button label="Save" icon="pi pi-check" type="submit" autofocus />
      </div>
    </form>
  </Dialog>
</template>