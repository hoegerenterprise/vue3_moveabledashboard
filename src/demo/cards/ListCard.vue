<template>
  <div class="list-card">
    <v-list density="compact">
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        :prepend-icon="item.icon"
        :title="item.title"
        :subtitle="item.subtitle"
      >
        <template v-slot:append>
          <v-chip :color="item.status === 'done' ? 'success' : 'warning'" size="small">
            {{ item.status }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>
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

const items = [
  { icon: 'mdi-check-circle', title: 'Complete documentation', subtitle: 'Due today', status: 'done' },
  { icon: 'mdi-clock-outline', title: 'Review pull requests', subtitle: 'Due tomorrow', status: 'pending' },
  { icon: 'mdi-check-circle', title: 'Update dependencies', subtitle: 'Completed', status: 'done' },
  { icon: 'mdi-clock-outline', title: 'Write unit tests', subtitle: 'In progress', status: 'pending' },
  { icon: 'mdi-check-circle', title: 'Deploy to staging', subtitle: 'Completed', status: 'done' }
];
</script>

<style scoped>
.list-card {
  height: 100%;
  overflow-y: auto;
}
</style>
