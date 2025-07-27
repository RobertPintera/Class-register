<script setup lang="ts">
  import SideBar from '@/components/core/SideBar.vue';
  import TopBar from '@/components/core/TopBar.vue';
</script>

<template>
  <div class="min-h-full">
    <TopBar />
    <SideBar />
    <div class="ml-72 pt-16">
      <router-view /> 
    </div>
  </div>
</template>
