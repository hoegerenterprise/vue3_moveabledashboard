<template>
  <div class="dashboard-page">
    <!-- Fixed Top Toolbar -->
    <div v-if="!useFloatingToolbar" class="toolbar">
      <v-toolbar color="primary" density="compact" elevation="1">
        <v-toolbar-title>
          <v-icon class="mr-2">mdi-view-dashboard</v-icon>
          Dashboard 1 - Main Workspace
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-chip size="small" variant="outlined" class="mr-2">
          Cards: {{ dashboard.totalCards.value }}
        </v-chip>

        <v-btn
          icon
          size="small"
          @click="toggleGrid"
          :color="dashboard.gridEnabled.value ? 'success' : undefined"
        >
          <v-icon>mdi-grid</v-icon>
          <v-tooltip activator="parent" location="bottom">Toggle Grid</v-tooltip>
        </v-btn>
        <v-btn
          icon
          size="small"
          @click="toggleSnapToGrid"
          :color="dashboard.snapToGrid.value ? 'success' : undefined"
          :disabled="!dashboard.gridEnabled.value"
        >
          <v-icon>mdi-magnet</v-icon>
          <v-tooltip activator="parent" location="bottom">Snap to Grid</v-tooltip>
        </v-btn>
        <v-btn
          icon
          size="small"
          @click="toggleEditMode"
          :color="dashboard.editMode.value ? 'warning' : undefined"
        >
          <v-icon>{{ dashboard.editMode.value ? 'mdi-pencil' : 'mdi-eye' }}</v-icon>
          <v-tooltip activator="parent" location="bottom">
            {{ dashboard.editMode.value ? 'Edit Mode (Click to View)' : 'View Mode (Click to Edit)' }}
          </v-tooltip>
        </v-btn>
        <v-btn icon size="small" @click="addNewCard">
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="bottom">Add Card</v-tooltip>
        </v-btn>
        <v-btn icon size="small" @click="resetCards">
          <v-icon>mdi-refresh</v-icon>
          <v-tooltip activator="parent" location="bottom">Reset</v-tooltip>
        </v-btn>

        <v-divider vertical class="mx-2"></v-divider>

        <v-btn
          icon
          size="small"
          @click="toggleToolbarMode"
          color="info"
        >
          <v-icon>mdi-dock-window</v-icon>
          <v-tooltip activator="parent" location="bottom">Switch to Floating Toolbar</v-tooltip>
        </v-btn>
      </v-toolbar>
    </div>

    <!-- Floating Toolbar -->
    <FloatingToolbar
      v-if="useFloatingToolbar"
      :visible="showFloatingToolbar"
      color="primary"
      :initial-x="100"
      :initial-y="100"
      @close="showFloatingToolbar = false"
    >
      <template #prepend>
        <v-chip size="small" variant="flat" color="white" class="mr-2">
          <v-icon start size="small">mdi-cards</v-icon>
          {{ dashboard.totalCards.value }}
        </v-chip>
      </template>

      <v-btn
        icon
        size="small"
        @click="toggleGrid"
        :color="dashboard.gridEnabled.value ? 'success' : 'default'"
        variant="flat"
      >
        <v-icon>mdi-grid</v-icon>
        <v-tooltip activator="parent" location="bottom">Toggle Grid</v-tooltip>
      </v-btn>

      <v-btn
        icon
        size="small"
        @click="toggleSnapToGrid"
        :color="dashboard.snapToGrid.value ? 'success' : 'default'"
        :disabled="!dashboard.gridEnabled.value"
        variant="flat"
      >
        <v-icon>mdi-magnet</v-icon>
        <v-tooltip activator="parent" location="bottom">Snap to Grid</v-tooltip>
      </v-btn>

      <v-btn
        icon
        size="small"
        @click="toggleEditMode"
        :color="dashboard.editMode.value ? 'warning' : 'default'"
        variant="flat"
      >
        <v-icon>{{ dashboard.editMode.value ? 'mdi-pencil' : 'mdi-eye' }}</v-icon>
        <v-tooltip activator="parent" location="bottom">
          {{ dashboard.editMode.value ? 'Edit Mode' : 'View Mode' }}
        </v-tooltip>
      </v-btn>

      <v-btn
        icon
        size="small"
        @click="addNewCard"
        variant="flat"
      >
        <v-icon>mdi-plus</v-icon>
        <v-tooltip activator="parent" location="bottom">Add Card</v-tooltip>
      </v-btn>

      <v-btn
        icon
        size="small"
        @click="resetCards"
        variant="flat"
      >
        <v-icon>mdi-refresh</v-icon>
        <v-tooltip activator="parent" location="bottom">Reset</v-tooltip>
      </v-btn>

      <template #append>
        <v-divider vertical class="mx-2"></v-divider>

        <v-btn
          icon
          size="small"
          @click="toggleToolbarMode"
          color="info"
          variant="flat"
        >
          <v-icon>mdi-dock-top</v-icon>
          <v-tooltip activator="parent" location="bottom">Switch to Fixed Toolbar</v-tooltip>
        </v-btn>
      </template>
    </FloatingToolbar>

    <!-- Show Floating Toolbar Button (when hidden) -->
    <v-btn
      v-if="useFloatingToolbar && !showFloatingToolbar"
      icon
      color="primary"
      class="show-toolbar-fab"
      size="small"
      @click="showFloatingToolbar = true"
    >
      <v-icon>mdi-toolbox</v-icon>
      <v-tooltip activator="parent" location="right">Show Floating Toolbar</v-tooltip>
    </v-btn>

    <!-- Dashboard Container -->
    <div class="dashboard-wrapper" :class="{ 'full-height': useFloatingToolbar }">
      <MoveableDashboard
        ref="dashboardRef"
        :cards="dashboard.cards.value"
        :enable-edit="dashboard.editMode.value"
        :draggable="true"
        :resizable="true"
        :rotatable="false"
        :zoom="1"
        :grid-enabled="dashboard.gridEnabled.value"
        :grid-size="dashboard.gridSize.value"
        :snap-to-grid="dashboard.snapToGrid.value"
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
              <v-btn icon size="small" variant="text" @click="duplicateCard(card.id)">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
              <v-btn icon size="small" variant="text" @click="deleteCard(card.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </DashboardCard>
        </template>
      </MoveableDashboard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MoveableDashboard, DashboardCard } from '../index';
import type { IMoveableDashboardContainer } from '../types';
import { useDashboardAPI } from '../composables/useDashboardAPI';
import ChartCard from '../demo/cards/ChartCard.vue';
import StatsCard from '../demo/cards/StatsCard.vue';
import ListCard from '../demo/cards/ListCard.vue';
import TextCard from '../demo/cards/TextCard.vue';
import FormCard from '../demo/cards/FormCard.vue';
import DefaultCard from '../demo/cards/DefaultCard.vue';
import FloatingToolbar from '../components/FloatingToolbar.vue';

const dashboardRef = ref<InstanceType<typeof MoveableDashboard> | null>(null);

// Use Dashboard API with unique ID
const dashboard = useDashboardAPI('dashboard-1');

// Toolbar mode state
const useFloatingToolbar = ref(false);
const showFloatingToolbar = ref(true);

// Default cards for Dashboard 1
const DEFAULT_CARDS: IMoveableDashboardContainer[] = [
  {
    id: 'dash1-card-1',
    type: 'chart',
    header: 'Sales Overview',
    x: 20,
    y: 20,
    width: 400,
    rotate: 0,
    z: 1
  },
  {
    id: 'dash1-card-2',
    type: 'stats',
    header: 'Key Metrics',
    x: 440,
    y: 20,
    width: 350,
    rotate: 0,
    z: 1
  },
  {
    id: 'dash1-card-3',
    type: 'list',
    header: 'Main Tasks',
    x: 20,
    y: 350,
    width: 300,
    rotate: 0,
    z: 1
  },
  {
    id: 'dash1-card-4',
    type: 'form',
    header: 'Contact Form',
    x: 340,
    y: 350,
    width: 380,
    rotate: 0,
    z: 1
  }
];

function toggleEditMode() {
  dashboard.toggleEditMode();
  if (!dashboard.editMode.value) {
    dashboardRef.value?.selectNone();
  }
}

function toggleToolbarMode() {
  useFloatingToolbar.value = !useFloatingToolbar.value;
  if (useFloatingToolbar.value) {
    showFloatingToolbar.value = true;
  }
}

function addNewCard() {
  dashboard.addCard({
    type: 'text',
    header: `New Card`,
    x: 100 + (dashboard.totalCards.value * 20),
    y: 100 + (dashboard.totalCards.value * 20),
    width: 300,
    rotate: 0,
    z: 1
  });
}

function deleteCard(cardId: string) {
  dashboard.deleteCard(cardId);
}

function duplicateCard(cardId: string) {
  dashboard.duplicateCard(cardId, { x: 30, y: 30 });
}

function resetCards() {
  dashboard.resetToDefaults(DEFAULT_CARDS);
}

function toggleGrid() {
  dashboard.toggleGrid();
}

function toggleSnapToGrid() {
  dashboard.toggleSnapToGrid();
}

function onCardSelected(cardId: string) {
  dashboard.selectCard(cardId);
  console.log('[Dashboard 1] Card selected:', cardId);
}

function onCardDeselected() {
  dashboard.deselectCard();
  console.log('[Dashboard 1] Card deselected');
}

function onCardMoved(cardId: string, position: { x: number; y: number }) {
  dashboard.updateCardPosition(cardId, position);
  console.log('[Dashboard 1] Card moved:', cardId, position);
}

function onCardResized(cardId: string, size: { width: number }) {
  dashboard.updateCardSize(cardId, size);
  console.log('[Dashboard 1] Card resized:', cardId, size);
}

function onCardsUpdated(cards: IMoveableDashboardContainer[]) {
  console.log('[Dashboard 1] Cards updated');
  // State is automatically persisted by Pinia plugin
}

onMounted(() => {
  // Initialize with default cards if store is empty
  if (dashboard.totalCards.value === 0) {
    dashboard.initialize(DEFAULT_CARDS);
  }

  // Make dashboard API available globally for debugging
  if (typeof window !== 'undefined') {
    (window as any).dashboard1 = dashboard;
    console.log('Dashboard 1 API available at: window.dashboard1');
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

.toolbar {
  flex-shrink: 0;
}

.dashboard-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.dashboard-wrapper.full-height {
  height: 100%;
}

.show-toolbar-fab {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1999;
}
</style>
