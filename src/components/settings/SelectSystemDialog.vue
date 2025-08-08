<script setup lang="ts">
   import { computed, ref } from 'vue';
   import { useGradingSystems } from '@/utility/gradingSystemsData';
   import type { FormSubmitEvent } from '@primevue/forms';
   import { zodResolver } from '@primevue/forms/resolvers/zod';
   import { z } from 'zod';
   import { useRegisterStore } from '@/stores/useRegisterStore';
   import type { GradingSystem } from '@/models/GradingSystem';

   const props = defineProps<{ visible: boolean }>();
   const emit = defineEmits<{
      (e: 'update:visible', value: boolean): void
   }>();

   const registerStore = useRegisterStore();

   const gradingSystems: GradingSystem[] = useGradingSystems();

   const visibleLocal = computed({
      get: () => props.visible,
      set: (value: boolean) => emit('update:visible', value)
   });

   const initialValues = ref({
      system: null
   });

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
         emit('update:visible', false);
      }
   };
</script>

<template>
   <Dialog header="Select Grading system" v-model:visible="visibleLocal" modal>
      <Form v-slot="$form" :resolver="resolver" :initialValues="initialValues" @submit="submit" class="flex flex-col gap-4 w-full">
         <div class="flex flex-col gap-4">
            <Listbox  name="system" :options="gradingSystems" optionLabel="name" :virtualScrollerOptions="{ itemSize: 20 }" class="w-full" listStyle="height:250px" striped fluid/>
            <Message v-if="$form.system?.invalid" severity="error" size="small" variant="simple">{{ $form.system.error?.message }}</Message>
            <Button label="Select" type="submit" autofocus />
         </div> 
      </Form>
   </Dialog>
</template>