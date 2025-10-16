<template>
  <v-card class="dashboard-card" elevation="4">
    <v-layout>
      <!-- Optional header with title and actions -->
      <v-app-bar
        v-if="card.header"
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
 *
 * Slots:
 * - default: Main content area
 * - actions: Optional header actions (replaces default menu button)
 *
 * Example:
 * <DashboardCard :card="myCard">
 *   <div>Your content here</div>
 * </DashboardCard>
 */

const props = defineProps({
  card: {
    type: Object as PropType<IDashboardCard>,
    required: true
  }
});
</script>

<style scoped>
.dashboard-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-content {
  flex: 1;
  overflow: auto;
}
</style>
