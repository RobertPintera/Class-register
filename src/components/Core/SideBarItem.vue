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
      <div class="px-4 py-1 rounded-lg hover:bg-blue-100 transition duration-75" :class="{ 'bg-blue-200': props.active}">
         <i :class="icon" />
        <span>{{ label }}</span>
      </div>
    </router-link>
    
  </li>
</template>