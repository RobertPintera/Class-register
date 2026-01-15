<script setup lang="ts">
import Export from '@/components/settings/cards/Export.vue';
import GeneralSettings from '@/components/settings/cards/GeneralSettings.vue';
import GradingThresholds from '@/components/settings/cards/GradingThresholds.vue';
import Import from '@/components/settings/cards/Import.vue';

</script>

<template>
  <h1 class="sr-only">Register - Settings</h1>
  <h2 class="title-section">Settings</h2>
  <div class="cards-section">
    <div class="grid grid-cols-1 lg:grid-cols-2 auto-rows-auto w-full">
      <GeneralSettings class="lg:col-span-2"/>
      <GradingThresholds  class="lg:col-span-2 row-start-2"/>
      <Import class="lg:row-start-3"/>
      <Export class="lg:row-start-3"/>
    </div>
  </div>
</template>