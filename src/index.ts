// Export components
import MoveableDashboard from './components/MoveableDashboard.vue';
import FloatingDashboard from './components/FloatingDashboard.vue';
import DashboardCard from './components/DashboardCard.vue';

// Export types
export * from './types';

// Export stores
export { useDashboardStore, createDashboardStore } from './stores/dashboard';
export type { DashboardState } from './stores/dashboard';

// Export composables
export { useDashboardAPI, setupGlobalDashboardAPI } from './composables/useDashboardAPI';

// Export components
export { MoveableDashboard, FloatingDashboard, DashboardCard };

// Default export for plugin installation
export default {
  install(app: any) {
    app.component('MoveableDashboard', MoveableDashboard);
    app.component('FloatingDashboard', FloatingDashboard);
    app.component('DashboardCard', DashboardCard);
  }
};
