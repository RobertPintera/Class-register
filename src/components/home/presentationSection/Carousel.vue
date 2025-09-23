<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';

interface itemTemplate {
  ref: HTMLElement;
  width: number;
  startPosition: number;
};

interface CenterToItemResult {
  offsetToCenter: number;
  closestIndex: number;
}

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

const container = ref<HTMLElement | null>();
const itemActive = ref<number>(0);
const items = ref<itemTemplate[]>([]);
const totalWidth = ref<number>(0);
const offset = ref<number>(0);
const gap = 32;

const next = () => {
  itemActive.value = (itemActive.value + 1) % items.value.length;
  moveToItem();
};

const previous = () => {
  itemActive.value = (itemActive.value - 1 + items.value.length) % items.value.length;
  moveToItem();
};

const initData = () => {
  items.value.forEach(item => {
    item.width = item.ref.offsetWidth;
    item.startPosition =item.ref.offsetLeft;
  });

  const widths = items.value.map(el => el.width);
  const gapsTotal = (images.length - 1) * gap;
  totalWidth.value = widths.reduce((sum, w) => sum + w, 0) + gapsTotal;
  
  console.log(totalWidth.value);
};

function animateOffset(target: number, duration = 400) {
  const start = performance.now();
  const initial = offset.value;

  function step(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    offset.value = (initial + (target - initial) * eased);
    offset.value = ((offset.value % totalWidth.value) + totalWidth.value) % totalWidth.value;
    updatePositionItems();

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const updatePositionItems = () => {
  if (!container.value) return;
  
  items.value.forEach((item, index) => {
    const futurePosition = item.startPosition + offset.value + item.width;
    
    if(futurePosition > totalWidth.value) {
      item.ref.style.transform = `translateX(${offset.value - totalWidth.value - gap}px)`;
    }
    else if(futurePosition < 0){ 
      item.ref.style.transform = `translateX(${totalWidth.value - offset.value  + gap}px)`; 
    }
    else
    {
      item.ref.style.transform = `translateX(${offset.value}px)`;
    }

  });
};

const centerToItem = (): CenterToItemResult | undefined => {
  if (!container.value || items.value.length === 0) return;

  const containerRect = container.value.getBoundingClientRect();
  const containerCenter = containerRect.width / 2;

  let closestIndex = 0;
  let minDistance = Infinity;

  items.value.forEach((item, index) => {
    const rect = item.ref.getBoundingClientRect();
    const itemCenter = (rect.left - containerRect.left) + rect.width / 2;
    const distance = Math.abs(itemCenter - containerCenter);

    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });

  const targetRect = items.value[closestIndex].ref.getBoundingClientRect();
  const targetCenter = (targetRect.left - containerRect.left) + targetRect.width / 2;
  const offsetToCenter = containerCenter - targetCenter;

  return { offsetToCenter: offsetToCenter, closestIndex: closestIndex };
};

const centerToItemAt = (index: number): number | undefined => {
  if (!container.value) return;
  const containerRect = container.value.getBoundingClientRect();
  const containerCenter = containerRect.width / 2;

  const targetRect = items.value[index].ref.getBoundingClientRect();
  const targetCenter = (targetRect.left - containerRect.left) + targetRect.width / 2;
  const offsetToCenter = containerCenter - targetCenter;

  itemActive.value = index;

  return offsetToCenter;
};

let isDragging = false;
let startX = 0;
let startOffset = 0;

const onDragStart = (e: MouseEvent | TouchEvent) => {
  isDragging = true;
  startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  startOffset = offset.value;
  updatePositionItems();
};

const onDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging) return;
  const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const delta = currentX - startX;
  offset.value = startOffset + delta;
  updatePositionItems();
};

const onDragEnd = () => {
  if (!isDragging) return;
  isDragging = false;
  const result = centerToItem();
  if (!result) return;
  animateOffset(offset.value + result.offsetToCenter);
  itemActive.value = result?.closestIndex;
  updatePositionItems();
};

const handleResize = () => {
  initData();
  const offsetToCenter = centerToItemAt(itemActive.value);
  if (!offsetToCenter) return;
  offset.value = offset.value + offsetToCenter;
  offset.value = ((offset.value % totalWidth.value) + totalWidth.value) % totalWidth.value;
  updatePositionItems();
};

const moveToItem = () => {
  const offsetToCenter = centerToItemAt(itemActive.value);
  if (!offsetToCenter) return;
  animateOffset(offset.value + offsetToCenter);
  updatePositionItems();
};

onMounted(() => {
  // Wait a tick to ensure the DOM is fully rendered before calculating positions
  setTimeout(() => {
    handleResize();
  }, 0);
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

</script>

<template>
  <div class="relative flex justify-center gap-10 w-full">
    <Button icon="pi pi-arrow-left" rounded variant="outlined" @click="previous" class="absolute top-1/2 left-8 z-20"/>
    <Button icon="pi pi-arrow-right" rounded variant="outlined" @click="next" class="absolute top-1/2 right-8 z-20"/>

    <div class="absolute left-0 top-0 h-full w-64 bg-gradient-to-r from-primary-background to-transparent z-10 pointer-events-none"/> 
    <div class="absolute right-0 top-0 h-full w-64 bg-gradient-to-l from-primary-background to-transparent z-10 pointer-events-none"/>

    <div ref="container" class="relative overflow-hidden"
      @mousedown="onDragStart"
      @mousemove="onDragMove"
      @mouseup="onDragEnd"
      @mouseleave="onDragEnd"
      @touchstart="onDragStart"
      @touchmove="onDragMove"
      @touchend="onDragEnd">
      <ul class="flex gap-8">
        <!--  -->
        <li v-for="(img, i) in images" :key="i"  :ref="el => { if (el) items[i] = { ref: el as HTMLElement, width: 0, startPosition: 0 } }" class="flex-shrink-0">
          <img :src="img.src" :alt="img.alt"
            class="w-full min-w-[128px] max-w-[50vw] border-4 border-primary-border rounded-2xl select-none"
            :draggable="false"
          >
        </li>
      </ul>
    </div>
  </div>
</template>