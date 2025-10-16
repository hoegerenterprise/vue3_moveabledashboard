// Export components
import MoveableDashboard from './components/MoveableDashboard.vue';
import DashboardCard from './components/DashboardCard.vue';

// Export types
export * from './types';

// Export components
export { MoveableDashboard, DashboardCard };

// Default export for plugin installation
export default {
  install(app: any) {
    app.component('MoveableDashboard', MoveableDashboard);
    app.component('DashboardCard', DashboardCard);
  }
};
