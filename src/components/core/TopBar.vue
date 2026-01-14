<script setup lang="ts">
import { computed } from 'vue';
import { useGlobalStore } from '@/stores/useGlobalStore';

const globalStore = useGlobalStore();

const props = withDefaults(defineProps<{ isToggleSidebar?: boolean}>(), {
  isToggleSidebar: false
});

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>();

const darkModeIcon = computed(() => globalStore.isDark ? 'pi pi-moon' : 'pi pi-sun');

</script>

<template>
  <header class="fixed justify-between w-full h-16 flex items-center border-b-2 border-primary-border p-4 pl-6 shadow-md bg-topbar-background z-10 gap-4">
    <div class="flex items-center gap-4">
      <Button v-if="isToggleSidebar" icon="pi pi-bars" severity="secondary" variant="text" rounded aria-label="Bookmark" @click="emit('toggle-sidebar')"/>
      <router-link :to="'/'"><div class="flex gap-2 justify-center items-center"><img src="/logo_class_register.svg" alt="Logo" class="h-full"><h3 class="text-xl sm:text-2xl">Class Register</h3></div></router-link>
    </div>
    <Button :icon="darkModeIcon" severity="secondary" variant="text" rounded aria-label="Bookmark" @click="globalStore.toggleDark"/>
  </header>
</template>