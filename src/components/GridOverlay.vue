<template>
  <svg
    v-if="enabled"
    class="grid-overlay"
    :width="width"
    :height="height"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        :id="patternId"
        :width="gridSize"
        :height="gridSize"
        patternUnits="userSpaceOnUse"
      >
        <path
          :d="`M ${gridSize} 0 L 0 0 0 ${gridSize}`"
          fill="none"
          :stroke="gridColor"
          :stroke-width="strokeWidth"
        />
      </pattern>
    </defs>
    <rect
      width="100%"
      height="100%"
      :fill="`url(#${patternId})`"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  enabled?: boolean;
  gridSize?: number;
  width?: number | string;
  height?: number | string;
  gridColor?: string;
  strokeWidth?: number;
}

const props = withDefaults(defineProps<Props>(), {
  enabled: false,
  gridSize: 20,
  width: '100%',
  height: '100%',
  gridColor: 'rgba(0, 0, 0, 0.1)',
  strokeWidth: 0.5
});

// Generate unique pattern ID to support multiple grid instances
const patternId = computed(() => `grid-pattern-${Math.random().toString(36).substr(2, 9)}`);
</script>

<style scoped>
.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
}
</style>
