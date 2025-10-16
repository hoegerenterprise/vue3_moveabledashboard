<template>
  <div class="default-card pa-4">
    <div class="card-placeholder">
      <v-icon size="64" color="grey-lighten-1">mdi-view-dashboard</v-icon>
      <p class="text-h6 mt-4">{{ card.header || 'Default Card' }}</p>
      <p class="text-caption text-grey">Card ID: {{ card.id }}</p>
      <p class="text-caption text-grey mt-2">Type: {{ card.type || 'default' }}</p>

      <v-chip v-if="isSelected" color="primary" class="mt-4">
        <v-icon start>mdi-cursor-pointer</v-icon>
        Selected
      </v-chip>

      <div class="card-info mt-4">
        <v-divider class="mb-4"></v-divider>
        <p class="text-body-2">
          <strong>Position:</strong> x: {{ card.x }}, y: {{ card.y }}
        </p>
        <p class="text-body-2">
          <strong>Width:</strong> {{ card.width }}px
        </p>
        <p class="text-body-2">
          <strong>Rotation:</strong> {{ card.rotate || 0 }}°
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { IDashboardCard } from '../../types';

defineProps({
  card: {
    type: Object as PropType<IDashboardCard>,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.default-card {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-placeholder {
  text-align: center;
  width: 100%;
}

.card-info {
  max-width: 250px;
  margin: 0 auto;
  text-align: left;
}
</style>
