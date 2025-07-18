<script setup lang="ts">
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const studentId = route.params.studentId as string | undefined;
</script>

<template>
  <h1>{{studentId}}</h1>
</template>