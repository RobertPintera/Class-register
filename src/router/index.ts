import RecordsView from "@/pages/RecordsView.vue";
import StatisticsView from "@/pages/StatisticsView.vue";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[]  = [
  { path: '/', redirect: '/records' },
  { path: '/records', component: RecordsView },
  { path: '/statistics', component: StatisticsView }
];

export default createRouter({
  history: createWebHistory(),
  routes
});