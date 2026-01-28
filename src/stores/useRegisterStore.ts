import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { saveAs } from 'file-saver';
import { settingsService } from "@/services/settingsService";
import { gradeThresholdService } from "@/services/gradeThresholdService";
import { registerService } from "@/services/registerService";

export const useRegisterStore = defineStore('register', () => {
  const _isLoading = ref(false);
  const isLoading = computed(() => _isLoading.value);

  const loadData = async () => {
    if (_isLoading.value) return;
    _isLoading.value = true;

    await settingsService.initSettings();
    await gradeThresholdService.initGradeThresholds();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    _isLoading.value = false;
  };

  const loadDemoData = async () => {
    if (isLoading.value) return;
    _isLoading.value = true;

    await registerService.createDemoData();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    _isLoading.value = false;
  };

  const exportToJson = async () => {
    const blob = await registerService.exportToJson();
    saveAs(blob, "register-class-data.json");
  };

  const importFromJson = async (json: string) => {
    await registerService.importFromJson(json);
    await loadData();
  };

  return {
    isLoading,
    loadData, loadDemoData, exportToJson, importFromJson
  };
});