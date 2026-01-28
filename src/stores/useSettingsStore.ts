import type { Settings } from "@/models/Settings";
import { settingsService } from "@/services/settingsService";
import { defineStore } from "pinia";
import { computed, onScopeDispose, ref } from "vue";

export const useSettingsStore = defineStore('settings', () => {
  const _settings = ref<Settings>();
  const settings = computed(() => _settings.value);

  const subscription = settingsService
    .getSettings()
    .subscribe((data) => {
      _settings.value = data;
    });

  onScopeDispose(() => {
    subscription.unsubscribe();
  });


  const updateSettings = async (data: Partial<Omit<Settings, 'id'>>) => {
    if (!_settings.value) return;
    
    await settingsService.updateSettings(data);
  };

  return {
    settings,
    updateSettings,
  };
});