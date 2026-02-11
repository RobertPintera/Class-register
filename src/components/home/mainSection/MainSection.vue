<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToDashboard = () => {
  router.push('/main/dashboard');
};
</script>

<template>
  <div class="py-48 px-12 lg:px-48 w-full flex flex-col text-center">
    <div class="mx-auto max-w-7xl flex flex-col items-center justify-center gap-4">
      <h1 class="text-6xl">Class register</h1>
      <p class="text-3xl">The offline tool to manage student grades and track their progress.</p>
      <Button data-cy="start-button" label="Start to use" size="large" @click="goToDashboard"/>
    </div>
  </div>
</template>