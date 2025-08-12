<script setup lang="ts">
const props = defineProps<{ name: string, surname: string }>();
</script>

<template>
  <div class="card">
    <h3>Personal Data</h3>
    <h4>Name: {{ props.name }}</h4>
    <h4>Surname: {{ props.surname }}</h4>
  </div>
</template>