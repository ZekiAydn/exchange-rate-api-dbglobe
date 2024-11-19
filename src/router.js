import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import TimeSeriesView from '@/views/TimeSeriesView.vue';
import HistoryView from '@/views/HistoryView.vue';

const routes = [
    { path: '/', component: HomeView, name: 'Home' },
    { path: '/time-series', component: TimeSeriesView, name: 'TimeSeries' },
    { path: '/history', component: HistoryView, name: 'History' }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
