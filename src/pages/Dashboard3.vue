<template>
  <div class="dashboard-page floating-style">
    <!-- Minimal Toolbar for Floating Dashboard -->
    <div class="toolbar">
      <v-toolbar color="accent" density="compact" elevation="2">
        <v-toolbar-title>
          <v-icon class="mr-2">mdi-window-restore</v-icon>
          Dashboard 3 - Floating Windows
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-chip size="small" variant="flat" color="white" class="mr-2">
          <v-icon start size="small">mdi-layers</v-icon>
          {{ dashboard.totalCards.value }} Windows
        </v-chip>

        <v-btn
          icon
          size="small"
          @click="toggleEditMode"
          :color="dashboard.editMode.value ? 'warning' : 'white'"
          variant="flat"
        >
          <v-icon>{{ dashboard.editMode.value ? 'mdi-lock-open' : 'mdi-lock' }}</v-icon>
          <v-tooltip activator="parent" location="bottom">
            {{ dashboard.editMode.value ? 'Unlock (Editing)' : 'Lock (View Only)' }}
          </v-tooltip>
        </v-btn>

        <v-btn icon size="small" @click="addNewCard" variant="flat" color="white">
          <v-icon>mdi-plus-box</v-icon>
          <v-tooltip activator="parent" location="bottom">Add Window</v-tooltip>
        </v-btn>

        <v-btn icon size="small" @click="arrangeWindows" variant="flat" color="white">
          <v-icon>mdi-window-restore</v-icon>
          <v-tooltip activator="parent" location="bottom">Auto Arrange</v-tooltip>
        </v-btn>

        <v-btn icon size="small" @click="resetCards" variant="flat" color="white">
          <v-icon>mdi-refresh</v-icon>
          <v-tooltip activator="parent" location="bottom">Reset Layout</v-tooltip>
        </v-btn>
      </v-toolbar>
    </div>

    <!-- Floating Dashboard Container -->
    <div class="dashboard-wrapper floating-workspace">
      <FloatingDashboard
        ref="dashboardRef"
        :cards="dashboard.cards.value"
        :enable-edit="dashboard.editMode.value"
        :draggable="true"
        :resizable="true"
        :zoom="1"
        @card-selected="onCardSelected"
        @card-deselected="onCardDeselected"
        @card-moved="onCardMoved"
        @card-resized="onCardResized"
        @update:cards="onCardsUpdated"
      >
        <!-- Custom card rendering using scoped slot -->
        <template #default="{ card, isSelected }">
          <DashboardCard :card="card">
            <!-- Custom card content based on card type -->
            <template v-if="card.type === 'chart'">
              <ChartCard :card="card" />
            </template>
            <template v-else-if="card.type === 'stats'">
              <StatsCard :card="card" />
            </template>
            <template v-else-if="card.type === 'list'">
              <ListCard :card="card" />
            </template>
            <template v-else-if="card.type === 'text'">
              <TextCard :card="card" />
            </template>
            <template v-else-if="card.type === 'form'">
              <FormCard :card="card" />
            </template>
            <template v-else>
              <DefaultCard :card="card" :is-selected="isSelected" />
            </template>

            <!-- Actions slot for card header -->
            <template #actions>
              <v-btn icon size="x-small" variant="text" @click="duplicateCard(card.id)">
                <v-icon size="small">mdi-content-copy</v-icon>
              </v-btn>
              <v-btn icon size="x-small" variant="text" @click="deleteCard(card.id)">
                <v-icon size="small">mdi-close</v-icon>
              </v-btn>
            </template>
          </DashboardCard>
        </template>
      </FloatingDashboard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FloatingDashboard from '../components/FloatingDashboard.vue';
import { DashboardCard } from '../index';
import type { IMoveableDashboardContainer } from '../types';
import { useDashboardAPI } from '../composables/useDashboardAPI';
import ChartCard from '../demo/cards/ChartCard.vue';
import StatsCard from '../demo/cards/StatsCard.vue';
import ListCard from '../demo/cards/ListCard.vue';
import TextCard from '../demo/cards/TextCard.vue';
import FormCard from '../demo/cards/FormCard.vue';
import DefaultCard from '../demo/cards/DefaultCard.vue';

const dashboardRef = ref<InstanceType<typeof FloatingDashboard> | null>(null);

// Use Dashboard API with unique ID
const dashboard = useDashboardAPI('dashboard-3');

// Default cards for Dashboard 3 - Loose grid layout (3 columns)
const DEFAULT_CARDS: IMoveableDashboardContainer[] = [
  {
    id: 'dash3-card-1',
    type: 'stats',
    header: 'System Monitor',
    x: 35,
    y: 25,
    width: 350,
    rotate: 0,
    z: 1
  },
  {
    id: 'dash3-card-2',
    type: 'chart',
    header: 'Network Traffic',
    x: 490,
    y: 35,
    width: 400,
    rotate: 0,
    z: 2
  },
  {
    id: 'dash3-card-3',
    type: 'list',
    header: 'Active Processes',
    x: 945,
    y: 20,
    width: 320,
    rotate: 0,
    z: 3
  },
  {
    id: 'dash3-card-4',
    type: 'form',
    header: 'Quick Actions',
    x: 25,
    y: 420,
    width: 360,
    rotate: 0,
    z: 4
  },
  {
    id: 'dash3-card-5',
    type: 'text',
    header: 'Notes',
    x: 475,
    y: 435,
    width: 380,
    rotate: 0,
    z: 5
  }
];

function toggleEditMode() {
  dashboard.toggleEditMode();
  if (!dashboard.editMode.value) {
    dashboardRef.value?.selectNone();
  }
}

function addNewCard() {
  const cardNumber = dashboard.totalCards.value + 1;
  const types = ['text', 'list', 'stats', 'chart', 'form'];
  const randomType = types[Math.floor(Math.random() * types.length)];

  dashboard.addCard({
    type: randomType,
    header: `Window ${cardNumber}`,
    x: 100 + (cardNumber * 40),
    y: 100 + (cardNumber * 40),
    width: 320,
    rotate: 0,
    z: dashboard.totalCards.value + 1
  });
}

function deleteCard(cardId: string) {
  dashboard.deleteCard(cardId);
}

function duplicateCard(cardId: string) {
  dashboard.duplicateCard(cardId, { x: 40, y: 40 });
}

function resetCards() {
  dashboard.resetToDefaults(DEFAULT_CARDS);
}

function arrangeWindows() {
  // Auto-arrange windows in a loose grid pattern (masonry-style)
  const cards = [...dashboard.cards.value];
  const cols = 3; // Number of columns
  const baseSpacingX = 50; // Base horizontal spacing
  const baseSpacingY = 60; // Base vertical spacing
  const startX = 30;
  const startY = 30;
  const randomOffset = 20; // Random offset for loose alignment

  cards.forEach((card: IMoveableDashboardContainer, index: number) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    // Add random offset for loose alignment
    const randomX = Math.random() * randomOffset - randomOffset / 2;
    const randomY = Math.random() * randomOffset - randomOffset / 2;

    card.x = startX + (col * (400 + baseSpacingX)) + randomX;
    card.y = startY + (row * (350 + baseSpacingY)) + randomY;
    card.z = index + 1;
  });

  // Update the store with the arranged cards
  cards.forEach(card => {
    dashboard.updateCardPosition(card.id, { x: card.x ?? 0, y: card.y ?? 0 });
  });
}

function onCardSelected(cardId: string) {
  dashboard.selectCard(cardId);
  console.log('[Dashboard 3] Window selected:', cardId);
}

function onCardDeselected() {
  dashboard.deselectCard();
  console.log('[Dashboard 3] Window deselected');
}

function onCardMoved(cardId: string, position: { x: number; y: number }) {
  dashboard.updateCardPosition(cardId, position);
  console.log('[Dashboard 3] Window moved:', cardId, position);
}

function onCardResized(cardId: string, size: { width: number }) {
  dashboard.updateCardSize(cardId, size);
  console.log('[Dashboard 3] Window resized:', cardId, size);
}

function onCardsUpdated(cards: IMoveableDashboardContainer[]) {
  console.log('[Dashboard 3] Windows updated');
  // State is automatically persisted by Pinia plugin
}

onMounted(() => {
  // Initialize with default cards if store is empty
  if (dashboard.totalCards.value === 0) {
    dashboard.initialize(DEFAULT_CARDS);
  }

  // Make dashboard API available globally for debugging
  if (typeof window !== 'undefined') {
    (window as any).dashboard3 = dashboard;
    console.log('Dashboard 3 API available at: window.dashboard3');
  }
});
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.floating-style {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.toolbar {
  flex-shrink: 0;
}

.dashboard-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.floating-workspace {
  position: relative;
}

.floating-workspace :deep(.viewport) {
  background: rgba(255, 255, 255, 0.05);
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
}
</style>
