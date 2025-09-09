<script setup lang="ts">
import { computed, ref } from 'vue';
import SideBarItem from '@/components/core/SideBarItem.vue';
import type { SideBarItemData } from '@/models/SideBarItemData';
import { useTestsStore } from '@/stores/useTestsStore';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { useRoute } from 'vue-router';


const studentsStore = useStudentsStore();
const testsStore = useTestsStore();
const route = useRoute();

const props = defineProps<{visible: boolean, isLargeScreen:boolean}>();

const items = computed<{ label: string; items: SideBarItemData[] }[]>(() => {
  const studentId = route.params.studentId as string | undefined;
  const testId = route.params.testId as string | undefined;

  const currentStudent = studentId ? studentsStore.getStudent(studentId) : null;
  const currentTest = testId ? testsStore.getTest(testId) : null;

  return[
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
        { label: 'Tests', icon: 'pi pi-book', route: '/tests',
          items: [
            ...(currentTest ? [
              {
                label: currentTest ? `${currentTest.name}` : 'test',
                icon: "pi pi-clipboard",
                route: `/tests/test/${testId}`,
              }
            ] : []),
          ]
        },
        { label: 'Students', icon: 'pi pi-users', route: '/students',
          items: [
            ...(currentStudent ? [
              {
                label: currentStudent ? `${currentStudent.name} ${currentStudent.surname}` : 'student',
                icon: "pi pi-user",
                route: `/students/student/${studentId}`,
              }
            ] : []),
          ]
        },
        { label: 'Settings', icon: 'pi pi-cog', route: '/settings'}
      ]
    }];
});

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
        <h3 class="font-semibold uppercase text-sm">{{ section.label }}</h3>
        <ul>
          <SideBarItem
            v-for="item in section.items" :key="item.route" :="item" 
            :active="$route.path === item.route"
            @click="$emit('select')"
          />
        </ul>
      </div>
    </nav>
</template>