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
    <router-link :to="to">
      <div class="px-4 py-1 rounded-md hover:bg-sidebaritem-hover-background
        transition duration-75 space-x-2" :class="{ 'bg-sidebaritem-active-background': props.active}">
         <i :class="icon" />
        <span>{{ label }}</span>
      </div>
    </router-link>
  </li>
</template>