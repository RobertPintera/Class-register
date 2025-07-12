<script setup lang="ts">
  import NavigationBar from './components/NavigationBar.vue';
  import { ref } from 'vue';
  

  const items = ref([
    { label: 'Records', route: '/' },
    { label: 'Statistics',  route: '/statistics' }
  ])
</script>

<template>
<NavigationBar />
  <router-view />
</template>

<style scoped>

</style>
