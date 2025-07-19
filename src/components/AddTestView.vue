<script setup lang="ts">
  import type { Test } from '@/models/Test';
  import { useRegisterStore } from '@/stores/useRegisterStore';
import { isTestData } from '@/utility/typeGuards';
  import type { FormResolverOptions, FormSubmitEvent } from '@primevue/forms';
  import { computed, reactive } from 'vue';

  const props = defineProps<{ visible: boolean }>();

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
  }>();

  const visibleLocal = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
  });

  const registerStore = useRegisterStore();

  const initialValues  = reactive<Omit<Test, 'id'>>({
    name: '',
    maxScore: 0,
    weight: 1
  });

  const cancel = () => {
    emit('update:visible', false);
  };

  const resolver = (e: FormResolverOptions) => {
    const errors: Record<string, { message: string }[]> = {};

    if (!e.values.name || e.values.name.trim() === '') {
        errors.name = [{ message: 'Name is required.' }];
    };

    if (!e.values.maxScore || e.values.maxScore <= 0){
      errors.maxScore = [{ message: "MaxScore must be greater than 0."}];
    };

    return { errors };
  };

  const submit = (event: FormSubmitEvent<Record<string, any>>) => {
    if (event.valid) {
      const values = {
        name: event.states.name.value,
        maxScore: event.states.maxScore.value,
        weight: event.states.weight.value
      };

      if(isTestData(values)){
        registerStore.addTest(values);
        emit('update:visible', false);
      } else {
        console.error("Wrong data from form!");
      };
    }
  };
</script>

<template>
  <Dialog header="Add Test" v-model:visible="visibleLocal" modal>
    <Form v-slot="$form" :initialValues :resolver @submit="submit" class="flex flex-col gap-3 mt-3">
      <div class="flex flex-col gap-1">
        <FloatLabel variant="in">
          <InputText id="name" name="name" variant="filled" class="w-60" />
          <label for="name">Name</label>
        </FloatLabel>
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <FloatLabel variant="in">
          <InputNumber id="maxScore" name="maxScore" class="w-60" variant="filled" :min="0" :max="10000" :maxFractionDigits="2" :step="0.01"/>
            <label for="maxScore">Max score</label>
        </FloatLabel>
        <Message v-if="$form.maxScore?.invalid" severity="error" size="small" variant="simple">{{ $form.maxScore.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <FloatLabel variant="in">
          <InputNumber id="weight" name="weight" class="w-60" variant="filled" :min="0" :max="100" :maxFractionDigits="1" :step="0.1"/>
          <label for="weight">Weight</label>
        </FloatLabel>
        <Message v-if="$form.weight?.invalid" severity="error" size="small" variant="simple">{{ $form.weight.error?.message }}</Message>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancel" icon="pi pi-times" @click="cancel" />
        <Button label="Add" icon="pi pi-check" type="submit" autofocus />
      </div>
    </Form>
  </Dialog>
</template>