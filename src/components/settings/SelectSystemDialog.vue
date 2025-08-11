<script setup lang="ts">
   import { ref } from 'vue';
   import { useGradingSystems } from '@/utility/gradingSystemsData';
   import type { FormSubmitEvent } from '@primevue/forms';
   import { zodResolver } from '@primevue/forms/resolvers/zod';
   import { z } from 'zod';
   import { useRegisterStore } from '@/stores/useRegisterStore';
   import type { GradingSystem } from '@/models/GradingSystem';

   const registerStore = useRegisterStore();

   const visible = defineModel<boolean>('visible', {default: false});
   const gradingSystems: GradingSystem[] = useGradingSystems();
   const initialValues = ref();

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

   const submit = (event: FormSubmitEvent<Record<string, any>>) => {
      if (event.valid && event.states.system) {
         registerStore.replaceGradeThresholds(event.states.system.value.gradethresholds);
         visible.value = false;
      }
   };
</script>

<template>
   <Dialog header="Select Grading system" v-model:visible="visible" modal>
      <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver"  @submit="submit" class="flex flex-col gap-4 w-full">
         <Listbox  name="system" :options="gradingSystems" optionLabel="name" :virtualScrollerOptions="{ itemSize: 20 }" class="w-full" listStyle="height:250px" striped fluid/>
         <Message v-if="$form.system?.invalid" severity="error" size="small" variant="simple">{{ $form.system.error?.message }}</Message>
         <Button label="Select" type="submit" autofocus />
      </Form>
   </Dialog>
</template>