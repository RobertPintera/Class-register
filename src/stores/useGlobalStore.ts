import { defineStore } from "pinia";
import { useDark, useWindowSize } from '@vueuse/core';
import { computed } from "vue";

export const useGlobalStore = defineStore('global', () => {
  const _isDark = useDark();
  const isDark = computed(() => _isDark.value);
  const _windowSize = useWindowSize();
  const isLargeScreen = computed(() => _windowSize.width.value >= 1280);
  const isMediumScreen = computed(() => _windowSize.width.value >= 768);

  const toggleDark = () => {
    if ('startViewTransition' in document) {
      document.startViewTransition(() => {
        _isDark.value = !_isDark.value;
      });
      return;
    }
    _isDark.value = !_isDark.value;
  };

  return { 
    isDark,
    isMediumScreen,
    isLargeScreen,
    toggleDark 
  };
});