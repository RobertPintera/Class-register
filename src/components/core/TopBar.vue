<script setup lang="ts">

const props = defineProps<{ darkModeIcon: string }>();

</script>

<template>
  <header class="fixed justify-between w-full h-16 flex items-center border-b-2 border-primary-border p-4 pl-6 shadow-md bg-topbar-background z-10 gap-4">
    <div class="flex items-center gap-4">
       <Button icon="pi pi-bars" severity="secondary" variant="text" rounded aria-label="Bookmark" @click="$emit('toggle-sidebar')"/>
      <h3>Class Register</h3>
    </div>
    <Button :icon="props.darkModeIcon" severity="secondary" variant="text" rounded aria-label="Bookmark" @click="$emit('toggle-darkMode')"/>
  </header>
</template>