<script setup lang="ts">
  import { useRegisterStore } from '@/stores/useRegisterStore';
  import { isGradeThreshold } from '@/utility/typeGuards';
  import type { FormSubmitEvent } from '@primevue/forms';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { computed, ref } from 'vue';
  import z from 'zod';

  const registerStore = useRegisterStore();
  const props = defineProps<{ visible: boolean }>();
  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
  }>();

  const initialValues = ref();
  const visibleLocal = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
  });

  const resolver = ref(zodResolver(
    z.object({
      name: z.string('Grade name is required').min(1, 'Grade name is required'),
      minPercentage: z.number('Must be a number')
      .min(0, 'Min percentage cannot be less than 0')
      .max(100, 'Max percentage cannot be greater than 100')
    })
  ));

  const cancel = () => {
    emit('update:visible', false);
  };

  const submit = (event: FormSubmitEvent<Record<string, any>>) => {
      if (event.valid) {
        const values = {
          name: event.states.name.value,
          minPercentage: event.states.minPercentage.value
        };

        if(isGradeThreshold(values)){
          registerStore.addGradeThreshold(values);
          emit('update:visible', false);
        } else {
          console.error("Wrong data from form!");
        }
      }
   };
</script>

<template>
  <Dialog header="New Grade Threshold" v-model:visible="visibleLocal" modal>
    <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="submit"  :validateOnBlur="true" class="flex flex-col gap-4 w-full">
      <div class="flex flex-col gap-1">
        <FloatLabel variant="in">
          <InputText id="name" name="name" variant="filled" class="w-60" />
          <label for="name">Grade</label>
        </FloatLabel>
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <FloatLabel variant="in">
          <InputNumber id="minPercentage" name="minPercentage" class="w-60" variant="filled" :min="0" :max="100" :maxFractionDigits="0" :step="1"/>
          <label for="minPercentage">Min Percentage</label>
        </FloatLabel>
        <Message v-if="$form.minPercentage?.invalid" severity="error" size="small" variant="simple">{{ $form.minPercentage.error?.message }}</Message>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancel" icon="pi pi-times" @click="cancel" />
        <Button label="Add" icon="pi pi-check" type="submit" autofocus />
      </div>
    </Form>
  </Dialog>
</template>