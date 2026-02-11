<script setup lang="ts">
import type { SideBarItemData } from '@/models/SideBarItemData';


const props = defineProps<SideBarItemData & { active?: boolean }>();

</script>

<template>
  <li>
    <router-link :to="route" :data-cy="`sidebar-${label.toLowerCase().replace(/\s+/g, '-')}`">
      <div class="px-4 py-1 rounded-md hover:bg-sidebaritem-hover-background transition duration-75 space-x-2" 
        :class="{ 'bg-sidebaritem-active-background': active}">
         <i :class="icon" />
        <span>{{ label }}</span>
      </div>
    </router-link>

    <!-- Children of main item -->
    <ul v-if="props.items?.length" class="pl-6">
      <SideBarItem
        v-for="child in props.items" :key="child.route" :="child"
        :active="$route.path === child.route"
      />
    </ul>
  </li>
</template>