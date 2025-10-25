// Export components
import MoveableDashboard from './components/MoveableDashboard.vue';
import DashboardCard from './components/DashboardCard.vue';

// Export types
export * from './types';

// Export stores
export { useDashboardStore, createDashboardStore } from './stores/dashboard';
export type { DashboardState } from './stores/dashboard';
export { useCardCatalogStore, DEMO_CARD_TEMPLATES } from './stores/cardCatalog';
export type { CardTemplate } from './stores/cardCatalog';

// Export composables
export { useDashboardAPI, setupGlobalDashboardAPI } from './composables/useDashboardAPI';

// Export components
export { MoveableDashboard, DashboardCard };

// Default export for plugin installation
export default {
  install(app: any) {
    app.component('MoveableDashboard', MoveableDashboard);
    app.component('DashboardCard', DashboardCard);
  }
};
