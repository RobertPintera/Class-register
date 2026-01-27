<script setup lang="ts">
import { ref } from 'vue';

const lightImage = ref<string>(new URL('@/assets/presentation/preview_dashboard.png', import.meta.url).href);
const darkImage = ref<string>(new URL('@/assets/presentation/preview_dashboard_dark.png', import.meta.url).href);

</script>

<template>
  <div class="px-12 py-16 w-full flex flex-col gap-8 items-center justify-center">
    <h2>Presentation</h2>
    <ImageCompare aria-label="Presentation" class="max-w-7xl w-full rounded-2xl overflow-hidden aspect-[1920/959] border-4 border-primary-border shadow">
      <template #left>
        <img :src="lightImage">
      </template>
      <template #right>
        <img :src="darkImage">
      </template>
    </ImageCompare>
  </div>
</template>