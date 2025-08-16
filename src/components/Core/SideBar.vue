<script setup lang="ts">
import { ref } from 'vue';
import SideBarItem from './SideBarItem.vue';

const props = defineProps<{visible: boolean, isLargeScreen:boolean}>();

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
  <nav class="fixed w-64 flex flex-col overflow-auto transition-all duration-500 ease-in-out z-30"
      :class="{
        'card m-4 h-[calc(100vh-6rem)] top-16': isLargeScreen,
        'bg-white h-full top-0 p-4': !isLargeScreen,
        'left-[-18rem]': !visible,
        'left-0': visible
      }">
      <div v-for="section in items" :key="section.label" class="space-y-1">
        <h3 class="text-gray-500 font-semibold uppercase text-sm">{{ section.label }}</h3>
        <ul>
          <SideBarItem
            v-for="item in section.items" :key="item.route"
            :label="item.label" :icon="item.icon"
            :to="item.route" :active="$route.path === item.route"
            @click="$emit('select')"
          />
        </ul>
      </div>
    </nav>
</template>