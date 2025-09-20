<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToDashboard = () => {
  router.push('/main/dashboard');
};

</script>

<template>
  <div class="py-48 px-12 lg:px-48 w-full flex flex-col justify-center items-center gap-5 text-center">
    <h1 class="text-6xl">Class register</h1>
    <h2>The offline tool to manage student grades and track their progress.</h2>
    <Button label="Start to use" size="large" @click="goToDashboard"/>
  </div>
</template>