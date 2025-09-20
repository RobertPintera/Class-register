<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';

const images = [
  {
    alt: "Dashboard",
    src: new URL('@/assets/presentation/preview_dashboard.png', import.meta.url).href
  },
  {
    alt: "Grades",
    src: new URL("@/assets/presentation/preview_grades_1.png", import.meta.url).href
  },
  {
    alt: "Settings",
    src: new URL("@/assets/presentation/preview_settings.png", import.meta.url).href
  },
  {
    alt: "StudentDetails",
    src: new URL("@/assets/presentation/preview_studentDetails_1.png", import.meta.url).href
  },
  {
    alt: "StudentsList",
    src: new URL("@/assets/presentation/preview_studentsList.png", import.meta.url).href
  },
  {
    alt: "TestDetails",
    src: new URL("@/assets/presentation/preview_testDetails_1.png", import.meta.url).href
  },
  {
    alt: "TestsList",
    src: new URL("@/assets/presentation/preview_testsList.png", import.meta.url).href
  },
];

const container = ref<HTMLElement | null>(null);
const itemRefs = ref<HTMLElement[]>([]);
const currentIndex = ref<number>(Math.floor(images.length/2));
const offset = ref<number>(0);
const isResizing = ref(false);
let resizeTimeout: number | undefined;

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length;
  recenter();
};

const previous = () => {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length;
  recenter();
};


const handleResize = () => {
  isResizing.value = true;

  recenter();

  clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(() => {
    isResizing.value = false;
  }, 150);
};

const recenter = () => {
  if (!container.value || !itemRefs.value[currentIndex.value]) return;

  const contRect = container.value.getBoundingClientRect();
  const activeRect = itemRefs.value[currentIndex.value].getBoundingClientRect();

  const contCenter = contRect.left + contRect.width / 2;
  const activeCenter = activeRect.left + activeRect.width / 2;

  offset.value += contCenter - activeCenter;
};

onMounted(() => {
  // Wait a tick to ensure the DOM is fully rendered before calculating positions
  setTimeout(() => recenter(), 0);
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

</script>

<template>
  <div class="relative flex justify-center gap-10 w-full">
    <Button icon="pi pi-arrow-left" rounded variant="outlined" @click="previous" class="absolute top-1/2 left-8 z-20"/>
    <Button icon="pi pi-arrow-right" rounded variant="outlined" @click="next" class="absolute top-1/2 right-8 z-20"/>

    <div class="absolute left-0 top-0 h-full w-64 bg-gradient-to-r from-primary-background to-transparent z-10"/> 
    <div class="absolute right-0 top-0 h-full w-64 bg-gradient-to-l from-primary-background to-transparent z-10"/>

    <div ref="container" class="relative overflow-hidden">
      <ul class="flex gap-8 transition-transform" 
      :class="{ 'transition-none': isResizing }" 
      :style="{ transform: `translateX(${offset}px)` }">
        <li v-for="(img, i) in images" :key="i"  :ref="el => { if (el) itemRefs[i] = el as HTMLElement }" class="flex-shrink-0 ">
          <img :src="img.src" :alt="img.alt"
            class="w-full min-w-[128px] max-w-[50vw] border-4 border-primary-border rounded-2xl select-none"
            :draggable="false"
          >
        </li>
      </ul>
    </div>
  </div>
</template>