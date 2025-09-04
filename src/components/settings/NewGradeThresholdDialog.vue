<script setup lang="ts">
import { useGradeThresholdsStore } from '@/stores/useGradeThresholdsStore';
import { isGradeThreshold } from '@/utility/typeGuards';
import type { FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue';
import { ref } from 'vue';
import z from 'zod';

const gradeThresholdsStore = useGradeThresholdsStore();
const toast = useToast();

const visible = defineModel<boolean>('visible', {default: false});

const resolver = ref(zodResolver(
  z.object({
    name: z.string('Grade name is required').min(1, 'Grade name is required'),
    minPercentage: z.number('Min Percentage is required')
      .min(0, 'Min percentage cannot be less than 0')
      .max(100, 'Max percentage cannot be greater than 100')
  })
));

const cancel = () => {
  visible.value = false;
};

const submit = (event: FormSubmitEvent<Record<string, any>>) => {
  if (event.valid) {
    const values = {
      name: event.states.name.value,
      minPercentage: event.states.minPercentage.value
    };

    if (isGradeThreshold(values)) {
      gradeThresholdsStore.addGradeThreshold(values);
      toast.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Successfully added grade threshold.', 
        life: 3000 
      });
      cancel();
    } else {
      console.error("Wrong data from form!");
    }
  }
};
</script>

<template>
  <Dialog header="New Grade Threshold" v-model:visible="visible" :modal="true" :draggable="false" class="w-80">
    <Form v-slot="$form" :resolver="resolver" @submit="submit" :validateOnBlur="true"
      class="flex flex-col gap-3 mt-2 w-full">
      <div class="flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputText id="name" name="name" variant="filled" class="w-full"/>
          <label for="name">Grade</label>
        </FloatLabel>
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error?.message
          }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputNumber id="minPercentage" name="minPercentage" class="w-full" variant="filled" :min="0" :max="100" :step="1" />
          <label for="minPercentage">Min Percentage</label>
        </FloatLabel>
        <Message v-if="$form.minPercentage?.invalid" severity="error" size="small" variant="simple">{{
          $form.minPercentage.error?.message }}</Message>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancel" variant="outlined" severity="secondary" icon="pi pi-times" @click="cancel" />
        <Button label="Add" icon="pi pi-check" type="submit" autofocus/>
      </div>
    </Form>
  </Dialog>
</template>