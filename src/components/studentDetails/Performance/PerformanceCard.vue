<script setup lang="ts">
const props = defineProps<{
  title: string;
  value: number;
}>();
</script>

<template>
  <div class="flex flex-col justify-center items-center w-fit">
    <h4>{{ title }}</h4>
    <Knob :modelValue="props.value" :size="200" readonly/>
  </div>
</template>