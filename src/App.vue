<script setup lang="ts">
import { onMounted } from "vue";
import { useRegisterStore } from "./stores/useRegisterStore";

const store = useRegisterStore();

onMounted(() => {
  console.log("Loading Data");
  store.loadData();
});
</script>

<template>
  <router-view />
</template>

<style scoped>

</style>