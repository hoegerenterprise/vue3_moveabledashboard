<template>
  <div class="stats-card pa-4">
    <v-row>
      <v-col cols="6" v-for="stat in stats" :key="stat.label">
        <div class="stat-item">
          <v-icon :color="stat.color" size="32">{{ stat.icon }}</v-icon>
          <p class="text-h4 mt-2 mb-0">{{ stat.value }}</p>
          <p class="text-caption text-grey">{{ stat.label }}</p>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { IDashboardCard } from '../../types';

defineProps({
  card: {
    type: Object as PropType<IDashboardCard>,
    required: true
  }
});

const stats = [
  { icon: 'mdi-account-multiple', value: '1,234', label: 'Users', color: 'blue' },
  { icon: 'mdi-currency-usd', value: '$45.2K', label: 'Revenue', color: 'green' },
  { icon: 'mdi-cart', value: '567', label: 'Orders', color: 'orange' },
  { icon: 'mdi-star', value: '4.8', label: 'Rating', color: 'amber' }
];
</script>

<style scoped>
.stats-card {
  height: 100%;
}

.stat-item {
  text-align: center;
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
}
</style>
