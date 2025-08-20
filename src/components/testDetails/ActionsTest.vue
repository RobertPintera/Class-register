<script setup lang="ts">
import Card from '../core/Card.vue';


</script>

<template>
   <Card>
    <template #header>
      <h3>Actions</h3>
    </template>
    <template #body>
      <div class="flex flex-col">
        <h4>Edit Info Data</h4>
        <Button label="Edit" class="w-fit"/>
      </div>
    </template>
  </Card>
</template>