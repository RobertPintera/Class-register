<script setup lang="ts">
import type { Test } from '@/models/Test';
import { useRegisterStore } from '@/stores/useRegisterStore';
import { isTestData } from '@/utility/typeGuards';
import type { FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { reactive, ref } from 'vue';
import z from 'zod';

const registerStore = useRegisterStore();

const visible = defineModel<boolean>('visible',{default: false});

const initialValues  = reactive<Omit<Test, 'id'> & { isRequired: boolean }>({
  name: '',
  maxScore: 0,
  weight: 1,
  isRequired: false,
  requiredScore: null,
});

const cancel = () => {
  visible.value = false;
};

const resolver = ref(zodResolver(
  z.object({
    name: z.string("Name is required").min(1, "Name is required"),
    maxScore: z.number({ message: "Max Score is required" })
      .min(1, "Max Score must be at least 1"),
    weight: z.number({ message: "Weight is required" })
      .min(0, "Weight must be at least 0"),
    isRequired: z.boolean(),
    requiredScore: z.number("Required Score must be at least 0")
      .min(0, "Required Score must be at least 0")
      .nullable()
  })
));

const submit = (event: FormSubmitEvent<Record<string, any>>) => {
  if (event.valid) {
    const values = {
      name: event.states.name.value,
      maxScore: event.states.maxScore.value,
      weight: event.states.weight.value,
      requiredScore: event.states.isRequired.value ? event.states.requiredScore.value : null
    };

    if(isTestData(values)){
      console.log(values)
      registerStore.addTest(values);
      cancel();
    } else {
      console.error("Wrong data from form!");
    };
  }
};
</script>

<template>
  <Dialog header="Add Test" v-model:visible="visible" modal>
    <Form v-slot="$form" :initialValues :resolver @submit="submit" class="flex flex-col gap-3 mt-2 w-full">
      <div class="flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputText id="name" name="name" variant="filled" class="w-60" />
          <label for="name">Name</label>
        </FloatLabel>
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputNumber id="maxScore" name="maxScore" class="w-60" variant="filled" :min="0" :max="10000" :maxFractionDigits="2" :step="0.1" :allowEmpty="true"/>
          <label for="maxScore">Max score</label>
        </FloatLabel>
        <Message v-if="$form.maxScore?.invalid" severity="error" size="small" variant="simple">{{ $form.maxScore.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputNumber id="weight" name="weight" class="w-60" variant="filled" :min="0" :max="100" :maxFractionDigits="1" :step="0.1"/>
          <label for="weight">Weight</label>
        </FloatLabel>
        <Message v-if="$form.weight?.invalid" severity="error" size="small" variant="simple">{{ $form.weight.error?.message }}</Message>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox id="isRequired" name="isRequired" binary />
        <label for="isRequired">Required</label>
      </div>
      <div class="flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputNumber id="requiredScore" name="requiredScore" class="w-60" variant="filled" :min="0" :max="100" :maxFractionDigits="1" :step="0.1" :disabled="!$form.isRequired?.value"/>
          <label for="requiredScore">Min score</label>
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