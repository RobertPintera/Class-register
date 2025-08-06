<script setup lang="ts">
  import SideBar from '@/components/core/SideBar.vue';
  import TopBar from '@/components/core/TopBar.vue';
  import { useRegisterStore } from '@/stores/useRegisterStore';

  const store = useRegisterStore();
</script>

<template>
  <div class="min-h-full">
    <TopBar />
    <SideBar />
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
    <div v-else class="ml-72 pt-16">
      <router-view /> 
    </div>
  </div>
</template>
