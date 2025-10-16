# Vue3 Moveable Dashboard

A flexible and customizable Vue 3 component library for creating interactive dashboards with moveable, resizable, and rotatable cards. Built with Vue 3, Vuetify, and vue3-moveable.

## Features

- **Drag and Drop**: Move cards anywhere on the dashboard
- **Resizable**: Dynamically resize cards to fit your content
- **Rotatable**: Rotate cards for creative layouts
- **Customizable**: Use slots to inject any content into cards
- **TypeScript Support**: Full TypeScript definitions included
- **Vuetify Integration**: Beautiful Material Design UI components
- **Event System**: Rich event system for tracking card interactions
- **State Management**: Built-in support for persisting card positions and sizes

## Installation

### Prerequisites

Make sure you have Vue 3 and Vuetify 3 installed in your project.

```bash
npm install vue@^3.0.0
npm install vuetify@^3.0.0
```

### Install the Package

```bash
npm install vue3-moveable-dashboard
```

### Install Peer Dependencies

```bash
npm install vue3-moveable
```

## Setup

### 1. Import and Register Components

You can register components globally or use them locally.

#### Global Registration (in main.ts/main.js)

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import Vue3MoveableDashboard from 'vue3-moveable-dashboard';

// Import Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

// Use Vuetify
app.use(vuetify);

// Register dashboard components globally
app.use(Vue3MoveableDashboard);

app.mount('#app');
```

#### Local Registration

```vue
<script setup lang="ts">
import { MoveableDashboard, DashboardCard } from 'vue3-moveable-dashboard';
</script>
```

### 2. Import Types (Optional, for TypeScript)

```typescript
import type {
  IMoveableDashboardContainer,
  IDashboardCard
} from 'vue3-moveable-dashboard';
```

## Basic Usage

### Simple Example

```vue
<template>
  <v-app>
    <v-main>
      <MoveableDashboard :cards="dashboardCards">
        <template #default="{ card }">
          <DashboardCard :card="card">
            <div class="pa-4">
              <h3>{{ card.header }}</h3>
              <p>Your content here</p>
            </div>
          </DashboardCard>
        </template>
      </MoveableDashboard>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MoveableDashboard, DashboardCard } from 'vue3-moveable-dashboard';
import type { IMoveableDashboardContainer } from 'vue3-moveable-dashboard';

const dashboardCards = ref<IMoveableDashboardContainer[]>([
  {
    id: 'card-1',
    header: 'My First Card',
    x: 20,
    y: 20,
    width: 300,
    rotate: 0,
    z: 1
  },
  {
    id: 'card-2',
    header: 'My Second Card',
    x: 350,
    y: 20,
    width: 400,
    rotate: 0,
    z: 1
  }
]);
</script>
```

## Advanced Usage

### Custom Card Content

You can render different content based on card type:

```vue
<template>
  <MoveableDashboard
    :cards="dashboardCards"
    @card-moved="handleCardMoved"
    @card-resized="handleCardResized"
  >
    <template #default="{ card, isSelected }">
      <DashboardCard :card="card">
        <!-- Render different components based on card type -->
        <ChartComponent v-if="card.type === 'chart'" :data="card.data" />
        <TableComponent v-else-if="card.type === 'table'" :data="card.data" />
        <TextComponent v-else :text="card.text" />

        <!-- Custom actions in card header -->
        <template #actions>
          <v-btn icon size="small" @click="editCard(card.id)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon size="small" @click="deleteCard(card.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </DashboardCard>
    </template>
  </MoveableDashboard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MoveableDashboard, DashboardCard } from 'vue3-moveable-dashboard';
import ChartComponent from './components/ChartComponent.vue';
import TableComponent from './components/TableComponent.vue';
import TextComponent from './components/TextComponent.vue';

const dashboardCards = ref([
  {
    id: 'card-1',
    type: 'chart',
    header: 'Sales Chart',
    x: 20,
    y: 20,
    width: 400,
    rotate: 0,
    data: { /* chart data */ }
  },
  {
    id: 'card-2',
    type: 'table',
    header: 'Data Table',
    x: 440,
    y: 20,
    width: 500,
    rotate: 0,
    data: { /* table data */ }
  }
]);

function handleCardMoved(cardId: string, position: { x: number; y: number }) {
  console.log(`Card ${cardId} moved to:`, position);
  // Save to backend or localStorage
}

function handleCardResized(cardId: string, size: { width: number }) {
  console.log(`Card ${cardId} resized to:`, size);
}

function editCard(cardId: string) {
  console.log('Edit card:', cardId);
}

function deleteCard(cardId: string) {
  const index = dashboardCards.value.findIndex(c => c.id === cardId);
  if (index !== -1) {
    dashboardCards.value.splice(index, 1);
  }
}
</script>
```

### Toggle Edit Mode

```vue
<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>Dashboard</v-app-bar-title>
      <v-btn icon @click="editMode = !editMode">
        <v-icon>{{ editMode ? 'mdi-lock-open' : 'mdi-lock' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <MoveableDashboard
        :cards="dashboardCards"
        :enable-edit="editMode"
        :draggable="true"
        :resizable="true"
        :rotatable="true"
      >
        <!-- Card content -->
      </MoveableDashboard>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const editMode = ref(true);
const dashboardCards = ref([/* your cards */]);
</script>
```

### Persist Card Positions

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const dashboardCards = ref([]);

// Load saved positions on mount
onMounted(() => {
  const saved = localStorage.getItem('dashboard-cards');
  if (saved) {
    dashboardCards.value = JSON.parse(saved);
  }
});

// Save positions when cards are updated
function handleCardsUpdated(cards) {
  localStorage.setItem('dashboard-cards', JSON.stringify(cards));
}
</script>

<template>
  <MoveableDashboard
    :cards="dashboardCards"
    @update:cards="handleCardsUpdated"
  >
    <!-- Card content -->
  </MoveableDashboard>
</template>
```

## API Reference

### MoveableDashboard Component

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cards` | `IMoveableDashboardContainer[]` | **Required** | Array of dashboard cards |
| `enableEdit` | `Boolean` | `true` | Enable/disable editing mode |
| `draggable` | `Boolean` | `true` | Allow dragging cards |
| `resizable` | `Boolean` | `true` | Allow resizing cards |
| `rotatable` | `Boolean` | `true` | Allow rotating cards |
| `zoom` | `Number` | `1` | Zoom level for the dashboard |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `card-selected` | `cardId: string` | Emitted when a card is selected |
| `card-deselected` | - | Emitted when selection is cleared |
| `card-moved` | `cardId: string, position: { x: number, y: number }` | Emitted when a card is moved |
| `card-resized` | `cardId: string, size: { width: number }` | Emitted when a card is resized |
| `card-rotated` | `cardId: string, rotation: number` | Emitted when a card is rotated |
| `update:cards` | `cards: IMoveableDashboardContainer[]` | Emitted when cards array is updated |

#### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `default` | `{ card, isSelected }` | Scoped slot for customizing card rendering |

#### Exposed Methods

```typescript
interface MoveableDashboardMethods {
  selectCard(cardId: string): void;
  selectNone(): void;
  getSelectedCardId(): string;
}
```

### DashboardCard Component

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `card` | `IDashboardCard` | **Required** | Card configuration object |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Main content area |
| `actions` | Header actions (replaces default menu button) |

## TypeScript Interfaces

```typescript
interface IDashboardCard {
  id: string;
  type?: string;
  header?: string;
  width?: number;
  x?: number;
  y?: number;
  z?: number;
  rotate?: number;
}

interface IMoveableDashboardContainer extends IDashboardCard {
  x: number;
  y: number;
  rotate: number;
}

interface IMoveableDashboard {
  id: string;
  name: string;
  cards: IMoveableDashboardContainer[];
}
```

## Running the Demo

The package includes a demo page that showcases all features:

```bash
# Clone the repository
git clone [your-repo-url]

# Navigate to the package directory
cd vue3_moveable_dashboard

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open your browser to `http://localhost:5173` to see the demo.

## Building the Package

To build the package for distribution:

```bash
npm run build
```

This will create a `dist` folder with the compiled package.

## Use Cases

- **Admin Dashboards**: Create customizable admin panels
- **Analytics Dashboards**: Display charts and metrics
- **Project Management**: Task boards and kanban views
- **Monitoring Tools**: Real-time system monitoring
- **Content Management**: Flexible content layouts
- **Personal Dashboards**: Customizable user workspaces

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Vue 3 compatible browsers

## Dependencies

- Vue 3.x
- Vuetify 3.x
- vue3-moveable 0.28.x

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions, please open an issue on the GitHub repository.

## Credits

Built with:
- [Vue 3](https://vuejs.org/)
- [Vuetify](https://vuetifyjs.com/)
- [vue3-moveable](https://github.com/probil/vue3-moveable)
- [Moveable](https://github.com/daybrush/moveable)
