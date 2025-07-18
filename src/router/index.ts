import RecordsView from "@/pages/RecordsView.vue";
import StatisticsView from "@/pages/StatisticsView.vue";
import StudentView from "@/pages/StudentView.vue";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[]  = [
  { path: '/', redirect: '/records' },
  { path: '/records', component: RecordsView },
  { path: '/statistics', component: StatisticsView },
  { path: '/student/:studentId', component: StudentView, props: true }
];

export default createRouter({
  history: createWebHistory(),
  routes
});