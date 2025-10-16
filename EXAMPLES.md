# Usage Examples

## Example 1: Simple Dashboard

Create a basic dashboard with draggable cards:

```vue
<template>
  <MoveableDashboard :cards="dashboardCards">
    <template #default="{ card }">
      <DashboardCard :card="card">
        <div class="pa-4">{{ card.header }}</div>
      </DashboardCard>
    </template>
  </MoveableDashboard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MoveableDashboard, DashboardCard } from 'vue3-moveable-dashboard';
import type { IMoveableDashboardContainer } from 'vue3-moveable-dashboard';

const dashboardCards = ref<IMoveableDashboardContainer[]>([
  { id: '1', header: 'Card 1', x: 20, y: 20, width: 300, rotate: 0, z: 1 },
  { id: '2', header: 'Card 2', x: 340, y: 20, width: 300, rotate: 0, z: 1 }
]);
</script>
```

## Example 2: Different Card Types

Render different content based on card type:

```vue
<template>
  <MoveableDashboard :cards="dashboardCards">
    <template #default="{ card }">
      <DashboardCard :card="card">
        <ChartComponent v-if="card.type === 'chart'" :data="card.data" />
        <TableComponent v-else-if="card.type === 'table'" :items="card.items" />
        <TextComponent v-else :text="card.text" />
      </DashboardCard>
    </template>
  </MoveableDashboard>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const dashboardCards = ref([
  {
    id: '1',
    type: 'chart',
    header: 'Sales',
    x: 20,
    y: 20,
    width: 400,
    rotate: 0,
    data: [/* chart data */]
  },
  {
    id: '2',
    type: 'table',
    header: 'Users',
    x: 440,
    y: 20,
    width: 500,
    rotate: 0,
    items: [/* table items */]
  }
]);
</script>
```

## Example 3: Edit Mode Toggle

Add a button to toggle edit mode:

```vue
<template>
  <div>
    <v-btn @click="editMode = !editMode">
      {{ editMode ? 'Lock' : 'Unlock' }} Dashboard
    </v-btn>

    <MoveableDashboard
      :cards="dashboardCards"
      :enable-edit="editMode"
    >
      <template #default="{ card }">
        <DashboardCard :card="card">
          <div class="pa-4">{{ card.header }}</div>
        </DashboardCard>
      </template>
    </MoveableDashboard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const editMode = ref(true);
const dashboardCards = ref([/* your cards */]);
</script>
```

## Example 4: Card Actions

Add custom actions to card headers:

```vue
<template>
  <MoveableDashboard :cards="dashboardCards">
    <template #default="{ card }">
      <DashboardCard :card="card">
        <div class="pa-4">{{ card.header }}</div>

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

const dashboardCards = ref([/* your cards */]);

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

## Example 5: Event Handling

Listen to card events:

```vue
<template>
  <MoveableDashboard
    :cards="dashboardCards"
    @card-moved="onCardMoved"
    @card-resized="onCardResized"
    @card-rotated="onCardRotated"
    @card-selected="onCardSelected"
  >
    <template #default="{ card }">
      <DashboardCard :card="card">
        <div class="pa-4">{{ card.header }}</div>
      </DashboardCard>
    </template>
  </MoveableDashboard>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const dashboardCards = ref([/* your cards */]);

function onCardMoved(cardId: string, position: { x: number; y: number }) {
  console.log(`Card ${cardId} moved to:`, position);
}

function onCardResized(cardId: string, size: { width: number }) {
  console.log(`Card ${cardId} resized to:`, size);
}

function onCardRotated(cardId: string, rotation: number) {
  console.log(`Card ${cardId} rotated to:`, rotation);
}

function onCardSelected(cardId: string) {
  console.log(`Card ${cardId} selected`);
}
</script>
```

## Example 6: Persist State

Save and load dashboard state:

```vue
<template>
  <MoveableDashboard
    :cards="dashboardCards"
    @update:cards="saveLayout"
  >
    <template #default="{ card }">
      <DashboardCard :card="card">
        <div class="pa-4">{{ card.header }}</div>
      </DashboardCard>
    </template>
  </MoveableDashboard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { IMoveableDashboardContainer } from 'vue3-moveable-dashboard';

const dashboardCards = ref<IMoveableDashboardContainer[]>([]);

// Load layout from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem('dashboard-layout');
  if (saved) {
    dashboardCards.value = JSON.parse(saved);
  } else {
    // Default layout
    dashboardCards.value = [
      { id: '1', header: 'Card 1', x: 20, y: 20, width: 300, rotate: 0, z: 1 }
    ];
  }
});

// Save layout when cards are updated
function saveLayout(cards: IMoveableDashboardContainer[]) {
  localStorage.setItem('dashboard-layout', JSON.stringify(cards));
}
</script>
```

## Example 7: Add/Remove Cards Dynamically

```vue
<template>
  <div>
    <v-btn @click="addCard">Add Card</v-btn>

    <MoveableDashboard :cards="dashboardCards">
      <template #default="{ card }">
        <DashboardCard :card="card">
          <div class="pa-4">
            {{ card.header }}
            <v-btn size="small" @click="removeCard(card.id)">Remove</v-btn>
          </div>
        </DashboardCard>
      </template>
    </MoveableDashboard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const dashboardCards = ref([
  { id: '1', header: 'Card 1', x: 20, y: 20, width: 300, rotate: 0, z: 1 }
]);

let cardCounter = 2;

function addCard() {
  dashboardCards.value.push({
    id: `${cardCounter++}`,
    header: `Card ${cardCounter - 1}`,
    x: 20 + (cardCounter * 20),
    y: 20 + (cardCounter * 20),
    width: 300,
    rotate: 0,
    z: 1
  });
}

function removeCard(cardId: string) {
  const index = dashboardCards.value.findIndex(c => c.id === cardId);
  if (index !== -1) {
    dashboardCards.value.splice(index, 1);
  }
}
</script>
```

## Example 8: Multiple Dashboards in One App

You can use multiple dashboard instances:

```vue
<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <h2>Dashboard 1</h2>
        <MoveableDashboard :cards="dashboard1Cards">
          <template #default="{ card }">
            <DashboardCard :card="card">
              <div class="pa-4">Dashboard 1 - {{ card.header }}</div>
            </DashboardCard>
          </template>
        </MoveableDashboard>
      </v-col>

      <v-col cols="6">
        <h2>Dashboard 2</h2>
        <MoveableDashboard :cards="dashboard2Cards">
          <template #default="{ card }">
            <DashboardCard :card="card">
              <div class="pa-4">Dashboard 2 - {{ card.header }}</div>
            </DashboardCard>
          </template>
        </MoveableDashboard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const dashboard1Cards = ref([
  { id: '1', header: 'Card A', x: 20, y: 20, width: 250, rotate: 0, z: 1 }
]);

const dashboard2Cards = ref([
  { id: '2', header: 'Card B', x: 20, y: 20, width: 250, rotate: 0, z: 1 }
]);
</script>
```

## Tips

1. **Card IDs**: Always use unique IDs for each card
2. **Position**: x and y are in pixels from top-left
3. **Width**: Card width in pixels (height auto-adjusts to content)
4. **Rotate**: Rotation angle in degrees
5. **Z-index**: Use z property to control stacking order
6. **Slots**: Use scoped slots to access card data and selection state
7. **Events**: Use events to sync state with backend/localStorage
8. **Edit Mode**: Disable edit mode for read-only dashboards
