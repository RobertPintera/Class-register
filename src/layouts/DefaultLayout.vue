<script setup lang="ts">
import SideBar from '@/components/core/SideBar.vue';
import TopBar from '@/components/core/TopBar.vue';
import { useGlobalStore } from '@/stores/useGlobalStore';
import { useRegisterStore } from '@/stores/useRegisterStore';
import { onMounted, ref, watch } from 'vue';

const globalStore = useGlobalStore();
const registerStore = useRegisterStore();

const sidebarVisible = ref(true);

onMounted(() => {
  if (globalStore.isLargeScreen) {
    sidebarVisible.value = true;
  }

  if (!globalStore.isLargeScreen) {
    sidebarVisible.value = false;
  }
});

watch(() => globalStore.isLargeScreen, (isLarge) => {
  sidebarVisible.value = isLarge;
});

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

</script>

<template>
  <div class="min-h-full">
    <Transition>
      <div 
        v-if="sidebarVisible && !globalStore.isLargeScreen"
        class="fixed inset-0 bg-black/50 z-20"
        @click="sidebarVisible = false"
      />
    </Transition>
    
    <TopBar :is-toggle-sidebar="true" :visible="sidebarVisible" @toggle-sidebar="toggleSidebar"/>
    <SideBar :visible="sidebarVisible" :isLargeScreen="globalStore.isLargeScreen" @select="globalStore.isLargeScreen ? null : toggleSidebar()"/>
    <div
      v-if="registerStore.isLoading"
      class="fixed top-0 left-0 w-full h-full bg-black/40 z-[9999] flex items-center justify-center"
    >
      <ProgressSpinner
        style="width:200px; height:200px"
        strokeWidth="4"
        animationDuration=".8s"
      />
    </div>
    <div v-else class="pt-16 transition-[margin-left] duration-500 ease-in-out"
      :class="{
        'ml-0': !sidebarVisible,
        'ml-72': sidebarVisible && globalStore.isLargeScreen
      }">
      <div class="mx-auto max-w-[1640px]">
        <router-view /> 
      </div>
    </div>
  </div>
  <ConfirmDialog :draggable="false"/>
  <Toast />
</template>

<style scoped>
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>