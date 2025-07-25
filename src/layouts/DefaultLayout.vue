<script setup lang="ts">
  import SideBar from '@/components/SideBar.vue';
  import TopBar from '@/components/TopBar.vue';


</script>

<template>
  <div class="h-screen flex flex-col">
    <TopBar />
    <div class="flex flex-1 overflow-hidden">
      <div class="flex-none w-64">
        <SideBar />
      </div>
      <div class="flex-1 overflow-auto">
        <router-view />
      </div>
    </div>
  </div>
</template>
