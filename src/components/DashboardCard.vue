<template>
  <v-card class="dashboard-card" elevation="4">
    <!-- Action buttons overlay for headerless cards in edit mode -->
    <div
      v-if="!showHeader && editMode && $slots.actions"
      class="actions-overlay"
    >
      <slot name="actions"></slot>
    </div>

    <v-layout>
      <!-- Optional header with title and actions -->
      <v-app-bar
        v-if="showHeader && card.header"
        color="primary"
        density="compact"
        :elevation="0"
      >
        <v-app-bar-title>{{ card.header }}</v-app-bar-title>

        <v-spacer></v-spacer>

        <!-- Optional actions slot -->
        <template v-if="$slots.actions">
          <slot name="actions"></slot>
        </template>

        <!-- Default action button -->
        <v-btn v-else icon variant="text" size="small">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>

      <v-main class="card-content">
        <!-- Main content slot - this is where users insert their card content -->
        <slot></slot>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { IDashboardCard } from '../types/interfaces';

/**
 * DashboardCard Component
 *
 * A card container that can be placed on a moveable dashboard.
 * Content is provided via the default slot.
 *
 * Props:
 * - card: The card configuration object containing id, header, dimensions, etc.
 * - showHeader: Whether to display the card header (default: true)
 * - editMode: Whether dashboard is in edit mode (default: false)
 *
 * Slots:
 * - default: Main content area
 * - actions: Optional header actions (replaces default menu button)
 *
 * Example:
 * <DashboardCard :card="myCard" :show-header="false" :edit-mode="true">
 *   <div>Your content here</div>
 * </DashboardCard>
 */

const props = defineProps({
  card: {
    type: Object as PropType<IDashboardCard>,
    required: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  editMode: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.dashboard-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  isolation: isolate;
}

.dashboard-card :deep(.v-layout) {
  position: relative;
  z-index: 1;
}

.card-content {
  flex: 1;
  overflow: auto;
}

.actions-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1000;
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  pointer-events: all !important;
}

/* Dark theme override */
:deep(.v-theme--dark) .actions-overlay,
.v-theme--dark .actions-overlay {
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.actions-overlay :deep(*) {
  pointer-events: all !important;
}
</style>
