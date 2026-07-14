<script setup lang="ts">
import Footer from '@/components/core/Footer.vue';
import TopBar from '@/components/core/TopBar.vue';

</script>

<template>
  <div class="flex flex-col min-h-screen">
    <TopBar :is-toggle-sidebar="false"/>
    <main class="pt-16 grow">
        <router-view />
    </main>
    <Footer/>
  </div>
</template>
