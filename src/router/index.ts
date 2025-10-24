import { createRouter, createWebHistory } from 'vue-router';
import Dashboard1 from '../pages/Dashboard1.vue';
import Dashboard2 from '../pages/Dashboard2.vue';
import JSONViewer from '../pages/JSONViewer.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard1'
  },
  {
    path: '/dashboard1',
    name: 'Dashboard1',
    component: Dashboard1,
    meta: {
      title: 'Dashboard 1 - Main Workspace'
    }
  },
  {
    path: '/dashboard2',
    name: 'Dashboard2',
    component: Dashboard2,
    meta: {
      title: 'Dashboard 2 - Analytics'
    }
  },
  {
    path: '/json',
    name: 'JSONViewer',
    component: JSONViewer,
    meta: {
      title: 'JSON Data Viewer'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Update page title on navigation
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Vue3 Moveable Dashboard`;
  }
  next();
});

export default router;
