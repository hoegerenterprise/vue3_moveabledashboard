<template>
  <v-container fluid class="pa-0">
    <!-- Header -->
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-title>Vue3 Moveable Dashboard - Demo</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleEditMode">
        <v-icon>{{ dashboard.editMode.value ? 'mdi-lock-open' : 'mdi-lock' }}</v-icon>
      </v-btn>
      <v-btn icon @click="addNewCard">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn icon @click="resetCards">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Info Panel -->
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-alert type="info" variant="tonal" class="mb-4">
            <v-alert-title>
              <v-icon>mdi-information</v-icon>
              Dashboard Demo
            </v-alert-title>
            <div class="mt-2">
              <p><strong>Instructions:</strong></p>
              <ul>
                <li>Click on any card to select it</li>
                <li>Drag to move cards around</li>
                <li>Use the corner handles to resize</li>
                <li>Use the rotation handle to rotate cards</li>
                <li>Click the lock icon to toggle edit mode</li>
                <li>Click the plus icon to add a new card</li>
                <li>Click the refresh icon to reset all cards</li>
              </ul>
              <p class="mt-2">
                <strong>Edit Mode:</strong> {{ dashboard.editMode.value ? 'Enabled' : 'Disabled' }} |
                <strong>Selected Card:</strong> {{ dashboard.selectedCardId.value || 'None' }} |
                <strong>Total Cards:</strong> {{ dashboard.totalCards.value }}
              </p>
            </div>
          </v-alert>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dashboard Container -->
    <div class="dashboard-wrapper">
      <MoveableDashboard
        ref="dashboardRef"
        :cards="dashboard.cards.value"
        :enable-edit="dashboard.editMode.value"
        :draggable="true"
        :resizable="true"
        :rotatable="true"
        :zoom="1"
        @card-selected="onCardSelected"
        @card-deselected="onCardDeselected"
        @card-moved="onCardMoved"
        @card-resized="onCardResized"
        @card-rotated="onCardRotated"
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
            <template v-else>
              <DefaultCard :card="card" :is-selected="isSelected" />
            </template>

            <!-- Actions slot for card header -->
            <template #actions>
              <v-btn icon size="small" variant="text" @click="deleteCard(card.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </DashboardCard>
        </template>
      </MoveableDashboard>
    </div>

    <!-- Debug Panel (Optional) -->
    <v-container v-if="showDebug">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Debug Information</v-card-title>
            <v-card-text>
              <pre>{{ JSON.stringify(dashboard.cards.value, null, 2) }}</pre>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MoveableDashboard, DashboardCard } from '../index';
import type { IMoveableDashboardContainer } from '../types';
import { useDashboardAPI } from '../composables/useDashboardAPI';
import ChartCard from './cards/ChartCard.vue';
import StatsCard from './cards/StatsCard.vue';
import ListCard from './cards/ListCard.vue';
import TextCard from './cards/TextCard.vue';
import DefaultCard from './cards/DefaultCard.vue';

const dashboardRef = ref<InstanceType<typeof MoveableDashboard> | null>(null);
const showDebug = ref(false);

// Use Dashboard API
const dashboard = useDashboardAPI();

// Default cards configuration
const DEFAULT_CARDS: IMoveableDashboardContainer[] = [
  {
    id: 'card-1',
    type: 'chart',
    header: 'Sales Chart',
    x: 20,
    y: 20,
    width: 400,
    rotate: 0,
    z: 1
  },
  {
    id: 'card-2',
    type: 'stats',
    header: 'Statistics',
    x: 440,
    y: 20,
    width: 350,
    rotate: 0,
    z: 1
  },
  {
    id: 'card-3',
    type: 'list',
    header: 'Task List',
    x: 20,
    y: 350,
    width: 300,
    rotate: 0,
    z: 1
  },
  {
    id: 'card-4',
    type: 'text',
    header: 'Notes',
    x: 340,
    y: 350,
    width: 450,
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

function resetCards() {
  dashboard.resetToDefaults(DEFAULT_CARDS);
}

function onCardSelected(cardId: string) {
  dashboard.selectCard(cardId);
  console.log('Card selected:', cardId);
}

function onCardDeselected() {
  dashboard.deselectCard();
  console.log('Card deselected');
}

function onCardMoved(cardId: string, position: { x: number; y: number }) {
  dashboard.updateCardPosition(cardId, position);
  console.log('Card moved:', cardId, position);
}

function onCardResized(cardId: string, size: { width: number }) {
  dashboard.updateCardSize(cardId, size);
  console.log('Card resized:', cardId, size);
}

function onCardRotated(cardId: string, rotation: number) {
  dashboard.updateCardRotation(cardId, rotation);
  console.log('Card rotated:', cardId, rotation);
}

function onCardsUpdated(cards: IMoveableDashboardContainer[]) {
  console.log('Cards updated:', cards);
  // State is automatically persisted by Pinia plugin
}

onMounted(() => {
  // Initialize with default cards if store is empty
  if (dashboard.totalCards.value === 0) {
    dashboard.initialize(DEFAULT_CARDS);
  }

  // Make dashboard API available globally for debugging
  if (typeof window !== 'undefined') {
    (window as any).dashboard = dashboard;
    console.log('Dashboard API available at: window.dashboard');
    console.log('Try: dashboard.debug() to see current state');
  }
});
</script>

<style scoped>
.dashboard-wrapper {
  height: calc(100vh - 200px);
  min-height: 600px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  position: relative;
}

pre {
  font-size: 12px;
  max-height: 400px;
  overflow: auto;
}
</style>
