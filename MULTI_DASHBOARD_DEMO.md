# Multi-Dashboard Demo

A complete demonstration of managing multiple independent dashboards with separate localStorage persistence and a JSON data viewer.

## 🎯 Overview

This demo showcases:
- **2 Independent Dashboards** - Completely separate workspaces with their own cards and state
- **JSON Data Viewer** - Real-time view of all dashboard data with import/export capabilities
- **Automatic Persistence** - Each dashboard saves independently to localStorage
- **Easy Debugging** - Access both dashboards from browser console

## 🚀 Quick Start

```bash
npm run dev
```

Then open your browser to:
- **Dashboard 1**: http://localhost:5174/dashboard1
- **Dashboard 2**: http://localhost:5174/dashboard2
- **JSON Viewer**: http://localhost:5174/json

## 📱 Pages

### 1. Dashboard 1 - Main Workspace
**Route**: `/dashboard1`
**localStorage Key**: `vue3-moveable-dashboard-dashboard-1`
**Console Access**: `window.dashboard1`

Features:
- Main workspace for primary tasks
- Default cards: Sales Overview, Key Metrics, Main Tasks
- Fully independent from Dashboard 2
- Blue/Primary color theme

### 2. Dashboard 2 - Analytics Workspace
**Route**: `/dashboard2`
**localStorage Key**: `vue3-moveable-dashboard-dashboard-2`
**Console Access**: `window.dashboard2`

Features:
- Analytics workspace for data visualization
- Default cards: Revenue Analytics, User Growth, Performance Metrics, Top Products
- Fully independent from Dashboard 1
- Green/Secondary color theme

### 3. JSON Data Viewer
**Route**: `/json`

Features:
- **Real-time Data View** - See JSON data for both dashboards
- **Dashboard Stats** - Card counts and comparison
- **Copy to Clipboard** - Copy individual or all dashboard data
- **Download JSON** - Export dashboard data as JSON files
- **Import Data** - Import JSON to either dashboard
- **Raw localStorage** - View actual localStorage data
- **API Testing** - Quick buttons to test dashboard APIs

## 🎨 Navigation

### Navigation Drawer (Left Side)
- Dashboard 1 - Main Workspace
- Dashboard 2 - Analytics
- JSON Viewer
- Live stats showing card counts

### Top Navigation Bar
- Quick tabs for switching between pages
- Total card count badge
- Dark/Light theme toggle
- Current page title with icon

### Footer
- Current card counts for both dashboards
- Technology stack info

## 💾 Data Persistence

### Separate localStorage Keys

Each dashboard has its own localStorage key:

```javascript
// Dashboard 1
localStorage.getItem('vue3-moveable-dashboard-dashboard-1')

// Dashboard 2
localStorage.getItem('vue3-moveable-dashboard-dashboard-2')
```

### What's Stored

For each dashboard:
```json
{
  "cards": [...],      // All card data (id, type, header, x, y, width, rotate, z)
  "editMode": true,    // Edit mode status
  "cardCounter": 5     // Internal counter for new cards
}
```

### Independence

- Cards added to Dashboard 1 **do not** appear in Dashboard 2
- Each dashboard persists its state separately
- Clearing one dashboard does not affect the other
- localStorage keys are completely separate

## 🔧 Browser Console Access

Both dashboards are available in the browser console:

```javascript
// Dashboard 1 API
dashboard1.debug()
dashboard1.addCard({ type: 'chart', header: 'Test' })
dashboard1.cards.value
dashboard1.totalCards.value

// Dashboard 2 API
dashboard2.debug()
dashboard2.addCard({ type: 'stats', header: 'Analytics' })
dashboard2.cards.value
dashboard2.totalCards.value
```

## 📊 JSON Viewer Features

### 1. Dashboard Comparison
View side-by-side comparison of both dashboards with:
- Card counts
- JSON data
- localStorage keys
- Card IDs as chips

### 2. Copy Functions
- **Copy Dashboard 1** - Copy Dashboard 1 JSON to clipboard
- **Copy Dashboard 2** - Copy Dashboard 2 JSON to clipboard
- **Copy All** - Copy both dashboards in one JSON object

### 3. Download Functions
- **Download Dashboard 1** - Save as `dashboard1.json`
- **Download Dashboard 2** - Save as `dashboard2.json`

### 4. Import/Export
Import JSON data directly to either dashboard:

```json
{
  "cards": [
    {
      "id": "card-1",
      "type": "chart",
      "header": "My Chart",
      "x": 100,
      "y": 100,
      "width": 400,
      "rotate": 0,
      "z": 1
    }
  ],
  "editMode": true,
  "cardCounter": 2
}
```

### 5. Raw localStorage View
Expandable panel showing actual localStorage data for both dashboards.

### 6. API Testing
Quick test buttons:
- Add test card to Dashboard 1
- Add test card to Dashboard 2

## 🎯 Use Cases

### Use Case 1: Separate Workspaces
```
Dashboard 1 = Personal tasks and metrics
Dashboard 2 = Team analytics and reports
```

### Use Case 2: Different Clients
```
Dashboard 1 = Client A's dashboard
Dashboard 2 = Client B's dashboard
```

### Use Case 3: Different Time Periods
```
Dashboard 1 = Current month data
Dashboard 2 = Historical data
```

### Use Case 4: Testing & Production
```
Dashboard 1 = Testing workspace
Dashboard 2 = Production mirror
```

## 🛠️ Common Operations

### Add Card to Dashboard 1
```javascript
dashboard1.addCard({
  type: 'chart',
  header: 'Sales Chart',
  x: 100,
  y: 100,
  width: 400
});
```

### Move Card Between Dashboards
```javascript
// Get card from Dashboard 1
const card = dashboard1.getCard('card-1');

// Add copy to Dashboard 2
if (card) {
  dashboard2.addCard(card);
}

// Optional: Delete from Dashboard 1
dashboard1.deleteCard('card-1');
```

### Export Both Dashboards
```javascript
const backup = {
  dashboard1: JSON.parse(dashboard1.export()),
  dashboard2: JSON.parse(dashboard2.export())
};

// Save to file or send to server
console.log(JSON.stringify(backup, null, 2));
```

### Clone Dashboard 1 to Dashboard 2
```javascript
// Export Dashboard 1
const data = dashboard1.export();

// Import to Dashboard 2
dashboard2.import(data);
```

### Clear Both Dashboards
```javascript
dashboard1.clearAllCards();
dashboard2.clearAllCards();
```

## 📈 Monitoring

### View Stats in Console
```javascript
// Dashboard 1
console.log('Dashboard 1 Cards:', dashboard1.totalCards.value);
console.log('Dashboard 1 Selected:', dashboard1.selectedCardId.value);

// Dashboard 2
console.log('Dashboard 2 Cards:', dashboard2.totalCards.value);
console.log('Dashboard 2 Selected:', dashboard2.selectedCardId.value);
```

### Watch for Changes
```javascript
import { watch } from 'vue';

// Watch Dashboard 1 card count
watch(() => dashboard1.totalCards.value, (count) => {
  console.log('Dashboard 1 now has', count, 'cards');
});

// Watch Dashboard 2 card count
watch(() => dashboard2.totalCards.value, (count) => {
  console.log('Dashboard 2 now has', count, 'cards');
});
```

## 🔍 Debugging

### Check localStorage
```javascript
// View stored data
const dash1Data = localStorage.getItem('vue3-moveable-dashboard-dashboard-1');
const dash2Data = localStorage.getItem('vue3-moveable-dashboard-dashboard-2');

console.log('Dashboard 1:', JSON.parse(dash1Data));
console.log('Dashboard 2:', JSON.parse(dash2Data));
```

### Clear localStorage
```javascript
// Clear individual dashboard
localStorage.removeItem('vue3-moveable-dashboard-dashboard-1');

// Clear both dashboards
localStorage.removeItem('vue3-moveable-dashboard-dashboard-1');
localStorage.removeItem('vue3-moveable-dashboard-dashboard-2');

// Refresh page to see empty dashboards
location.reload();
```

### Debug Both Dashboards
```javascript
dashboard1.debug();
dashboard2.debug();
```

## 🎨 Customization

### Add More Dashboards
Create a new page:

```vue
<!-- src/pages/Dashboard3.vue -->
<script setup>
import { useDashboardAPI } from '../composables/useDashboardAPI';

// Use unique ID
const dashboard = useDashboardAPI('dashboard-3');
</script>
```

Add to router:
```typescript
// src/router/index.ts
{
  path: '/dashboard3',
  name: 'Dashboard3',
  component: Dashboard3
}
```

### Change Default Cards
Edit the `DEFAULT_CARDS` array in each dashboard page:

```typescript
const DEFAULT_CARDS: IMoveableDashboardContainer[] = [
  {
    id: 'custom-1',
    type: 'chart',
    header: 'My Custom Card',
    x: 20,
    y: 20,
    width: 400,
    rotate: 0,
    z: 1
  }
];
```

### Custom Card Types
Add new card types in the card rendering template:

```vue
<template v-else-if="card.type === 'custom'">
  <CustomCard :card="card" />
</template>
```

## 📁 File Structure

```
src/
├── pages/
│   ├── Dashboard1.vue          # Main workspace page
│   ├── Dashboard2.vue          # Analytics workspace page
│   └── JSONViewer.vue          # JSON data viewer page
├── router/
│   └── index.ts                # Vue Router configuration
├── components/
│   ├── AppLayout.vue           # Main layout with navigation
│   ├── MoveableDashboard.vue   # Dashboard component
│   └── DashboardCard.vue       # Card component
├── composables/
│   └── useDashboardAPI.ts      # Dashboard API composable
├── stores/
│   └── dashboard.ts            # Pinia store with persistence
└── main.ts                     # App setup with router
```

## 🚦 Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Redirect | Redirects to `/dashboard1` |
| `/dashboard1` | Dashboard1 | Main workspace |
| `/dashboard2` | Dashboard2 | Analytics workspace |
| `/json` | JSONViewer | Data viewer and tools |

## 💡 Tips

1. **Use JSON Viewer** - Always check JSON viewer to see both dashboards' data
2. **Browser Console** - Use `dashboard1` and `dashboard2` in console for quick testing
3. **Export Before Clearing** - Always export data before clearing dashboards
4. **Unique Card IDs** - Use prefixes like `dash1-` and `dash2-` for clarity
5. **localStorage Cleanup** - Clear localStorage if you want to reset everything

## 🔐 localStorage Keys Reference

```javascript
// Default dashboard (if no ID specified)
'vue3-moveable-dashboard'

// Dashboard 1
'vue3-moveable-dashboard-dashboard-1'

// Dashboard 2
'vue3-moveable-dashboard-dashboard-2'

// Custom dashboard (if you add more)
'vue3-moveable-dashboard-{your-custom-id}'
```

## 🎯 Next Steps

1. **Try the Demo** - Navigate between dashboards and add cards
2. **Check JSON Viewer** - See how data is structured
3. **Test in Console** - Use `dashboard1` and `dashboard2` APIs
4. **Export Data** - Download JSON backups
5. **Import Data** - Restore or share dashboard configurations

---

**Built with:**
- Vue 3
- Pinia (state management)
- Vue Router (navigation)
- Vuetify (UI components)
- pinia-plugin-persistedstate (auto-persistence)
- vue3-moveable (moveable functionality)
