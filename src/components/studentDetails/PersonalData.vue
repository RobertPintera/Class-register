<script setup lang="ts">
  const props = defineProps<{ name: string, surname: string }>();
</script>

<template>
  <div class="card">
    <h3>Personal Data</h3>
    <h5>Name: {{ props.name }}</h5>
    <h5>Surname: {{ props.surname }}</h5>
  </div>
</template>