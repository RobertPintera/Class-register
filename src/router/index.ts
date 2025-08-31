import DefaultLayout from "@/layouts/DefaultLayout.vue";
import DashboardView from "@/views/DashboardView.vue";
import GradesView from "@/views/GradesView.vue";
import StudentsListView from "@/views/StudentsListView.vue";
import StudentDetailsView from "@/views/StudentDetailsView.vue";

import { createRouter, createWebHashHistory, createWebHistory, type RouteRecordRaw } from "vue-router";
import TestsListView from "@/views/TestsListView.vue";
import SettingsView from "@/views/SettingsView.vue";
import TestDetailsView from "@/views/TestDetailsView.vue";

const routes: RouteRecordRaw[]  = [
  { path: '/', 
    component: DefaultLayout,
    children: [
      { path: '', component: DashboardView },
      { path: 'grades', component: GradesView },
      { path: 'tests', component: TestsListView},
      { path: 'test/:testId', component: TestDetailsView, props: true },
      { path: 'students', component: StudentsListView },
      { path: 'student/:studentId', component: StudentDetailsView, props: true },
      { path: 'settings', component: SettingsView }
    ]
  },
];

export default createRouter({
  history: createWebHashHistory(
    import.meta.env.PROD ? '/Class-register/' : '/'
  ),
  routes
});