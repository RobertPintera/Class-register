<script setup lang="ts">
import type { Test } from '@/models/Test';
import { useTestsStore } from '@/stores/useTestsStore';
import { isTestData } from '@/utility/typeGuards';
import type { FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { nextTick, reactive, ref, watch } from 'vue';
import z from 'zod';

const testsStore = useTestsStore();

const visible = defineModel<boolean>('visible',{default: false});

const initialValues  = reactive<{
  name: string,
  maxPoints: null | number,
  weight: null | number,
  isRequired: boolean,
  requiredPoints: null | number,
  isMandatory: boolean
}>({
  name: '',
  maxPoints: null,
  weight: null,
  isRequired: false,
  requiredPoints: null,
  isMandatory: false
});

const cancel = () => {
  visible.value = false;
};


const updateDataForm = async (visible: boolean) =>{
  if (visible) {
    initialValues.weight = 1;
    await nextTick();
    initialValues.weight = null;
  }
};

watch(() => visible.value, (visible) => {
  updateDataForm(visible);
});


const base = {
  name: z.string().min(1, "Name is required"),
  maxPoints: z.number({ message: "Max Score is required" }).min(1, "Max Score must be at least 1"),
  weight: z.number({ message: "Weight is required" }).min(0, "Weight must be at least 0"),
  isMandatory: z.boolean(),
};

const schema = z.discriminatedUnion("isRequired", [
  z.object({
    ...base,
    isRequired: z.literal(true),
    requiredPoints: z.number({ message: "Min Score is required" }).min(0, "Min Score must be at least 0"),
  }),
  z.object({
    ...base,
    isRequired: z.literal(false),
    requiredPoints: z.number().nullable().optional(),
  }),
]);

const resolver = ref(zodResolver(schema));

const submit = (event: FormSubmitEvent<Record<string, any>>) => {
  if (event.valid) {
    const values = {
      name: event.states.name.value,
      maxPoints: event.states.maxPoints.value,
      weight: event.states.weight.value,
      requiredPoints: event.states.isRequired.value ? event.states.requiredPoints.value : null,
      isMandatory: event.states.isRequired.value ? event.states.isMandatory.value : false
    };

    if(isTestData(values)){
      testsStore.addTest(values);
      cancel();
    } else {
      console.error("Wrong data from form!");
    };
  }
};
</script>

<template>
  <Dialog header="Add Test" v-model:visible="visible" :modal="true" :draggable="false" class="w-70">
    <Form v-slot="$form" :initialValues :resolver @submit="submit" class="flex flex-col gap-3 mt-2 w-full">
      <div class="flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputText id="name" name="name" variant="filled" class="w-full" />
          <label for="name">Name</label>
        </FloatLabel>
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputNumber id="maxPoints" name="maxPoints" class="w-full" variant="filled" :min="0" :max="10000" :maxFractionDigits="1" :step="0.1"/>
          <label for="maxPoints">Max score</label>
        </FloatLabel>
        <Message v-if="$form.maxPoints?.invalid" severity="error" size="small" variant="simple">{{ $form.maxPoints.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputNumber id="weight" name="weight" class="w-full" variant="filled" :min="0" :max="100" :maxFractionDigits="1" :step="0.1"/>
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
          <InputNumber id="requiredPoints" name="requiredPoints" class="w-full" variant="filled" :min="0" :max="100" :maxFractionDigits="1" :step="0.1" :disabled="!$form.isRequired?.value"/>
          <label for="requiredPoints">Min score</label>
        </FloatLabel>
        <Message v-if="$form.requiredPoints?.invalid" severity="error" size="small" variant="simple">{{ $form.requiredPoints.error?.message }}</Message>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox id="isMandatory" name="isMandatory" binary :disabled="!$form.isRequired?.value"/>
        <label for="isMandatory">Mandatory</label>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancel" variant="outlined" icon="pi pi-times" @click="cancel" />
        <Button label="Add" icon="pi pi-check" type="submit" autofocus />
      </div>
    </Form>
  </Dialog>
</template>