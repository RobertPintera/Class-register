<script setup lang="ts">
  import GradingScaleDatatable from '@/components/settings/GradingScaleDatatable.vue';
  import { useRegisterStore } from '@/stores/useRegisterStore';
  import { onMounted, ref, watch } from 'vue';

  const registerStore = useRegisterStore();

  const selectedEditGrade = ref<{name: string, code: string}>();
  const editGradesOption = ref([
    { name: 'With dialog', code: 'D' },
    { name: 'With input', code: 'I' },
  ]);

  onMounted(() => {
    if(registerStore.settings?.editWithDialog){
      selectedEditGrade.value = { name: 'With dialog', code: 'D' };
    } else{
      selectedEditGrade.value = { name: 'With input', code: 'I' };
    }
  });

  watch(selectedEditGrade, () => {
    if(selectedEditGrade.value?.code === 'D'){
      registerStore.updateSettings({editWithDialog: true});
    } else{
      registerStore.updateSettings({editWithDialog: false});
    }
  }, { deep: true });
</script>

<template>
  <h2 class="m-4">Settings</h2>
    <div class="card">
      <h3>General</h3>
      <div class="flex items-center gap-4">
        <h5>Editing grade:</h5>
        <Select v-model="selectedEditGrade" :options="editGradesOption" optionLabel="name" placeholder="Select" class="w-full md:w-56" />
      </div>
      <h3>Scoring Thresholds</h3>
      <GradingScaleDatatable/>
    </div>
</template>