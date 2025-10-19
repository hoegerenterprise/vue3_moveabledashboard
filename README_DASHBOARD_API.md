# Dashboard State Management Solution

A complete, production-ready state management solution for the Vue3 Moveable Dashboard using **Pinia** with **automatic localStorage persistence**.

## 🎯 What We Built

A powerful, easy-to-use API for managing dashboard state that:
- ✅ Automatically persists to localStorage
- ✅ Works from anywhere (components, composables, browser console)
- ✅ Supports multiple independent dashboards
- ✅ Provides full TypeScript support
- ✅ Includes debugging tools
- ✅ Offers import/export functionality

## 🚀 Quick Start

```typescript
import { useDashboardAPI } from 'vue3-moveable-dashboard';

const dashboard = useDashboardAPI();

// Add a card
dashboard.addCard({
  type: 'chart',
  header: 'Sales Chart',
  x: 100,
  y: 100,
  width: 400
});

// Access reactive state
console.log(dashboard.totalCards.value); // 1

// Update card
dashboard.updateCardPosition('card-1', { x: 200, y: 150 });
```

## 📦 What's Included

### 1. **Pinia Store** ([src/stores/dashboard.ts](src/stores/dashboard.ts))
Centralized state management with:
- Card CRUD operations
- Selection management
- Edit mode control
- Automatic persistence
- Export/Import functionality

### 2. **Dashboard API Composable** ([src/composables/useDashboardAPI.ts](src/composables/useDashboardAPI.ts))
Clean, easy-to-use API with:
- Reactive state properties
- Card operations (add, update, delete, duplicate)
- Selection methods
- Edit mode controls
- Import/Export
- Debugging helpers

### 3. **Complete Documentation** ([DASHBOARD_API.md](DASHBOARD_API.md))
Comprehensive API reference with:
- All methods documented
- Usage examples
- TypeScript types
- Best practices
- Troubleshooting

## 🔑 Key Features

### Automatic Persistence
All changes are automatically saved to localStorage:
```typescript
dashboard.addCard({ header: 'My Card' });
// ✅ Automatically saved to localStorage
// ✅ Persists across page refreshes
```

### Reactive State
All state is reactive and updates automatically:
```vue
<template>
  <div>Total: {{ dashboard.totalCards.value }}</div>
</template>

<script setup>
const dashboard = useDashboardAPI();
// totalCards updates automatically when cards change
</script>
```

### Multiple Dashboards
Create independent dashboard instances:
```typescript
const mainDashboard = useDashboardAPI('main');
const secondaryDashboard = useDashboardAPI('secondary');

// Each has separate state and localStorage
```

### Browser Console Access
Debug from browser console:
```javascript
// Available globally
dashboard.debug();
dashboard.addCard({ header: 'Test' });
console.log(dashboard.cards.value);
```

### Import/Export
Backup and restore dashboard state:
```typescript
// Export
const backup = dashboard.export();
localStorage.setItem('backup', backup);

// Import
const backup = localStorage.getItem('backup');
dashboard.import(backup);
```

## 📖 API Overview

### Reactive State Properties
```typescript
dashboard.cards              // All cards (reactive)
dashboard.sortedCards        // Cards sorted by z-index
dashboard.selectedCardId     // Selected card ID
dashboard.selectedCard       // Selected card object
dashboard.editMode          // Edit mode status
dashboard.totalCards        // Total card count
```

### Card Operations
```typescript
dashboard.addCard(card)                      // Add new card
dashboard.getCard(cardId)                    // Get card by ID
dashboard.getCardsByType(type)               // Filter by type
dashboard.updateCardPosition(id, {x, y})     // Update position
dashboard.updateCardSize(id, {width})        // Update size
dashboard.updateCardRotation(id, rotation)   // Update rotation
dashboard.updateCard(id, updates)            // Update any properties
dashboard.deleteCard(cardId)                 // Delete card
dashboard.deleteCards([ids])                 // Delete multiple
dashboard.duplicateCard(id, offset)          // Duplicate card
dashboard.clearAllCards()                    // Clear all
```

### Selection & Edit Mode
```typescript
dashboard.selectCard(cardId)    // Select card
dashboard.deselectCard()        // Deselect
dashboard.toggleEditMode()      // Toggle edit mode
dashboard.setEditMode(enabled)  // Set edit mode
```

### Initialization
```typescript
dashboard.initialize(cards)         // Initialize with cards
dashboard.resetToDefaults(cards)    // Reset to defaults
```

### Import/Export
```typescript
dashboard.export()          // Export as JSON string
dashboard.import(json)      // Import from JSON string
```

### Debugging
```typescript
dashboard.debug()           // Log state to console
dashboard.getStore()        // Get raw Pinia store
```

## 💡 Usage Examples

### Example 1: Component Integration
```vue
<script setup lang="ts">
import { useDashboardAPI } from 'vue3-moveable-dashboard';

const dashboard = useDashboardAPI();

function addNewCard() {
  dashboard.addCard({
    type: 'chart',
    header: 'New Chart',
    x: 100,
    y: 100,
    width: 400
  });
}
</script>

<template>
  <div>
    <button @click="addNewCard">Add Card</button>
    <p>Total Cards: {{ dashboard.totalCards.value }}</p>
  </div>
</template>
```

### Example 2: Multiple Dashboards
```typescript
// Main dashboard
const mainDashboard = useDashboardAPI('main');
mainDashboard.addCard({ header: 'Main Card 1' });

// Analytics dashboard
const analyticsDashboard = useDashboardAPI('analytics');
analyticsDashboard.addCard({ header: 'Analytics Card 1' });

// Each operates independently with separate localStorage
```

### Example 3: Backup/Restore
```typescript
const dashboard = useDashboardAPI();

// Create backup
function backup() {
  const json = dashboard.export();
  localStorage.setItem('dashboard-backup', json);
  console.log('Backed up!');
}

// Restore backup
function restore() {
  const json = localStorage.getItem('dashboard-backup');
  if (json && dashboard.import(json)) {
    console.log('Restored!');
  }
}
```

### Example 4: Browser Console Debugging
Open browser console and try:
```javascript
// The dashboard API is automatically available
dashboard.debug();

// Add a card
dashboard.addCard({
  type: 'test',
  header: 'Console Card',
  x: 0,
  y: 0,
  width: 300
});

// View all cards
console.log(dashboard.cards.value);

// Export state
console.log(dashboard.export());
```

## 🗂️ File Structure

```
src/
├── stores/
│   └── dashboard.ts              # Pinia store with persistence
├── composables/
│   └── useDashboardAPI.ts        # Dashboard API composable
├── components/
│   ├── MoveableDashboard.vue     # Dashboard component
│   └── DashboardCard.vue         # Card component
├── demo/
│   └── DemoPage.vue              # Demo (updated to use API)
├── main.ts                       # Pinia setup
└── index.ts                      # Exports

DASHBOARD_API.md                  # Complete API documentation
README_DASHBOARD_API.md           # This file
```

## 🔧 Configuration

### localStorage Keys
- **Default dashboard**: `vue3-moveable-dashboard`
- **Custom dashboard**: `vue3-moveable-dashboard-{dashboardId}`

### What's Persisted
- ✅ All cards with properties (id, type, header, x, y, width, rotate, z)
- ✅ Edit mode status
- ✅ Card counter
- ❌ Selected card ID (not persisted, resets on page load)

## 🎨 Why This Solution is Better

### Before (localStorage only)
```typescript
// Manual management
const cards = ref([]);

function addCard(card) {
  cards.value.push(card);
  // Must manually save
  localStorage.setItem('cards', JSON.stringify(cards.value));
}

// Not reactive across components
// No type safety
// Repetitive code
```

### After (Pinia + API)
```typescript
// Automatic management
const dashboard = useDashboardAPI();

dashboard.addCard(card);
// ✅ Automatically saved
// ✅ Reactive everywhere
// ✅ Full type safety
// ✅ Clean API
```

## 🛠️ Advanced Usage

### Custom Dashboard Instances
```typescript
// Create multiple independent dashboards
const dashboard1 = useDashboardAPI('workspace-1');
const dashboard2 = useDashboardAPI('workspace-2');

// Each has:
// - Separate state
// - Separate localStorage key
// - Independent operations
```

### Reactive Watchers
```vue
<script setup>
import { watch } from 'vue';
import { useDashboardAPI } from 'vue3-moveable-dashboard';

const dashboard = useDashboardAPI();

// Watch card count changes
watch(() => dashboard.totalCards.value, (count) => {
  console.log(`Now have ${count} cards`);
});

// Watch selection changes
watch(() => dashboard.selectedCardId.value, (id) => {
  if (id) {
    console.log('Selected:', dashboard.getCard(id)?.header);
  }
});
</script>
```

### Batch Operations
```typescript
const dashboard = useDashboardAPI();

// Delete all charts
const chartIds = dashboard
  .getCardsByType('chart')
  .map(card => card.id);
dashboard.deleteCards(chartIds);

// Update all cards
dashboard.cards.value.forEach(card => {
  dashboard.updateCard(card.id, { width: 400 });
});
```

## 🐛 Debugging

### View State in DevTools
1. Install Vue DevTools
2. Open DevTools → Pinia tab
3. Inspect `dashboard` store

### Console Debugging
```javascript
// State
dashboard.debug();

// Individual properties
console.log(dashboard.cards.value);
console.log(dashboard.totalCards.value);
console.log(dashboard.selectedCard.value);

// Export for inspection
const state = dashboard.export();
console.log(JSON.parse(state));
```

### Check localStorage
```javascript
// View stored data
console.log(localStorage.getItem('vue3-moveable-dashboard'));

// Clear stored data
localStorage.removeItem('vue3-moveable-dashboard');
```

## 📚 Documentation

- **[DASHBOARD_API.md](DASHBOARD_API.md)** - Complete API reference
- **[src/stores/dashboard.ts](src/stores/dashboard.ts)** - Store implementation with inline docs
- **[src/composables/useDashboardAPI.ts](src/composables/useDashboardAPI.ts)** - API implementation with inline docs

## ✨ Benefits Summary

1. **Easy to Use**: Simple, intuitive API
2. **Works Anywhere**: Components, composables, console
3. **Automatic Persistence**: No manual save operations
4. **Type Safe**: Full TypeScript support
5. **Reactive**: Auto-updates across all components
6. **Debuggable**: Console access + DevTools
7. **Flexible**: Supports multiple dashboards
8. **Well Documented**: Complete API docs + examples

## 🚦 Getting Started

1. **Use in component:**
   ```typescript
   import { useDashboardAPI } from 'vue3-moveable-dashboard';
   const dashboard = useDashboardAPI();
   ```

2. **Add cards:**
   ```typescript
   dashboard.addCard({ type: 'chart', header: 'My Chart' });
   ```

3. **Access state:**
   ```typescript
   console.log(dashboard.cards.value);
   ```

4. **Debug in console:**
   ```javascript
   dashboard.debug();
   ```

## 📝 License

MIT

---

**Ready to use!** Check [DASHBOARD_API.md](DASHBOARD_API.md) for the complete API reference.
