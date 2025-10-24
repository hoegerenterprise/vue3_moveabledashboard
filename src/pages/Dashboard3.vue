<template>
  <div class="dashboard-page">
    <!-- Toolbar -->
    <div class="toolbar">
      <v-toolbar color="primary" density="compact" elevation="1">
        <v-toolbar-title>
          <v-icon class="mr-2">mdi-window-restore</v-icon>
          Dashboard 3 - Floating Cards
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-chip size="small" variant="outlined" class="mr-2">
          Cards: {{ dashboard.totalCards.value }}
        </v-chip>

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
      </v-toolbar>
    </div>

    <!-- Dashboard Container -->
    <div class="dashboard-wrapper">
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
              <v-btn icon size="small" variant="text" @click="duplicateCard(card.id)">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
              <v-btn icon size="small" variant="text" @click="deleteCard(card.id)">
                <v-icon>mdi-delete</v-icon>
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

// Default cards for Dashboard 3 - Floating layout
const DEFAULT_CARDS: IMoveableDashboardContainer[] = [
  {
    id: 'dash3-card-1',
    type: 'stats',
    header: 'Performance Metrics',
    x: 50,
    y: 50,
    width: 350,
    rotate: 0,
    z: 1
  },
  {
    id: 'dash3-card-2',
    type: 'chart',
    header: 'Revenue Trends',
    x: 450,
    y: 80,
    width: 400,
    rotate: 0,
    z: 2
  },
  {
    id: 'dash3-card-3',
    type: 'form',
    header: 'Quick Contact',
    x: 100,
    y: 380,
    width: 380,
    rotate: 0,
    z: 3
  },
  {
    id: 'dash3-card-4',
    type: 'list',
    header: 'Recent Activities',
    x: 520,
    y: 400,
    width: 320,
    rotate: 0,
    z: 4
  },
  {
    id: 'dash3-card-5',
    type: 'text',
    header: 'Notes',
    x: 900,
    y: 120,
    width: 300,
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
  dashboard.addCard({
    type: 'text',
    header: `New Card`,
    x: 150 + (dashboard.totalCards.value * 30),
    y: 150 + (dashboard.totalCards.value * 30),
    width: 300,
    rotate: 0,
    z: dashboard.totalCards.value + 1
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

function onCardSelected(cardId: string) {
  dashboard.selectCard(cardId);
  console.log('[Dashboard 3] Card selected:', cardId);
}

function onCardDeselected() {
  dashboard.deselectCard();
  console.log('[Dashboard 3] Card deselected');
}

function onCardMoved(cardId: string, position: { x: number; y: number }) {
  dashboard.updateCardPosition(cardId, position);
  console.log('[Dashboard 3] Card moved:', cardId, position);
}

function onCardResized(cardId: string, size: { width: number }) {
  dashboard.updateCardSize(cardId, size);
  console.log('[Dashboard 3] Card resized:', cardId, size);
}

function onCardsUpdated(cards: IMoveableDashboardContainer[]) {
  console.log('[Dashboard 3] Cards updated');
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

.toolbar {
  flex-shrink: 0;
}

.dashboard-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}
</style>
