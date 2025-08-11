<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import z from 'zod';
import type { GradeThreshold } from '@/models/GradeThreshold';
import { useRegisterStore } from '@/stores/useRegisterStore';
import { isGradeThreshold } from '@/utility/typeGuards';
import type { FormSubmitEvent } from '@primevue/forms';

const registerStore = useRegisterStore();

const props = defineProps<{ id: string; }>();
const visible = defineModel<boolean>('visible', { default: false });

const initialValues = reactive<GradeThreshold>({ id: "", name: "", minPercentage: 0});

const resolver = ref(zodResolver(
  z.object({
    name: z.string('Grade name is required').min(1, 'Grade name is required'),
    minPercentage: z.number('Must be a number')
      .min(0, 'Min percentage cannot be less than 0')
      .max(100, 'Max percentage cannot be greater than 100')
  })
));

const updateDataForm = (visible: boolean) => {
  if (visible) {
    const existingGradeThreshold = registerStore.getGradeThreshold(props.id);
    if (existingGradeThreshold) {
      Object.assign(initialValues, existingGradeThreshold);
    }
  }
};

watch(visible, (newValue) => {
  updateDataForm(newValue);
});

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
      registerStore.updateGradeThreshold(props.id, values);
      visible.value = false;
    } else {
      console.error("Wrong data from form");
    }
  }
};
</script>

<template>
  <Dialog header="New Grade Threshold" v-model:visible="visible" modal>
    <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="submit" :validateOnBlur="true"
      class="flex flex-col gap-4 w-full">
      <div class="flex flex-col gap-1">
        <FloatLabel variant="in">
          <InputText id="name" name="name" variant="filled" class="w-60" />
          <label for="name">Grade</label>
        </FloatLabel>
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error?.message
          }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <FloatLabel variant="in">
          <InputNumber id="minPercentage" name="minPercentage" class="w-60" variant="filled" :min="0" :max="100"
            :maxFractionDigits="0" :step="1" />
          <label for="minPercentage">Min Percentage</label>
        </FloatLabel>
        <Message v-if="$form.minPercentage?.invalid" severity="error" size="small" variant="simple">{{
          $form.minPercentage.error?.message }}</Message>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancel" icon="pi pi-times" @click="cancel" />
        <Button label="Add" icon="pi pi-check" type="submit" autofocus />
      </div>
    </Form>
  </Dialog>
</template>