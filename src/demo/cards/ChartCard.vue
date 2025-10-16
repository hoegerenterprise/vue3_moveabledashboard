<template>
  <div class="chart-card pa-4">
    <v-row>
      <v-col cols="12">
        <div class="chart-placeholder">
          <v-icon size="48" color="primary">mdi-chart-line</v-icon>
          <p class="text-h6 mt-2">Sales Performance</p>
          <div class="chart-bars mt-4">
            <div v-for="(bar, i) in bars" :key="i" class="bar" :style="{ height: bar + '%' }"></div>
          </div>
          <p class="text-caption mt-2">Monthly Revenue Trend</p>
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

const bars = [45, 60, 75, 55, 80, 70, 85, 90];
</script>

<style scoped>
.chart-card {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  width: 100%;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 120px;
  gap: 8px;
}

.bar {
  flex: 1;
  background: linear-gradient(180deg, #1976d2, #42a5f5);
  border-radius: 4px 4px 0 0;
  min-height: 10px;
  transition: all 0.3s ease;
}

.bar:hover {
  opacity: 0.8;
}
</style>
