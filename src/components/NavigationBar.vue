<script setup lang="ts">
  import { ref } from 'vue';

  const items = ref([
    { label: 'Records', icon: 'pi pi-palette', route: '/records' },
    { label: 'Statistics', icon: 'pi pi-link', route: '/statistics' }
  ])
</script>

<template>
  <Menubar :model="items">
    <template #start>
      <span>Class register</span>
    </template>
    <template #item="{ item, props }">
      <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
        </a>
      </router-link>
    </template>
  </Menubar>
</template>

<style scoped>

</style>
