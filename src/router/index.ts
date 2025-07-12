import RecordsView from "@/pages/RecordsView.vue";
import StatisticsView from "@/pages/StatisticsView.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: '/records', name: 'Records', component: RecordsView },
  { path: '/statistics', name: 'About', component: StatisticsView }
]

export default createRouter({
  history: createWebHistory(),
  routes
})