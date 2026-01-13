<script setup lang="ts">
import SideBar from '@/components/core/SideBar.vue';
import TopBar from '@/components/core/TopBar.vue';
import { useRegisterStore } from '@/stores/useRegisterStore';
import { onMounted, ref } from 'vue';

const store = useRegisterStore();

const sidebarVisible = ref(true);
const isLargeScreen = ref(window.innerWidth >= 1280);

const updateScreen = () => {
  const wasLarge = isLargeScreen.value;
  isLargeScreen.value = window.innerWidth >= 1280;
  if (!wasLarge && isLargeScreen.value) {
    sidebarVisible.value = true;
  }

  if (wasLarge && !isLargeScreen.value) {
    sidebarVisible.value = false;
  }
};

window.addEventListener('resize', updateScreen);

onMounted(() => {
  if (isLargeScreen.value) {
    sidebarVisible.value = true;
  }

  if (!isLargeScreen.value) {
    sidebarVisible.value = false;
  }
});

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

</script>

<template>
  <div class="min-h-full">
    <Transition>
      <div 
        v-if="sidebarVisible && !isLargeScreen"
        class="fixed inset-0 bg-black/50 z-20"
        @click="sidebarVisible = false"
      />
    </Transition>
    
    <TopBar :is-toggle-sidebar="true" @toggle-sidebar="toggleSidebar"/>
    <SideBar :visible="sidebarVisible" :isLargeScreen="isLargeScreen" @select="isLargeScreen ? null : toggleSidebar()"/>
    <div
      v-if="store.isLoading"
      class="fixed top-0 left-0 w-full h-full bg-black/40 z-[9999] flex items-center justify-center"
    >
      <ProgressSpinner
        style="width:200px;height:200px"
        strokeWidth="4"
        animationDuration=".8s"
      />
    </div>
    <div v-else class="pt-16 transition-[margin-left] duration-500 ease-in-out"
      :class="{
        'ml-0': !sidebarVisible,
        'ml-72': sidebarVisible && isLargeScreen
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