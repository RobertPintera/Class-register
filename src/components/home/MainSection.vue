<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDashboard = () => {
  router.push('/main/dashboard');
};

</script>

<template>
  <div class="p-48 w-full h-[700px] flex flex-col justify-center items-center gap-5">
    <h1 class="text-6xl">Class register</h1>
    <h2>The offline tool to manage student grades and track their progress.</h2>
    <Button label="Start to use" size="large" @click="goToDashboard"/>
  </div>
</template>