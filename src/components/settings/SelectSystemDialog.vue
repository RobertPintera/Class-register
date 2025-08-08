<script setup lang="ts">
   import { computed, ref } from 'vue';
   import { useGradingSystems } from '@/utility/gradingSystemsData';
   import type { FormResolverOptions, FormSubmitEvent } from '@primevue/forms';

   const props = defineProps<{ visible: boolean }>();
   const emit = defineEmits<{
      (e: 'update:visible', value: boolean): void
   }>();

   const gradingSystems = useGradingSystems();
   const items = gradingSystems.map(system => ({
      name: system.name,
      value: system
   }));

   const visibleLocal = computed({
      get: () => props.visible,
      set: (value: boolean) => emit('update:visible', value)
   });

   const initialValues = ref({
      system: null
   });

   const resolver = (e: FormResolverOptions) => {
      const errors: Record<string, { message: string }[]> = {};
      console.log(e);

      if (!e.values.system) {
         errors.system = [{ message: 'You must select a grading system.' }];
      }

      return { errors };
   };

   const submit = (event: FormSubmitEvent<Record<string, any>>) => {
      if (event.valid) {
         console.log(event)
         emit('update:visible', false);
      }
   };
</script>

<template>
   <Dialog header="Select Grading system" v-model:visible="visibleLocal" modal>
      <Form v-slot="$form" :resolver="resolver" :initialValues="initialValues" @submit="submit" class="flex flex-col gap-4 w-full">
         <div class="flex flex-col gap-4">
            <Listbox name="system" :options="items" optionLabel="name" :virtualScrollerOptions="{ itemSize: 20 }" class="w-full" listStyle="height:250px" striped fluid/>
            <Message v-if="$form.system?.invalid" severity="error" size="small" variant="simple">{{ $form.system.error?.message }}</Message>
            <Button label="Select" type="submit" autofocus />
         </div> 
      </Form>
   </Dialog>
</template>