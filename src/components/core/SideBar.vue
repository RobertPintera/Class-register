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
        { label: 'Dashboard', icon: 'pi pi-home', route: '/main/dashboard' },
      ]
    },
    {
      label: "Register",
      items: [
        { label: 'Grades', icon: 'pi pi-objects-column', route: '/main/grades' },
        { label: 'Tests', icon: 'pi pi-book', route: '/main/tests',
          items: [
            ...(currentTest ? [
              {
                label: currentTest ? `${currentTest.name}` : 'test',
                icon: "pi pi-clipboard",
                route: `/main/tests/test/${testId}`,
              }
            ] : []),
          ]
        },
        { label: 'Students', icon: 'pi pi-users', route: '/main/students',
          items: [
            ...(currentStudent ? [
              {
                label: currentStudent ? `${currentStudent.name} ${currentStudent.surname}` : 'student',
                icon: "pi pi-user",
                route: `/main/students/student/${studentId}`,
              }
            ] : []),
          ]
        },
        { label: 'Settings', icon: 'pi pi-cog', route: '/main/settings'}
      ]
    }];
});

</script>

<template>
  <nav data-cy="sidebar" class="fixed w-64 flex flex-col z-30
    transition-[left,top] duration-500 ease-in-out"
      :class="{
        'top-16': isLargeScreen,
        'top-0': !isLargeScreen,
        'left-[-18rem]': !visible,
        'left-0': visible
      }">
      <div class="bg-sidebar-background w-full overflow-auto ease-in-out"
        :class="{
          'sidebar m-4 h-[calc(100vh-6rem)]': isLargeScreen,
          'h-[100vh] p-4': !isLargeScreen
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
      </div>
    </nav>
</template>