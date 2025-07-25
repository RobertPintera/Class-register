<script setup lang="ts">

  const props =  defineProps({
    to: { type: String, required: true },
    label: { type: String, required: true },
    icon: String,
    active: { type: Boolean, default: false },
  });

</script>

<template>
  <li>
    <router-link :to="to" class="space-x-1">
      <span :class="icon"/>
      <span class="text-sm">{{ label }}</span>
    </router-link>
  </li>
  
</template>