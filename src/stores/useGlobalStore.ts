import { defineStore } from "pinia";
import { useDark } from '@vueuse/core';
import { computed } from "vue";

export const useGlobalStore = defineStore('global', () => {
  const _isDark = useDark({ disableTransition: false });
  const isDark = computed(() => _isDark.value);
  
  const toggleDark = () => {
    _isDark.value = !_isDark.value;
  };

  return { isDark, toggleDark };
});