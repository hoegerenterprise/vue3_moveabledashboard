<template>
  <div class="text-card pa-4">
    <v-textarea
      v-model="text"
      label="Notes"
      variant="outlined"
      auto-grow
      rows="8"
      placeholder="Type your notes here..."
    ></v-textarea>
    <div class="text-right mt-2">
      <v-btn size="small" color="primary" variant="text">
        <v-icon start>mdi-content-save</v-icon>
        Save
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue';
import { IDashboardCard } from '../../types';

defineProps({
  card: {
    type: Object as PropType<IDashboardCard>,
    required: true
  }
});

const text = ref('This is a text card where you can add notes, reminders, or any other text content.\n\nYou can resize this card and move it around the dashboard!');
</script>

<style scoped>
.text-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
