<script setup lang="ts">
const props =  defineProps({
  to: { type: String, required: true },
  label: { type: String, required: true },
  icon: String,
  active: { type: Boolean, default: false },
});
</script>

<template>
  <li class="ml-4 mt-2">
    <router-link :to="to" class="space-x-1">
      <i :class="icon" />
      <span>{{ label }}</span>
    </router-link>
  </li>
</template>