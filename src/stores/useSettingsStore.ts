import type { Settings } from "@/models/Settings";
import { settingsService } from "@/services/settingsService";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useSettingsStore = defineStore('settings', () => {
  const _settings = ref<Settings>();
  const settings = computed(() => _settings.value);

  const updateSettings = async (data: Partial<Omit<Settings, 'id'>>) => {
    if (!_settings.value) return;
    
    await settingsService.updateSettings(data);
    Object.assign(_settings.value, data);
  };

  const setSettings = (newSettings: Settings) => {
    _settings.value = newSettings;
  };

  return {
    settings,
    updateSettings, setSettings
  };
});