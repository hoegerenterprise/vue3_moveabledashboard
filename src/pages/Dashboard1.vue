<template>
  <v-container fluid class="pa-0">
    <!-- Header -->
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-title>Dashboard 1 - Main Workspace</v-app-bar-title>
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
              <v-icon>mdi-view-dashboard</v-icon>
              Dashboard 1 - Main Workspace
            </v-alert-title>
            <div class="mt-2">
              <p><strong>This is your main dashboard for primary tasks.</strong></p>
              <p class="mt-2">
                <strong>Edit Mode:</strong> {{ dashboard.editMode.value ? 'Enabled' : 'Disabled' }} |
                <strong>Selected Card:</strong> {{ dashboard.selectedCardId.value || 'None' }} |
                <strong>Total Cards:</strong> {{ dashboard.totalCards.value }}
              </p>
              <p class="mt-2">
                <v-chip color="success" size="small">Persisted independently from Dashboard 2</v-chip>
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
  </v-container>
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
import DefaultCard from '../demo/cards/DefaultCard.vue';

const dashboardRef = ref<InstanceType<typeof MoveableDashboard> | null>(null);

// Use Dashboard API with unique ID
const dashboard = useDashboardAPI('dashboard-1');

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

function duplicateCard(cardId: string) {
  dashboard.duplicateCard(cardId, { x: 30, y: 30 });
}

function resetCards() {
  dashboard.resetToDefaults(DEFAULT_CARDS);
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

function onCardRotated(cardId: string, rotation: number) {
  dashboard.updateCardRotation(cardId, rotation);
  console.log('[Dashboard 1] Card rotated:', cardId, rotation);
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
.dashboard-wrapper {
  height: calc(100vh - 250px);
  min-height: 600px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  position: relative;
}
</style>
