<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useGradingSystems } from '@/utility/gradingSystemsData';
import { useRegisterStore } from '@/stores/useRegisterStore';
import type { GradingSystem } from '@/models/GradingSystem';
import { useGradeThresholdsStore } from '@/stores/useGradeThresholdsStore';

const gradeThresholdsStore = useGradeThresholdsStore();

const visible = defineModel<boolean>('visible', { default: false });
const gradingSystems = reactive<GradingSystem[]>(useGradingSystems());

const resolver = ref(zodResolver(
  z.object({
    system: z.union([
      z.object({
        name: z.string().min(1, 'System is required.')
      }),
      z.any().refine((val) => false, { message: 'System is required.' })
    ])
  })
));

const cancel = () => {
  visible.value = false;
};

const submit = (event: FormSubmitEvent<Record<string, any>>) => {
  if (event.valid && event.states.system) {
    gradeThresholdsStore.replaceGradeThresholds(event.states.system.value.gradethresholds);
    cancel();
  }
};
</script>

<template>
  <Dialog header="Select Grading system" v-model:visible="visible" modal>
    <Form v-slot="$form" :resolver="resolver" @submit="submit"
      class="flex flex-col gap-3 mt-2 w-full">
      <Listbox name="system" :options="gradingSystems" optionLabel="name" :virtualScrollerOptions="{ itemSize: 20 }"
        class="w-full" listStyle="height:250px" striped fluid />
      <Message v-if="$form.system?.invalid" severity="error" size="small" variant="simple">{{ $form.system.error?.message }}</Message>
      <Button label="Select" type="submit" autofocus :disabled="!$form.system?.value"/>
    </Form>
  </Dialog>
</template>