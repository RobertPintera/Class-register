<script setup lang="ts">
import TopBar from '@/components/core/TopBar.vue';


</script>

<template>
  <TopBar :is-toggle-sidebar="false"/>
  <div class="pt-16">
    <router-view />
  </div>
</template>