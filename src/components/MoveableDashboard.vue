<template>
  <div class="moveable-dashboard-container">
    <div class="viewport" @click="selectNone()">
      <!-- Grid Overlay -->
      <GridOverlay
        :enabled="gridEnabled"
        :grid-size="gridSize"
      />

      <!-- Render each card on the dashboard -->
      <div
        v-for="dashboardCard in cards"
        :key="dashboardCard.id"
        :data-target-id="dashboardCard.id"
        :class="{
          'dashboard-item': true,
          'target': dashboardCard.id === currentTargetID && enableEdit,
          'selected': dashboardCard.id === currentTargetID && enableEdit,
          'edit-mode': enableEdit,
          'view-mode': !enableEdit
        }"
        :style="getItemStyle(dashboardCard)"
        @click.stop="selectItem($event, dashboardCard)"
        @mousedown="enableEdit && draggable ? onMouseDown($event, dashboardCard) : null"
        ref="containerRefs"
      >
        <!-- Card content wrapper with pointer-events control -->
        <div :class="{ 'card-content-wrapper': true, 'disable-interactions': enableEdit }">
          <!-- Use scoped slot to allow parent to customize card rendering -->
          <slot :card="dashboardCard" :is-selected="dashboardCard.id === currentTargetID">
            <!-- Default rendering if no slot provided -->
            <DashboardCard
              :card="dashboardCard"
              :show-header="
                dashboardCard.useHeader !== undefined
                  ? dashboardCard.useHeader
                  : (dashboardCard.hideHeader !== undefined ? !dashboardCard.hideHeader : showCardHeaders)
              "
            >
              <div class="default-card-content">
                <h3>{{ dashboardCard.header || 'Card ' + dashboardCard.id }}</h3>
                <p>Card ID: {{ dashboardCard.id }}</p>
              </div>
            </DashboardCard>
          </slot>
        </div>

        <!-- Resize handle -->
        <div
          v-if="enableEdit && resizable && dashboardCard.id === currentTargetID"
          class="resize-handle"
          @mousedown.stop="onResizeStart($event, dashboardCard)"
        >
          <v-icon size="small">mdi-resize-bottom-right</v-icon>
        </div>

        <!-- Rotate handle -->
        <div
          v-if="enableEdit && rotatable && dashboardCard.id === currentTargetID"
          class="rotate-handle"
          @mousedown.stop="onRotateStart($event, dashboardCard)"
        >
          <v-icon size="small">mdi-rotate-right</v-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, PropType, computed } from 'vue';
import { IMoveableDashboardContainer } from '../types/interfaces';
import DashboardCard from './DashboardCard.vue';
import GridOverlay from './GridOverlay.vue';

/**
 * MoveableDashboard Component
 *
 * A dashboard that allows cards to be moved, resized, and rotated.
 * Uses native mouse events for interaction capabilities.
 *
 * Props:
 * - cards: Array of dashboard cards with position/size information
 * - enableEdit: Enable/disable editing mode (default: true)
 * - draggable: Allow dragging cards (default: true)
 * - resizable: Allow resizing cards (default: true)
 * - rotatable: Allow rotating cards (default: true)
 * - zoom: Zoom level for the dashboard (default: 1)
 * - showCardHeaders: Show/hide card headers (default: true)
 *
 * Events:
 * - card-selected: Emitted when a card is selected
 * - card-deselected: Emitted when selection is cleared
 * - card-moved: Emitted when a card is moved
 * - card-resized: Emitted when a card is resized
 * - card-rotated: Emitted when a card is rotated
 *
 * Slots:
 * - default (scoped): Customize how each card is rendered
 *   - Slot props: { card, isSelected }
 */

const props = defineProps({
  cards: {
    type: Array as PropType<IMoveableDashboardContainer[]>,
    required: true
  },
  enableEdit: {
    type: Boolean,
    default: true
  },
  draggable: {
    type: Boolean,
    default: true
  },
  resizable: {
    type: Boolean,
    default: true
  },
  rotatable: {
    type: Boolean,
    default: true
  },
  zoom: {
    type: Number,
    default: 1
  },
  gridEnabled: {
    type: Boolean,
    default: false
  },
  gridSize: {
    type: Number,
    default: 20
  },
  snapToGrid: {
    type: Boolean,
    default: false
  },
  showCardHeaders: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits<{
  'card-selected': [cardId: string];
  'card-deselected': [];
  'card-moved': [cardId: string, position: { x: number; y: number }];
  'card-resized': [cardId: string, size: { width: number }];
  'card-rotated': [cardId: string, rotation: number];
  'update:cards': [cards: IMoveableDashboardContainer[]];
}>();

const currentTargetID = ref<string>('');
const containerRefs = ref<HTMLElement[]>([]);

// Drag state
const dragState = ref<{
  isDragging: boolean;
  cardId: string;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
} | null>(null);

// Resize state
const resizeState = ref<{
  isResizing: boolean;
  cardId: string;
  startX: number;
  startY: number;
  startWidth: number;
} | null>(null);

// Rotate state
const rotateState = ref<{
  isRotating: boolean;
  cardId: string;
  startAngle: number;
  centerX: number;
  centerY: number;
  currentRotation: number;
} | null>(null);

/**
 * Snap a value to the grid if snap-to-grid is enabled
 */
function snapValue(value: number): number {
  if (props.snapToGrid && props.gridEnabled) {
    return Math.round(value / props.gridSize) * props.gridSize;
  }
  return value;
}

/**
 * Generate complete style object for a card
 */
function getItemStyle(item: IMoveableDashboardContainer) {
  const rotate = item.rotate ?? 0;
  const x = item.x ?? 0;
  const y = item.y ?? 0;

  let transform = `translate(${x}px, ${y}px)`;
  if (rotate !== 0) {
    transform += ` rotate(${rotate}deg)`;
  }

  return {
    width: `${item.width}px`,
    transform,
    position: 'absolute' as const,
    zIndex: item.z ?? 1
  };
}

/**
 * Handle mouse down on card for dragging
 */
function onMouseDown(e: MouseEvent, item: IMoveableDashboardContainer) {
  if (!props.enableEdit || !props.draggable) return;

  // Don't drag if clicking on handles
  const target = e.target as HTMLElement;
  if (target.closest('.resize-handle') || target.closest('.rotate-handle')) {
    return;
  }

  dragState.value = {
    isDragging: true,
    cardId: item.id,
    startX: e.clientX,
    startY: e.clientY,
    offsetX: item.x ?? 0,
    offsetY: item.y ?? 0
  };

  // Bring card to front
  bringToFront(item.id);

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

/**
 * Handle mouse move during drag/resize/rotate
 */
function onMouseMove(e: MouseEvent) {
  if (dragState.value?.isDragging) {
    const card = props.cards.find(c => c.id === dragState.value?.cardId);
    if (!card) return;

    const dx = e.clientX - dragState.value.startX;
    const dy = e.clientY - dragState.value.startY;

    card.x = dragState.value.offsetX + dx;
    card.y = dragState.value.offsetY + dy;
  } else if (resizeState.value?.isResizing) {
    const card = props.cards.find(c => c.id === resizeState.value?.cardId);
    if (!card) return;

    const dx = e.clientX - resizeState.value.startX;
    card.width = Math.max(200, resizeState.value.startWidth + dx);
  } else if (rotateState.value?.isRotating) {
    const card = props.cards.find(c => c.id === rotateState.value?.cardId);
    if (!card) return;

    const dx = e.clientX - rotateState.value.centerX;
    const dy = e.clientY - rotateState.value.centerY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    card.rotate = angle;
  }
}

/**
 * Handle mouse up to end drag/resize/rotate
 */
function onMouseUp() {
  if (dragState.value?.isDragging) {
    const card = props.cards.find(c => c.id === dragState.value?.cardId);
    if (card) {
      // Apply snap-to-grid if enabled
      card.x = snapValue(card.x ?? 0);
      card.y = snapValue(card.y ?? 0);

      emit('card-moved', card.id, { x: card.x ?? 0, y: card.y ?? 0 });
      emit('update:cards', props.cards);
    }
    dragState.value = null;
  } else if (resizeState.value?.isResizing) {
    const card = props.cards.find(c => c.id === resizeState.value?.cardId);
    if (card && card.width !== undefined) {
      emit('card-resized', card.id, { width: card.width });
      emit('update:cards', props.cards);
    }
    resizeState.value = null;
  } else if (rotateState.value?.isRotating) {
    const card = props.cards.find(c => c.id === rotateState.value?.cardId);
    if (card && card.rotate !== undefined) {
      emit('card-rotated', card.id, card.rotate);
      emit('update:cards', props.cards);
    }
    rotateState.value = null;
  }

  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}

/**
 * Handle resize start
 */
function onResizeStart(e: MouseEvent, item: IMoveableDashboardContainer) {
  if (!props.enableEdit || !props.resizable) return;

  e.stopPropagation();

  resizeState.value = {
    isResizing: true,
    cardId: item.id,
    startX: e.clientX,
    startY: e.clientY,
    startWidth: item.width ?? 300
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

/**
 * Handle rotate start
 */
function onRotateStart(e: MouseEvent, item: IMoveableDashboardContainer) {
  if (!props.enableEdit || !props.rotatable) return;

  e.stopPropagation();

  const element = (e.target as HTMLElement).closest('.dashboard-item') as HTMLElement;
  if (!element) return;

  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  rotateState.value = {
    isRotating: true,
    cardId: item.id,
    startAngle: Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI),
    centerX,
    centerY,
    currentRotation: item.rotate ?? 0
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

/**
 * Bring card to front
 */
function bringToFront(cardId: string) {
  const maxZ = Math.max(...props.cards.map(c => c.z ?? 1));
  const card = props.cards.find(c => c.id === cardId);
  if (card) {
    card.z = maxZ + 1;
  }
}

/**
 * Select a card
 */
function selectItem(e: Event, item: IMoveableDashboardContainer) {
  if (!props.enableEdit) return;

  currentTargetID.value = '';
  nextTick(() => {
    currentTargetID.value = item.id;
    emit('card-selected', item.id);
  });
}

/**
 * Deselect all cards
 */
function selectNone() {
  if (currentTargetID.value !== '') {
    currentTargetID.value = '';
    emit('card-deselected');
  }
}

/**
 * Find card by element
 */
function findItem(el: any): IMoveableDashboardContainer | undefined {
  const id = el.dataset.targetId;
  return props.cards.find((v) => v.id === id);
}

/**
 * Programmatically select a card
 */
function selectCard(cardId: string) {
  currentTargetID.value = '';
  nextTick(() => {
    currentTargetID.value = cardId;
    emit('card-selected', cardId);
  });
}

/**
 * Get currently selected card ID
 */
function getSelectedCardId(): string {
  return currentTargetID.value;
}

// Expose methods for parent component
defineExpose({
  selectCard,
  selectNone,
  getSelectedCardId
});
</script>

<style scoped>
.moveable-dashboard-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.viewport {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgb(var(--v-theme-surface));
  overflow: auto;
}

.dashboard-item {
  position: absolute;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.dashboard-item.edit-mode {
  cursor: move;
}

.dashboard-item.view-mode {
  cursor: default;
}

.dashboard-item.selected {
  box-shadow: 0 0 0 2px #1976d2;
  z-index: 1000;
}

/* Wrapper for card content */
.card-content-wrapper {
  width: 100%;
  height: 100%;
}

/* Disable all interactions with card content in edit mode */
.card-content-wrapper.disable-interactions {
  pointer-events: none;
  user-select: none;
}

.default-card-content {
  padding: 16px;
}

.default-card-content h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.default-card-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* Resize handle */
.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  cursor: nwse-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-primary), 0.1);
  border-top-left-radius: 4px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.dashboard-item:hover .resize-handle,
.dashboard-item.selected .resize-handle {
  opacity: 1;
}

.resize-handle:hover {
  background: rgba(var(--v-theme-primary), 0.2);
}

/* Rotate handle */
.rotate-handle {
  position: absolute;
  top: -12px;
  right: 50%;
  transform: translateX(50%);
  width: 24px;
  height: 24px;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-secondary), 0.9);
  border-radius: 50%;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.rotate-handle:active {
  cursor: grabbing;
}

.dashboard-item:hover .rotate-handle,
.dashboard-item.selected .rotate-handle {
  opacity: 1;
}

.rotate-handle:hover {
  background: rgba(var(--v-theme-secondary), 1);
}
</style>
