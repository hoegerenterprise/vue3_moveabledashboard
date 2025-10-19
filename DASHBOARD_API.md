# Dashboard API Documentation

Complete API reference for managing Vue3 Moveable Dashboard state with Pinia.

## Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
- [Multiple Dashboards](#multiple-dashboards)
- [Browser Console Debugging](#browser-console-debugging)
- [Import/Export](#importexport)
- [Examples](#examples)

---

## Quick Start

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

// Get all cards (reactive)
console.log(dashboard.cards.value);

// Update card position
dashboard.updateCardPosition('card-1', { x: 200, y: 150 });

// Delete a card
dashboard.deleteCard('card-1');
```

---

## Installation

The Dashboard API uses Pinia with automatic localStorage persistence. It's already set up in your project.

**Dependencies:**
- `pinia` - State management
- `pinia-plugin-persistedstate` - Automatic localStorage persistence

---

## Basic Usage

### In Vue Components

```vue
<script setup lang="ts">
import { useDashboardAPI } from 'vue3-moveable-dashboard';

const dashboard = useDashboardAPI();

// Use reactive state
const totalCards = dashboard.totalCards;
const allCards = dashboard.cards;

// Call actions
function addNewCard() {
  dashboard.addCard({
    type: 'text',
    header: 'My Card',
    x: 100,
    y: 100,
    width: 300
  });
}
</script>

<template>
  <div>
    <p>Total Cards: {{ totalCards }}</p>
    <button @click="addNewCard">Add Card</button>
  </div>
</template>
```

---

## API Reference

### State (Reactive - use `.value` to access)

#### `cards`
All dashboard cards (reactive array)
```typescript
const allCards = dashboard.cards.value;
// Returns: IMoveableDashboardContainer[]
```

#### `sortedCards`
Cards sorted by z-index (reactive)
```typescript
const sorted = dashboard.sortedCards.value;
// Returns: IMoveableDashboardContainer[]
```

#### `selectedCardId`
Currently selected card ID (reactive)
```typescript
const id = dashboard.selectedCardId.value;
// Returns: string
```

#### `selectedCard`
Currently selected card object (reactive)
```typescript
const card = dashboard.selectedCard.value;
// Returns: IMoveableDashboardContainer | undefined
```

#### `editMode`
Edit mode status (reactive)
```typescript
const isEditMode = dashboard.editMode.value;
// Returns: boolean
```

#### `totalCards`
Total number of cards (reactive)
```typescript
const count = dashboard.totalCards.value;
// Returns: number
```

---

### Card Operations

#### `addCard(card)`
Add a new card to the dashboard

**Parameters:**
- `card` (Partial<IMoveableDashboardContainer>) - Card properties (id is optional)

**Returns:** `IMoveableDashboardContainer` - The created card

**Example:**
```typescript
const newCard = dashboard.addCard({
  type: 'chart',
  header: 'Sales Chart',
  x: 100,
  y: 100,
  width: 400,
  rotate: 0,
  z: 1
});
```

#### `getCard(cardId)`
Get a specific card by ID

**Parameters:**
- `cardId` (string) - Card ID

**Returns:** `IMoveableDashboardContainer | undefined`

**Example:**
```typescript
const card = dashboard.getCard('card-1');
if (card) {
  console.log(card.header);
}
```

#### `getCardsByType(type)`
Get cards filtered by type

**Parameters:**
- `type` (string) - Card type (e.g., 'chart', 'stats', 'list')

**Returns:** `IMoveableDashboardContainer[]`

**Example:**
```typescript
const chartCards = dashboard.getCardsByType('chart');
```

#### `updateCardPosition(cardId, position)`
Update card position

**Parameters:**
- `cardId` (string) - Card ID
- `position` ({ x: number, y: number }) - New position

**Returns:** `boolean` - true if successful

**Example:**
```typescript
dashboard.updateCardPosition('card-1', { x: 200, y: 150 });
```

#### `updateCardSize(cardId, size)`
Update card size

**Parameters:**
- `cardId` (string) - Card ID
- `size` ({ width: number }) - New size

**Returns:** `boolean` - true if successful

**Example:**
```typescript
dashboard.updateCardSize('card-1', { width: 500 });
```

#### `updateCardRotation(cardId, rotation)`
Update card rotation

**Parameters:**
- `cardId` (string) - Card ID
- `rotation` (number) - Rotation angle in degrees

**Returns:** `boolean` - true if successful

**Example:**
```typescript
dashboard.updateCardRotation('card-1', 45);
```

#### `updateCard(cardId, updates)`
Update any card properties

**Parameters:**
- `cardId` (string) - Card ID
- `updates` (Partial<IMoveableDashboardContainer>) - Properties to update

**Returns:** `boolean` - true if successful

**Example:**
```typescript
dashboard.updateCard('card-1', {
  header: 'New Title',
  x: 300,
  width: 500
});
```

#### `deleteCard(cardId)`
Delete a card

**Parameters:**
- `cardId` (string) - Card ID to delete

**Returns:** `boolean` - true if deleted

**Example:**
```typescript
dashboard.deleteCard('card-1');
```

#### `deleteCards(cardIds)`
Delete multiple cards at once

**Parameters:**
- `cardIds` (string[]) - Array of card IDs

**Returns:** `number` - Number of cards deleted

**Example:**
```typescript
const deleted = dashboard.deleteCards(['card-1', 'card-2', 'card-3']);
console.log(`Deleted ${deleted} cards`);
```

#### `duplicateCard(cardId, offset?)`
Duplicate a card with optional offset

**Parameters:**
- `cardId` (string) - Card ID to duplicate
- `offset` ({ x: number, y: number }) - Position offset (default: { x: 20, y: 20 })

**Returns:** `IMoveableDashboardContainer | null`

**Example:**
```typescript
const duplicate = dashboard.duplicateCard('card-1', { x: 50, y: 50 });
```

#### `hasCard(cardId)`
Check if a card exists

**Parameters:**
- `cardId` (string) - Card ID to check

**Returns:** `boolean`

**Example:**
```typescript
if (dashboard.hasCard('card-1')) {
  console.log('Card exists');
}
```

#### `clearAllCards()`
Clear all cards from the dashboard

**Example:**
```typescript
dashboard.clearAllCards();
```

---

### Selection Operations

#### `selectCard(cardId)`
Select a card

**Parameters:**
- `cardId` (string) - Card ID to select

**Returns:** `boolean` - true if selected

**Example:**
```typescript
dashboard.selectCard('card-1');
```

#### `deselectCard()`
Deselect current card

**Example:**
```typescript
dashboard.deselectCard();
```

---

### Edit Mode Operations

#### `toggleEditMode()`
Toggle edit mode on/off

**Example:**
```typescript
dashboard.toggleEditMode();
```

#### `setEditMode(enabled)`
Set edit mode explicitly

**Parameters:**
- `enabled` (boolean) - true to enable, false to disable

**Example:**
```typescript
dashboard.setEditMode(true);
```

---

### Initialization Operations

#### `initialize(cards)`
Initialize dashboard with a set of cards

**Parameters:**
- `cards` (IMoveableDashboardContainer[]) - Array of cards

**Example:**
```typescript
dashboard.initialize([
  { id: 'card-1', type: 'chart', header: 'Chart', x: 0, y: 0, width: 300, rotate: 0, z: 1 },
  { id: 'card-2', type: 'stats', header: 'Stats', x: 320, y: 0, width: 300, rotate: 0, z: 1 }
]);
```

#### `resetToDefaults(defaultCards)`
Reset dashboard to default cards

**Parameters:**
- `defaultCards` (IMoveableDashboardContainer[]) - Default cards

**Example:**
```typescript
const DEFAULT_CARDS = [
  { id: 'card-1', type: 'chart', header: 'Chart', x: 0, y: 0, width: 300, rotate: 0, z: 1 }
];
dashboard.resetToDefaults(DEFAULT_CARDS);
```

---

### Import/Export Operations

#### `export()`
Export entire dashboard state as JSON string

**Returns:** `string` - JSON string

**Example:**
```typescript
const json = dashboard.export();
console.log(json);
// Save to file or send to server
localStorage.setItem('backup', json);
```

#### `import(jsonString)`
Import dashboard state from JSON string

**Parameters:**
- `jsonString` (string) - JSON string to import

**Returns:** `boolean` - true if successful

**Example:**
```typescript
const json = localStorage.getItem('backup');
if (json) {
  const success = dashboard.import(json);
  if (success) {
    console.log('Dashboard imported successfully');
  }
}
```

---

### Debugging Operations

#### `debug()`
Log current dashboard state to console

**Example:**
```typescript
dashboard.debug();
// Outputs:
// Dashboard State
//   Cards: [...]
//   Total Cards: 4
//   Selected Card ID: card-1
//   Selected Card: {...}
//   Edit Mode: true
```

#### `getStore()`
Get raw Pinia store instance (for advanced usage)

**Returns:** Store instance

**Example:**
```typescript
const store = dashboard.getStore();
console.log(store.$state);
```

---

## Multiple Dashboards

You can create multiple independent dashboard instances with separate localStorage keys:

```typescript
// Dashboard 1
const mainDashboard = useDashboardAPI('main-dashboard');
mainDashboard.addCard({ header: 'Main Card 1' });

// Dashboard 2
const secondaryDashboard = useDashboardAPI('secondary-dashboard');
secondaryDashboard.addCard({ header: 'Secondary Card 1' });

// Each dashboard has its own:
// - Separate cards
// - Separate localStorage key
// - Independent state
```

**localStorage keys:**
- Default dashboard: `vue3-moveable-dashboard`
- Custom dashboard: `vue3-moveable-dashboard-{dashboardId}`

---

## Browser Console Debugging

The dashboard API is automatically exposed to the browser console for easy debugging:

```javascript
// Access in browser console
dashboard.debug();

// View all cards
console.log(dashboard.cards.value);

// Add a card from console
dashboard.addCard({
  type: 'test',
  header: 'Test Card',
  x: 100,
  y: 100,
  width: 300
});

// Get card info
dashboard.getCard('card-1');

// Export state
console.log(dashboard.export());

// Clear all cards
dashboard.clearAllCards();
```

---

## Examples

### Example 1: Programmatic Card Management

```typescript
import { useDashboardAPI } from 'vue3-moveable-dashboard';

const dashboard = useDashboardAPI();

// Initialize with default cards
dashboard.initialize([
  { id: 'card-1', type: 'chart', header: 'Sales', x: 0, y: 0, width: 400, rotate: 0, z: 1 },
  { id: 'card-2', type: 'stats', header: 'Stats', x: 420, y: 0, width: 300, rotate: 0, z: 1 }
]);

// Add dynamic cards
const newCard = dashboard.addCard({
  type: 'list',
  header: 'Tasks',
  x: 0,
  y: 300,
  width: 350
});

// Update card
dashboard.updateCard(newCard.id, {
  header: 'Updated Tasks',
  width: 400
});

// Duplicate card
const duplicate = dashboard.duplicateCard(newCard.id);
```

### Example 2: Card Type Filter

```typescript
const dashboard = useDashboardAPI();

// Get all chart cards
const charts = dashboard.getCardsByType('chart');
console.log(`Found ${charts.length} chart cards`);

// Update all chart cards
charts.forEach(card => {
  dashboard.updateCard(card.id, {
    width: 500
  });
});
```

### Example 3: Backup and Restore

```typescript
const dashboard = useDashboardAPI();

// Backup current state
function backupDashboard() {
  const backup = dashboard.export();
  localStorage.setItem('dashboard-backup', backup);
  console.log('Dashboard backed up');
}

// Restore from backup
function restoreDashboard() {
  const backup = localStorage.getItem('dashboard-backup');
  if (backup) {
    const success = dashboard.import(backup);
    if (success) {
      console.log('Dashboard restored');
    } else {
      console.error('Failed to restore dashboard');
    }
  }
}
```

### Example 4: Batch Operations

```typescript
const dashboard = useDashboardAPI();

// Add multiple cards at once
const cardTypes = ['chart', 'stats', 'list', 'text'];
cardTypes.forEach((type, index) => {
  dashboard.addCard({
    type,
    header: `${type} Card`,
    x: index * 320,
    y: 0,
    width: 300
  });
});

// Delete all cards of a specific type
const chartsToDelete = dashboard.getCardsByType('chart').map(c => c.id);
dashboard.deleteCards(chartsToDelete);
```

### Example 5: Reactive Watchers

```vue
<script setup lang="ts">
import { watch } from 'vue';
import { useDashboardAPI } from 'vue3-moveable-dashboard';

const dashboard = useDashboardAPI();

// Watch for card changes
watch(() => dashboard.totalCards.value, (newCount, oldCount) => {
  console.log(`Cards changed from ${oldCount} to ${newCount}`);
});

// Watch for selection changes
watch(() => dashboard.selectedCardId.value, (cardId) => {
  if (cardId) {
    const card = dashboard.getCard(cardId);
    console.log('Selected:', card?.header);
  }
});
</script>
```

### Example 6: Multi-Dashboard Setup

```typescript
// App with multiple dashboards
const mainDashboard = useDashboardAPI('main');
const analyticsDashboard = useDashboardAPI('analytics');

// Each operates independently
mainDashboard.addCard({ header: 'Main Card 1' });
analyticsDashboard.addCard({ header: 'Analytics Card 1' });

console.log('Main:', mainDashboard.totalCards.value);
console.log('Analytics:', analyticsDashboard.totalCards.value);
```

---

## TypeScript Support

Full TypeScript support with type definitions:

```typescript
import type { IMoveableDashboardContainer } from 'vue3-moveable-dashboard';

interface IMoveableDashboardContainer {
  id: string;
  type?: string;
  header?: string;
  x: number;
  y: number;
  width: number;
  rotate: number;
  z: number;
  [key: string]: any; // Additional custom properties
}
```

---

## Persistence

**Automatic Persistence:**
- All state changes are automatically saved to localStorage
- Data persists across page refreshes and browser restarts
- No manual save operations required

**Storage Keys:**
- Default: `vue3-moveable-dashboard`
- Custom: `vue3-moveable-dashboard-{dashboardId}`

**What's Persisted:**
- All cards and their properties
- Edit mode status
- Card counter

**What's NOT Persisted:**
- Selected card ID (resets on page load)

---

## Best Practices

1. **Use the API for all state changes** - Don't manually modify cards array
2. **Leverage reactivity** - Use computed properties and watchers
3. **Initialize on mount** - Check if cards exist, if not, initialize with defaults
4. **Use TypeScript** - Get full type safety and autocomplete
5. **Debug with console** - Use `dashboard.debug()` for troubleshooting
6. **Export/Import for backups** - Implement backup/restore functionality
7. **Use multiple dashboards** - Keep different dashboard states separate with custom IDs

---

## Troubleshooting

**Cards not persisting?**
- Check that `pinia-plugin-persistedstate` is installed and configured in `main.ts`
- Verify localStorage is enabled in browser
- Check browser console for errors

**State not updating?**
- Make sure you're using `.value` to access reactive properties
- Use dashboard API methods instead of direct array manipulation

**Multiple dashboards interfering?**
- Ensure each dashboard has a unique ID
- Check localStorage keys to verify separation

---

## License

MIT
