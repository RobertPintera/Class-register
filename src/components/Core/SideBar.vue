<script setup lang="ts">
import { ref } from 'vue';
import SideBarItem from './SideBarItem.vue';

const items = ref([
  {
    label: "Home",
    items: [
      { label: 'Dashboard', icon: 'pi pi-home', route: '/' },
    ]
  },
  {
    label: "Register",
    items: [
      { label: 'Grades', icon: 'pi pi-objects-column', route: '/grades' },
      { label: 'Tests', icon: 'pi pi-book', route: '/tests'},
      { label: 'Students', icon: 'pi pi-users', route: '/students'},
      { label: 'Settings', icon: 'pi pi-cog', route: '/settings'}
    ]
  },
]);
</script>

<template>
  <nav class="card fixed top-16 h-[calc(100vh-6rem)] w-64 flex flex-col overflow-auto">
    <div v-for="section in items" :key="section.label" class="space-y-1">
      <h3>{{ section.label }}</h3>
      <ul>
        <SideBarItem
          v-for="item in section.items" :key="item.route"
          :label="item.label" :icon="item.icon"
          :to="item.route" :active="$route.path === item.route"
        />
      </ul>
    </div>
  </nav>
</template>

<style scoped>

</style>
