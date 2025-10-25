<template>
  <transition name="fade">
    <v-toolbar
      v-if="visible"
      color="surface"
      rounded="lg"
      border
      floating
      elevation="8"
      class="floating-toolbar"
      :style="{ left: position.x + 'px', top: position.y + 'px' }"
    >
      <!-- Drag Handle -->
      <div
        class="drag-handle"
        @mousedown="startDrag"
      >
        <v-icon size="small">mdi-drag-horizontal-variant</v-icon>
      </div>

      <v-divider vertical class="mx-2"></v-divider>

      <!-- Toolbar Content -->
      <slot name="prepend"></slot>

      <div class="toolbar-content">
        <slot></slot>
      </div>

      <v-spacer></v-spacer>

      <slot name="append"></slot>

      <!-- Close/Minimize Button -->
      <v-btn
        icon
        size="small"
        variant="text"
        @click="$emit('close')"
        class="ml-2"
      >
        <v-icon>mdi-close</v-icon>
        <v-tooltip activator="parent" location="bottom">Hide Floating Toolbar</v-tooltip>
      </v-btn>
    </v-toolbar>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  visible?: boolean;
  color?: string;
  initialX?: number;
  initialY?: number;
}

const props = withDefaults(defineProps<Props>(), {
  visible: true,
  color: 'primary',
  initialX: 50,
  initialY: 50
});

defineEmits<{
  close: [];
}>();

const position = ref({
  x: props.initialX,
  y: props.initialY
});

const dragState = ref<{
  isDragging: boolean;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
} | null>(null);

function startDrag(e: MouseEvent) {
  dragState.value = {
    isDragging: true,
    startX: e.clientX,
    startY: e.clientY,
    offsetX: position.value.x,
    offsetY: position.value.y
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(e: MouseEvent) {
  if (!dragState.value?.isDragging) return;

  const dx = e.clientX - dragState.value.startX;
  const dy = e.clientY - dragState.value.startY;

  position.value.x = dragState.value.offsetX + dx;
  position.value.y = dragState.value.offsetY + dy;
}

function onMouseUp() {
  dragState.value = null;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
});
</script>

<style scoped>
.floating-toolbar {
  position: fixed;
  z-index: 2000;
  min-width: 400px;
  user-select: none;
}

.drag-handle {
  cursor: move;
  padding: 8px;
  display: flex;
  align-items: center;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.drag-handle:hover {
  opacity: 1;
}

.toolbar-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
