<script setup lang="ts">
  import SideBar from '@/components/SideBar.vue';
  import TopBar from '@/components/TopBar.vue';


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
