<template>
  <div class="floating-dashboard-container">
    <div class="viewport" @click="selectNone()">
      <!-- Render each floating card -->
      <div
        v-for="dashboardCard in cards"
        :key="dashboardCard.id"
        :data-target-id="dashboardCard.id"
        :class="{
          'floating-item': true,
          'target': dashboardCard.id === currentTargetID && enableEdit,
          'selected': dashboardCard.id === currentTargetID && enableEdit,
          'edit-mode': enableEdit,
          'view-mode': !enableEdit
        }"
        :style="getItemStyle(dashboardCard)"
        @click.stop="selectItem($event, dashboardCard)"
        @mousedown="!enableEdit ? null : onMouseDown($event, dashboardCard)"
        ref="containerRefs"
      >
        <!-- Card content wrapper with pointer-events control -->
        <div :class="{ 'card-content-wrapper': true, 'disable-interactions': enableEdit }">
          <!-- Use scoped slot to allow parent to customize card rendering -->
          <slot :card="dashboardCard" :is-selected="dashboardCard.id === currentTargetID">
            <!-- Default rendering if no slot provided -->
            <DashboardCard :card="dashboardCard">
              <div class="default-card-content">
                <h3>{{ dashboardCard.header || 'Card ' + dashboardCard.id }}</h3>
                <p>Card ID: {{ dashboardCard.id }}</p>
              </div>
            </DashboardCard>
          </slot>
        </div>

        <!-- Resize handle -->
        <div
          v-if="enableEdit && resizable"
          class="resize-handle"
          @mousedown.stop="onResizeStart($event, dashboardCard)"
        >
          <v-icon size="small">mdi-resize-bottom-right</v-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, PropType } from 'vue';
import { IMoveableDashboardContainer } from '../types/interfaces';
import DashboardCard from './DashboardCard.vue';

/**
 * FloatingDashboard Component
 *
 * A dashboard with floating cards that can be dragged and resized freely.
 * Unlike MoveableDashboard, this uses native drag instead of vue3-moveable.
 *
 * Props:
 * - cards: Array of dashboard cards with position/size information
 * - enableEdit: Enable/disable editing mode (default: true)
 * - draggable: Allow dragging cards (default: true)
 * - resizable: Allow resizing cards (default: true)
 * - zoom: Zoom level for the dashboard (default: 1)
 *
 * Events:
 * - card-selected: Emitted when a card is selected
 * - card-deselected: Emitted when selection is cleared
 * - card-moved: Emitted when a card is moved
 * - card-resized: Emitted when a card is resized
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
  zoom: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits<{
  'card-selected': [cardId: string];
  'card-deselected': [];
  'card-moved': [cardId: string, position: { x: number; y: number }];
  'card-resized': [cardId: string, size: { width: number; height?: number }];
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
  startHeight?: number;
} | null>(null);

/**
 * Generate complete style object for a card
 */
function getItemStyle(item: IMoveableDashboardContainer) {
  return {
    left: `${item.x ?? 0}px`,
    top: `${item.y ?? 0}px`,
    width: `${item.width}px`,
    zIndex: item.z ?? 1
  };
}

/**
 * Handle mouse down on card for dragging
 */
function onMouseDown(e: MouseEvent, item: IMoveableDashboardContainer) {
  if (!props.enableEdit || !props.draggable) return;

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
 * Handle mouse move during drag
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
    const dy = e.clientY - resizeState.value.startY;

    card.width = Math.max(200, resizeState.value.startWidth + dx);
    // Optional height resizing
    // if (resizeState.value.startHeight !== undefined) {
    //   card.height = Math.max(150, resizeState.value.startHeight + dy);
    // }
  }
}

/**
 * Handle mouse up to end drag/resize
 */
function onMouseUp() {
  if (dragState.value?.isDragging) {
    const card = props.cards.find(c => c.id === dragState.value?.cardId);
    if (card) {
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
 * Find card by id
 */
function findItem(id: string): IMoveableDashboardContainer | undefined {
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
.floating-dashboard-container {
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
  background-image:
    linear-gradient(rgba(var(--v-theme-on-surface), 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--v-theme-on-surface), 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.floating-item {
  position: absolute;
  transition: box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  overflow: hidden;
}

.floating-item.edit-mode {
  cursor: move;
}

.floating-item.view-mode {
  cursor: default;
}

.floating-item.selected {
  box-shadow: 0 0 0 3px #1976d2, 0 4px 12px rgba(0, 0, 0, 0.2);
}

.floating-item:hover.edit-mode {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
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
  opacity: 0;
  transition: opacity 0.2s ease;
}

.floating-item:hover .resize-handle,
.floating-item.selected .resize-handle {
  opacity: 1;
}

.resize-handle:hover {
  background: rgba(var(--v-theme-primary), 0.2);
}
</style>
