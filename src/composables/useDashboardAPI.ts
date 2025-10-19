import { computed } from 'vue';
import { useDashboardStore, createDashboardStore } from '../stores/dashboard';
import type { IMoveableDashboardContainer } from '../types';

/**
 * Dashboard API Composable
 *
 * Provides a clean, easy-to-use API for managing dashboard state.
 * Can be used from any component, composable, or even browser console.
 *
 * Usage:
 * ```typescript
 * // In a component
 * const dashboard = useDashboardAPI();
 * dashboard.addCard({ type: 'chart', header: 'My Chart' });
 *
 * // With custom dashboard ID (for multiple dashboards)
 * const dashboard1 = useDashboardAPI('dashboard-1');
 * const dashboard2 = useDashboardAPI('dashboard-2');
 * ```
 */
export function useDashboardAPI(dashboardId?: string) {
  // Use default store or create a custom one
  const store = dashboardId
    ? createDashboardStore(dashboardId)()
    : useDashboardStore();

  return {
    // ==================== STATE (Reactive) ====================

    /**
     * All dashboard cards (reactive)
     */
    cards: computed(() => store.cards),

    /**
     * Cards sorted by z-index (reactive)
     */
    sortedCards: computed(() => store.sortedCards),

    /**
     * Currently selected card ID (reactive)
     */
    selectedCardId: computed(() => store.selectedCardId),

    /**
     * Currently selected card object (reactive)
     */
    selectedCard: computed(() => store.selectedCard),

    /**
     * Edit mode status (reactive)
     */
    editMode: computed(() => store.editMode),

    /**
     * Total number of cards (reactive)
     */
    totalCards: computed(() => store.totalCards),

    // ==================== CARD OPERATIONS ====================

    /**
     * Add a new card to the dashboard
     *
     * @param card - Card properties (id is optional, will be auto-generated)
     * @returns The created card with all properties
     *
     * @example
     * ```typescript
     * const newCard = dashboard.addCard({
     *   type: 'chart',
     *   header: 'Sales Chart',
     *   x: 100,
     *   y: 100,
     *   width: 400
     * });
     * ```
     */
    addCard(card: Partial<IMoveableDashboardContainer>): IMoveableDashboardContainer {
      return store.addCard(card);
    },

    /**
     * Get a specific card by ID
     *
     * @param cardId - The card ID
     * @returns The card object or undefined if not found
     */
    getCard(cardId: string): IMoveableDashboardContainer | undefined {
      return store.getCardById(cardId);
    },

    /**
     * Get cards filtered by type
     *
     * @param type - Card type (e.g., 'chart', 'stats', 'list')
     * @returns Array of cards matching the type
     */
    getCardsByType(type: string): IMoveableDashboardContainer[] {
      return store.getCardsByType(type);
    },

    /**
     * Update card position
     *
     * @param cardId - Card ID
     * @param position - New position { x, y }
     * @returns true if successful, false if card not found
     *
     * @example
     * ```typescript
     * dashboard.updateCardPosition('card-1', { x: 200, y: 150 });
     * ```
     */
    updateCardPosition(cardId: string, position: { x: number; y: number }): boolean {
      return store.updateCardPosition(cardId, position);
    },

    /**
     * Update card size
     *
     * @param cardId - Card ID
     * @param size - New size { width }
     * @returns true if successful, false if card not found
     */
    updateCardSize(cardId: string, size: { width: number }): boolean {
      return store.updateCardSize(cardId, size);
    },

    /**
     * Update card rotation
     *
     * @param cardId - Card ID
     * @param rotation - Rotation angle in degrees
     * @returns true if successful, false if card not found
     */
    updateCardRotation(cardId: string, rotation: number): boolean {
      return store.updateCardRotation(cardId, rotation);
    },

    /**
     * Update any card properties
     *
     * @param cardId - Card ID
     * @param updates - Object with properties to update
     * @returns true if successful, false if card not found
     *
     * @example
     * ```typescript
     * dashboard.updateCard('card-1', {
     *   header: 'New Title',
     *   x: 300,
     *   width: 500
     * });
     * ```
     */
    updateCard(cardId: string, updates: Partial<IMoveableDashboardContainer>): boolean {
      return store.updateCard(cardId, updates);
    },

    /**
     * Delete a card
     *
     * @param cardId - Card ID to delete
     * @returns true if deleted, false if not found
     */
    deleteCard(cardId: string): boolean {
      return store.deleteCard(cardId);
    },

    /**
     * Delete multiple cards at once
     *
     * @param cardIds - Array of card IDs to delete
     * @returns Number of cards successfully deleted
     */
    deleteCards(cardIds: string[]): number {
      return store.deleteCards(cardIds);
    },

    /**
     * Duplicate a card with offset
     *
     * @param cardId - Card ID to duplicate
     * @param offset - Position offset for the duplicate (default: { x: 20, y: 20 })
     * @returns The duplicated card or null if source not found
     *
     * @example
     * ```typescript
     * const duplicate = dashboard.duplicateCard('card-1', { x: 50, y: 50 });
     * ```
     */
    duplicateCard(
      cardId: string,
      offset?: { x: number; y: number }
    ): IMoveableDashboardContainer | null {
      return store.duplicateCard(cardId, offset);
    },

    /**
     * Check if a card exists
     *
     * @param cardId - Card ID to check
     * @returns true if card exists, false otherwise
     */
    hasCard(cardId: string): boolean {
      return store.hasCard(cardId);
    },

    /**
     * Clear all cards from the dashboard
     */
    clearAllCards(): void {
      store.clearAllCards();
    },

    // ==================== SELECTION ====================

    /**
     * Select a card
     *
     * @param cardId - Card ID to select
     * @returns true if selected, false if card not found
     */
    selectCard(cardId: string): boolean {
      return store.selectCard(cardId);
    },

    /**
     * Deselect current card
     */
    deselectCard(): void {
      store.deselectCard();
    },

    // ==================== EDIT MODE ====================

    /**
     * Toggle edit mode on/off
     */
    toggleEditMode(): void {
      store.toggleEditMode();
    },

    /**
     * Set edit mode explicitly
     *
     * @param enabled - true to enable, false to disable
     */
    setEditMode(enabled: boolean): void {
      store.setEditMode(enabled);
    },

    // ==================== INITIALIZATION ====================

    /**
     * Initialize dashboard with a set of cards
     *
     * @param cards - Array of cards to initialize with
     *
     * @example
     * ```typescript
     * dashboard.initialize([
     *   { id: 'card-1', type: 'chart', header: 'Chart', x: 0, y: 0, width: 300 },
     *   { id: 'card-2', type: 'stats', header: 'Stats', x: 320, y: 0, width: 300 }
     * ]);
     * ```
     */
    initialize(cards: IMoveableDashboardContainer[]): void {
      store.initializeCards(cards);
    },

    /**
     * Reset dashboard to default cards
     *
     * @param defaultCards - Default cards to reset to
     */
    resetToDefaults(defaultCards: IMoveableDashboardContainer[]): void {
      store.resetToDefaults(defaultCards);
    },

    // ==================== IMPORT / EXPORT ====================

    /**
     * Export entire dashboard state as JSON string
     *
     * @returns JSON string of dashboard state
     *
     * @example
     * ```typescript
     * const json = dashboard.export();
     * console.log(json);
     * // Save to file or send to server
     * ```
     */
    export(): string {
      return store.exportDashboard();
    },

    /**
     * Import dashboard state from JSON string
     *
     * @param jsonString - JSON string to import
     * @returns true if successful, false if invalid JSON
     *
     * @example
     * ```typescript
     * const success = dashboard.import(jsonString);
     * if (success) {
     *   console.log('Dashboard imported successfully');
     * }
     * ```
     */
    import(jsonString: string): boolean {
      return store.importDashboard(jsonString);
    },

    // ==================== DEBUGGING ====================

    /**
     * Get raw store instance (for advanced usage and debugging)
     *
     * @returns The Pinia store instance
     */
    getStore() {
      return store;
    },

    /**
     * Log current dashboard state to console (for debugging)
     */
    debug(): void {
      console.group('Dashboard State');
      console.log('Cards:', store.cards);
      console.log('Total Cards:', store.totalCards);
      console.log('Selected Card ID:', store.selectedCardId);
      console.log('Selected Card:', store.selectedCard);
      console.log('Edit Mode:', store.editMode);
      console.groupEnd();
    }
  };
}

/**
 * Global Dashboard API
 *
 * Access dashboard API from anywhere (even outside Vue components).
 * Useful for debugging in browser console or integration with non-Vue code.
 *
 * @example
 * ```typescript
 * // In browser console:
 * window.dashboardAPI.addCard({ type: 'chart', header: 'Test' });
 * window.dashboardAPI.debug();
 * ```
 */
export function setupGlobalDashboardAPI() {
  if (typeof window !== 'undefined') {
    (window as any).dashboardAPI = useDashboardAPI();
    console.log('Dashboard API available at: window.dashboardAPI');
    console.log('Try: dashboardAPI.debug() to see current state');
  }
}

/**
 * Create multiple dashboard instances
 *
 * @example
 * ```typescript
 * const dashboard1 = useDashboardAPI('main-dashboard');
 * const dashboard2 = useDashboardAPI('secondary-dashboard');
 *
 * dashboard1.addCard({ header: 'Card in Dashboard 1' });
 * dashboard2.addCard({ header: 'Card in Dashboard 2' });
 * ```
 */
