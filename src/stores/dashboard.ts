import { defineStore } from 'pinia';
import type { IMoveableDashboardContainer } from '../types';

/**
 * Dashboard State Interface
 */
export interface DashboardState {
  cards: IMoveableDashboardContainer[];
  editMode: boolean;
  selectedCardId: string;
  cardCounter: number;
  gridEnabled: boolean;
  gridSize: number;
  snapToGrid: boolean;
}

/**
 * Dashboard Store
 *
 * Centralized state management for dashboard cards with automatic persistence.
 * Supports multiple dashboard instances through unique store IDs.
 *
 * Features:
 * - Auto-saves to localStorage on every change
 * - Reactive state updates across all components
 * - TypeScript support with full type safety
 * - Vue DevTools integration for debugging
 */
// @ts-ignore - pinia-plugin-persistedstate types
export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    cards: [],
    editMode: true,
    selectedCardId: '',
    cardCounter: 1,
    gridEnabled: false,
    gridSize: 20,
    snapToGrid: false
  }),

  getters: {
    /**
     * Get all cards sorted by z-index
     */
    sortedCards: (state): IMoveableDashboardContainer[] => {
      return [...state.cards].sort((a, b) => (a.z || 0) - (b.z || 0));
    },

    /**
     * Get a specific card by ID
     */
    getCardById: (state) => {
      return (cardId: string): IMoveableDashboardContainer | undefined => {
        return state.cards.find(card => card.id === cardId);
      };
    },

    /**
     * Get the currently selected card
     */
    selectedCard: (state): IMoveableDashboardContainer | undefined => {
      return state.cards.find(card => card.id === state.selectedCardId);
    },

    /**
     * Get total number of cards
     */
    totalCards: (state): number => {
      return state.cards.length;
    },

    /**
     * Check if a card exists
     */
    hasCard: (state) => {
      return (cardId: string): boolean => {
        return state.cards.some(card => card.id === cardId);
      };
    },

    /**
     * Get cards by type
     */
    getCardsByType: (state) => {
      return (type: string): IMoveableDashboardContainer[] => {
        return state.cards.filter(card => card.type === type);
      };
    }
  },

  actions: {
    /**
     * Initialize dashboard with default cards
     */
    initializeCards(cards: IMoveableDashboardContainer[]) {
      this.cards = cards;
      if (cards.length > 0) {
        // Update counter based on existing cards
        const maxId = Math.max(
          ...cards.map(c => {
            const match = c.id.match(/card-(\d+)/);
            return match ? parseInt(match[1]) : 0;
          })
        );
        this.cardCounter = maxId + 1;
      }
    },

    /**
     * Add a new card to the dashboard
     */
    addCard(card: Partial<IMoveableDashboardContainer>): IMoveableDashboardContainer {
      const newCard: IMoveableDashboardContainer = {
        id: card.id || `card-${this.cardCounter++}`,
        type: card.type || 'default',
        header: card.header || `Card ${this.cardCounter - 1}`,
        x: card.x ?? 100,
        y: card.y ?? 100,
        width: card.width ?? 300,
        rotate: card.rotate ?? 0,
        z: card.z ?? 1,
        ...card
      };

      this.cards.push(newCard);
      return newCard;
    },

    /**
     * Update card position (x, y)
     */
    updateCardPosition(cardId: string, position: { x: number; y: number }): boolean {
      const card = this.cards.find(c => c.id === cardId);
      if (card) {
        card.x = position.x;
        card.y = position.y;
        return true;
      }
      return false;
    },

    /**
     * Update card size (width)
     */
    updateCardSize(cardId: string, size: { width: number }): boolean {
      const card = this.cards.find(c => c.id === cardId);
      if (card) {
        card.width = size.width;
        return true;
      }
      return false;
    },

    /**
     * Update card rotation
     */
    updateCardRotation(cardId: string, rotation: number): boolean {
      const card = this.cards.find(c => c.id === cardId);
      if (card) {
        card.rotate = rotation;
        return true;
      }
      return false;
    },

    /**
     * Update entire card properties
     */
    updateCard(cardId: string, updates: Partial<IMoveableDashboardContainer>): boolean {
      const index = this.cards.findIndex(c => c.id === cardId);
      if (index !== -1) {
        this.cards[index] = { ...this.cards[index], ...updates };
        return true;
      }
      return false;
    },

    /**
     * Delete a card
     */
    deleteCard(cardId: string): boolean {
      const index = this.cards.findIndex(c => c.id === cardId);
      if (index !== -1) {
        this.cards.splice(index, 1);
        if (this.selectedCardId === cardId) {
          this.selectedCardId = '';
        }
        return true;
      }
      return false;
    },

    /**
     * Delete multiple cards
     */
    deleteCards(cardIds: string[]): number {
      let deletedCount = 0;
      cardIds.forEach(cardId => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this as any).deleteCard(cardId)) {
          deletedCount++;
        }
      });
      return deletedCount;
    },

    /**
     * Clear all cards
     */
    clearAllCards() {
      this.cards = [];
      this.selectedCardId = '';
      this.cardCounter = 1;
    },

    /**
     * Select a card
     */
    selectCard(cardId: string): boolean {
      if (this.cards.some(c => c.id === cardId)) {
        this.selectedCardId = cardId;
        return true;
      }
      return false;
    },

    /**
     * Deselect current card
     */
    deselectCard() {
      this.selectedCardId = '';
    },

    /**
     * Toggle edit mode
     */
    toggleEditMode() {
      this.editMode = !this.editMode;
      if (!this.editMode) {
        (this as any).deselectCard();
      }
    },

    /**
     * Set edit mode
     */
    setEditMode(enabled: boolean) {
      this.editMode = enabled;
      if (!enabled) {
        (this as any).deselectCard();
      }
    },

    /**
     * Duplicate a card
     */
    duplicateCard(cardId: string, offset: { x: number; y: number } = { x: 20, y: 20 }): IMoveableDashboardContainer | null {
      const card = this.cards.find(c => c.id === cardId);
      if (card) {
        const duplicate: IMoveableDashboardContainer = {
          ...card,
          id: `card-${this.cardCounter++}`,
          x: card.x + offset.x,
          y: card.y + offset.y
        };
        this.cards.push(duplicate);
        return duplicate;
      }
      return null;
    },

    /**
     * Reset to default cards
     */
    resetToDefaults(defaultCards: IMoveableDashboardContainer[]) {
      this.cards = JSON.parse(JSON.stringify(defaultCards));
      this.selectedCardId = '';
      this.cardCounter = defaultCards.length + 1;
    },

    /**
     * Export dashboard state as JSON
     */
    exportDashboard(): string {
      return JSON.stringify({
        cards: this.cards,
        editMode: this.editMode,
        cardCounter: this.cardCounter
      }, null, 2);
    },

    /**
     * Import dashboard state from JSON
     */
    importDashboard(jsonString: string): boolean {
      try {
        const data = JSON.parse(jsonString);
        if (data.cards && Array.isArray(data.cards)) {
          this.cards = data.cards;
          this.editMode = data.editMode ?? true;
          this.cardCounter = data.cardCounter ?? this.cards.length + 1;
          this.selectedCardId = '';
          return true;
        }
        return false;
      } catch (e) {
        console.error('Failed to import dashboard:', e);
        return false;
      }
    },

    /**
     * Toggle grid visibility
     */
    toggleGrid() {
      this.gridEnabled = !this.gridEnabled;
    },

    /**
     * Set grid visibility
     */
    setGridEnabled(enabled: boolean) {
      this.gridEnabled = enabled;
    },

    /**
     * Set grid size
     */
    setGridSize(size: number) {
      this.gridSize = size;
    },

    /**
     * Toggle snap to grid
     */
    toggleSnapToGrid() {
      this.snapToGrid = !this.snapToGrid;
    },

    /**
     * Set snap to grid
     */
    setSnapToGrid(enabled: boolean) {
      this.snapToGrid = enabled;
    },

    /**
     * Snap coordinate to grid
     */
    snapToGridValue(value: number): number {
      if (this.snapToGrid) {
        return Math.round(value / this.gridSize) * this.gridSize;
      }
      return value;
    }
  },

  // Automatically persist to localStorage
  // @ts-ignore - pinia-plugin-persistedstate types
  persist: {
    key: 'vue3-moveable-dashboard',
    storage: localStorage,
    paths: ['cards', 'editMode', 'cardCounter', 'gridEnabled', 'gridSize', 'snapToGrid'] // Only persist these fields
  }
});

/**
 * Create a dashboard store with a custom ID for multiple dashboard instances
 */
export function createDashboardStore(dashboardId: string) {
  // @ts-ignore - pinia-plugin-persistedstate types
  return defineStore(`dashboard-${dashboardId}`, {
    state: (): DashboardState => ({
      cards: [],
      editMode: true,
      selectedCardId: '',
      cardCounter: 1,
      gridEnabled: false,
      gridSize: 20,
      snapToGrid: false
    }),

    getters: {
      sortedCards: (state): IMoveableDashboardContainer[] => {
        return [...state.cards].sort((a, b) => (a.z || 0) - (b.z || 0));
      },

      getCardById: (state) => {
        return (cardId: string): IMoveableDashboardContainer | undefined => {
          return state.cards.find(card => card.id === cardId);
        };
      },

      selectedCard: (state): IMoveableDashboardContainer | undefined => {
        return state.cards.find(card => card.id === state.selectedCardId);
      },

      totalCards: (state): number => {
        return state.cards.length;
      },

      hasCard: (state) => {
        return (cardId: string): boolean => {
          return state.cards.some(card => card.id === cardId);
        };
      },

      getCardsByType: (state) => {
        return (type: string): IMoveableDashboardContainer[] => {
          return state.cards.filter(card => card.type === type);
        };
      }
    },

    actions: {
      // Same actions as above
      initializeCards(cards: IMoveableDashboardContainer[]) {
        this.cards = cards;
        if (cards.length > 0) {
          const maxId = Math.max(
            ...cards.map(c => {
              const match = c.id.match(/card-(\d+)/);
              return match ? parseInt(match[1]) : 0;
            })
          );
          this.cardCounter = maxId + 1;
        }
      },

      addCard(card: Partial<IMoveableDashboardContainer>): IMoveableDashboardContainer {
        const newCard: IMoveableDashboardContainer = {
          id: card.id || `card-${this.cardCounter++}`,
          type: card.type || 'default',
          header: card.header || `Card ${this.cardCounter - 1}`,
          x: card.x ?? 100,
          y: card.y ?? 100,
          width: card.width ?? 300,
          rotate: card.rotate ?? 0,
          z: card.z ?? 1,
          ...card
        };

        this.cards.push(newCard);
        return newCard;
      },

      updateCardPosition(cardId: string, position: { x: number; y: number }): boolean {
        const card = this.cards.find(c => c.id === cardId);
        if (card) {
          card.x = position.x;
          card.y = position.y;
          return true;
        }
        return false;
      },

      updateCardSize(cardId: string, size: { width: number }): boolean {
        const card = this.cards.find(c => c.id === cardId);
        if (card) {
          card.width = size.width;
          return true;
        }
        return false;
      },

      updateCardRotation(cardId: string, rotation: number): boolean {
        const card = this.cards.find(c => c.id === cardId);
        if (card) {
          card.rotate = rotation;
          return true;
        }
        return false;
      },

      updateCard(cardId: string, updates: Partial<IMoveableDashboardContainer>): boolean {
        const index = this.cards.findIndex(c => c.id === cardId);
        if (index !== -1) {
          this.cards[index] = { ...this.cards[index], ...updates };
          return true;
        }
        return false;
      },

      deleteCard(cardId: string): boolean {
        const index = this.cards.findIndex(c => c.id === cardId);
        if (index !== -1) {
          this.cards.splice(index, 1);
          if (this.selectedCardId === cardId) {
            this.selectedCardId = '';
          }
          return true;
        }
        return false;
      },

      deleteCards(cardIds: string[]): number {
        let deletedCount = 0;
        cardIds.forEach(cardId => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((this as any).deleteCard(cardId)) {
            deletedCount++;
          }
        });
        return deletedCount;
      },

      clearAllCards() {
        this.cards = [];
        this.selectedCardId = '';
        this.cardCounter = 1;
      },

      selectCard(cardId: string): boolean {
        if (this.cards.some(c => c.id === cardId)) {
          this.selectedCardId = cardId;
          return true;
        }
        return false;
      },

      deselectCard() {
        this.selectedCardId = '';
      },

      toggleEditMode() {
        this.editMode = !this.editMode;
        if (!this.editMode) {
          (this as any).deselectCard();
        }
      },

      setEditMode(enabled: boolean) {
        this.editMode = enabled;
        if (!enabled) {
          (this as any).deselectCard();
        }
      },

      duplicateCard(cardId: string, offset: { x: number; y: number } = { x: 20, y: 20 }): IMoveableDashboardContainer | null {
        const card = this.cards.find(c => c.id === cardId);
        if (card) {
          const duplicate: IMoveableDashboardContainer = {
            ...card,
            id: `card-${this.cardCounter++}`,
            x: card.x + offset.x,
            y: card.y + offset.y
          };
          this.cards.push(duplicate);
          return duplicate;
        }
        return null;
      },

      resetToDefaults(defaultCards: IMoveableDashboardContainer[]) {
        this.cards = JSON.parse(JSON.stringify(defaultCards));
        this.selectedCardId = '';
        this.cardCounter = defaultCards.length + 1;
      },

      exportDashboard(): string {
        return JSON.stringify({
          cards: this.cards,
          editMode: this.editMode,
          cardCounter: this.cardCounter
        }, null, 2);
      },

      importDashboard(jsonString: string): boolean {
        try {
          const data = JSON.parse(jsonString);
          if (data.cards && Array.isArray(data.cards)) {
            this.cards = data.cards;
            this.editMode = data.editMode ?? true;
            this.cardCounter = data.cardCounter ?? this.cards.length + 1;
            this.selectedCardId = '';
            return true;
          }
          return false;
        } catch (e) {
          console.error('Failed to import dashboard:', e);
          return false;
        }
      },

      toggleGrid() {
        this.gridEnabled = !this.gridEnabled;
      },

      setGridEnabled(enabled: boolean) {
        this.gridEnabled = enabled;
      },

      setGridSize(size: number) {
        this.gridSize = size;
      },

      toggleSnapToGrid() {
        this.snapToGrid = !this.snapToGrid;
      },

      setSnapToGrid(enabled: boolean) {
        this.snapToGrid = enabled;
      },

      snapToGridValue(value: number): number {
        if (this.snapToGrid) {
          return Math.round(value / this.gridSize) * this.gridSize;
        }
        return value;
      }
    },

    // @ts-ignore - pinia-plugin-persistedstate types
    persist: {
      key: `vue3-moveable-dashboard-${dashboardId}`,
      storage: localStorage,
      paths: ['cards', 'editMode', 'cardCounter', 'gridEnabled', 'gridSize', 'snapToGrid']
    }
  });
}
