<script setup lang="ts">
import Card from '@/components/core/Card.vue';


</script>

<template>
  <Card>
    <template #header>
      <h3>Export</h3>
    </template>
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <h4>Save data (in progress)</h4>
          <Button label="Save" class="w-fit"/>
        </div>
      </div>
    </template>
  </Card>
</template>