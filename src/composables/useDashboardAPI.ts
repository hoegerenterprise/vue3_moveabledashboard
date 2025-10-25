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

  // Type assertion to work around Pinia's type inference limitations with Options API stores
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typedStore = store as any;

  return {
    // ==================== STATE (Reactive) ====================

    /**
     * All dashboard cards (reactive)
     */
    cards: computed(() => typedStore.cards),

    /**
     * Cards sorted by z-index (reactive)
     */
    sortedCards: computed(() => typedStore.sortedCards),

    /**
     * Currently selected card ID (reactive)
     */
    selectedCardId: computed(() => typedStore.selectedCardId),

    /**
     * Currently selected card object (reactive)
     */
    selectedCard: computed(() => typedStore.selectedCard),

    /**
     * Edit mode status (reactive)
     */
    editMode: computed(() => typedStore.editMode),

    /**
     * Total number of cards (reactive)
     */
    totalCards: computed(() => typedStore.totalCards),

    /**
     * Grid enabled status (reactive)
     */
    gridEnabled: computed(() => typedStore.gridEnabled),

    /**
     * Grid size in pixels (reactive)
     */
    gridSize: computed(() => typedStore.gridSize),

    /**
     * Snap to grid enabled status (reactive)
     */
    snapToGrid: computed(() => typedStore.snapToGrid),

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
      return typedStore.addCard(card);
    },

    /**
     * Get a specific card by ID
     *
     * @param cardId - The card ID
     * @returns The card object or undefined if not found
     */
    getCard(cardId: string): IMoveableDashboardContainer | undefined {
      return typedStore.getCardById(cardId);
    },

    /**
     * Get cards filtered by type
     *
     * @param type - Card type (e.g., 'chart', 'stats', 'list')
     * @returns Array of cards matching the type
     */
    getCardsByType(type: string): IMoveableDashboardContainer[] {
      return typedStore.getCardsByType(type);
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
      return typedStore.updateCardPosition(cardId, position);
    },

    /**
     * Update card size
     *
     * @param cardId - Card ID
     * @param size - New size { width }
     * @returns true if successful, false if card not found
     */
    updateCardSize(cardId: string, size: { width: number }): boolean {
      return typedStore.updateCardSize(cardId, size);
    },

    /**
     * Update card rotation
     *
     * @param cardId - Card ID
     * @param rotation - Rotation angle in degrees
     * @returns true if successful, false if card not found
     */
    updateCardRotation(cardId: string, rotation: number): boolean {
      return typedStore.updateCardRotation(cardId, rotation);
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
      return typedStore.updateCard(cardId, updates);
    },

    /**
     * Delete a card
     *
     * @param cardId - Card ID to delete
     * @returns true if deleted, false if not found
     */
    deleteCard(cardId: string): boolean {
      return typedStore.deleteCard(cardId);
    },

    /**
     * Delete multiple cards at once
     *
     * @param cardIds - Array of card IDs to delete
     * @returns Number of cards successfully deleted
     */
    deleteCards(cardIds: string[]): number {
      return typedStore.deleteCards(cardIds);
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
      return typedStore.duplicateCard(cardId, offset);
    },

    /**
     * Check if a card exists
     *
     * @param cardId - Card ID to check
     * @returns true if card exists, false otherwise
     */
    hasCard(cardId: string): boolean {
      return typedStore.hasCard(cardId);
    },

    /**
     * Clear all cards from the dashboard
     */
    clearAllCards(): void {
      typedStore.clearAllCards();
    },

    // ==================== SELECTION ====================

    /**
     * Select a card
     *
     * @param cardId - Card ID to select
     * @returns true if selected, false if card not found
     */
    selectCard(cardId: string): boolean {
      return typedStore.selectCard(cardId);
    },

    /**
     * Deselect current card
     */
    deselectCard(): void {
      typedStore.deselectCard();
    },

    // ==================== EDIT MODE ====================

    /**
     * Toggle edit mode on/off
     */
    toggleEditMode(): void {
      typedStore.toggleEditMode();
    },

    /**
     * Set edit mode explicitly
     *
     * @param enabled - true to enable, false to disable
     */
    setEditMode(enabled: boolean): void {
      typedStore.setEditMode(enabled);
    },

    // ==================== GRID OPERATIONS ====================

    /**
     * Toggle grid visibility
     */
    toggleGrid(): void {
      typedStore.toggleGrid();
    },

    /**
     * Set grid visibility explicitly
     *
     * @param enabled - true to show grid, false to hide
     */
    setGridEnabled(enabled: boolean): void {
      typedStore.setGridEnabled(enabled);
    },

    /**
     * Set grid size in pixels
     *
     * @param size - Grid size (e.g., 20, 50)
     *
     * @example
     * ```typescript
     * dashboard.setGridSize(50); // 50px grid
     * ```
     */
    setGridSize(size: number): void {
      typedStore.setGridSize(size);
    },

    /**
     * Toggle snap-to-grid functionality
     */
    toggleSnapToGrid(): void {
      typedStore.toggleSnapToGrid();
    },

    /**
     * Set snap-to-grid explicitly
     *
     * @param enabled - true to enable snapping, false to disable
     */
    setSnapToGrid(enabled: boolean): void {
      typedStore.setSnapToGrid(enabled);
    },

    /**
     * Snap a coordinate value to the grid
     *
     * @param value - The coordinate value to snap
     * @returns Snapped value if snap-to-grid is enabled, original value otherwise
     *
     * @example
     * ```typescript
     * const snappedX = dashboard.snapToGridValue(123); // Returns 120 if gridSize is 20
     * ```
     */
    snapToGridValue(value: number): number {
      return typedStore.snapToGridValue(value);
    },

    /**
     * Re-snap all cards to the current grid size
     * Useful after changing grid size to align all cards to the new grid
     *
     * @example
     * ```typescript
     * dashboard.setGridSize(50); // Change grid size to 50px
     * dashboard.reSnapAllCards(); // Re-align all cards to new 50px grid
     * ```
     */
    reSnapAllCards(): void {
      typedStore.reSnapAllCards();
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
      typedStore.initializeCards(cards);
    },

    /**
     * Reset dashboard to default cards
     *
     * @param defaultCards - Default cards to reset to
     */
    resetToDefaults(defaultCards: IMoveableDashboardContainer[]): void {
      typedStore.resetToDefaults(defaultCards);
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
      return typedStore.exportDashboard();
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
      return typedStore.importDashboard(jsonString);
    },

    // ==================== DEBUGGING ====================

    /**
     * Get raw store instance (for advanced usage and debugging)
     *
     * @returns The Pinia store instance
     */
    getStore() {
      return typedStore;
    },

    /**
     * Log current dashboard state to console (for debugging)
     */
    debug(): void {
      console.group('Dashboard State');
      console.log(typedStore.cards);
      console.log(typedStore.totalCards);
      console.log(typedStore.selectedCardId);
      console.log(typedStore.selectedCard);
      console.log(typedStore.editMode);
      console.log(typedStore.gridEnabled);
      console.log(typedStore.gridSize);
      console.log('Snap to Grid:', typedStore.snapToGrid);
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
