<template>
  <div class="moveable-dashboard-container">
    <div class="viewport" @click="selectNone()">
      <!-- Render each card on the dashboard -->
      <div
        v-for="dashboardCard in cards"
        :key="dashboardCard.id"
        :data-target-id="dashboardCard.id"
        :class="{
          'dashboard-item': true,
          'target': dashboardCard.id === currentTargetID,
          'selected': dashboardCard.id === currentTargetID
        }"
        :style="getItemStyle(dashboardCard)"
        @click.stop="selectItem($event, dashboardCard)"
        ref="containerRefs"
      >
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

      <!-- Moveable component for drag, resize, rotate -->
      <Moveable
        v-if="currentTargetID !== '' && enableEdit"
        ref="moveable"
        :target="['.target']"
        :zoom="zoom"
        :draggable="draggable"
        :rotatable="rotatable"
        :resizable="resizable"
        @drag="onDrag"
        @drag-end="onDragEnd"
        @resize="onResize"
        @resize-end="onResizeEnd"
        @rotate="onRotate"
        @rotate-end="onRotateEnd"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, PropType } from 'vue';
import { IMoveableDashboardContainer } from '../types/interfaces';
import Moveable from 'vue3-moveable';
import DashboardCard from './DashboardCard.vue';

/**
 * MoveableDashboard Component
 *
 * A dashboard that allows cards to be moved, resized, and rotated.
 * Uses vue3-moveable for interaction capabilities.
 *
 * Props:
 * - cards: Array of dashboard cards with position/size information
 * - enableEdit: Enable/disable editing mode (default: true)
 * - draggable: Allow dragging cards (default: true)
 * - resizable: Allow resizing cards (default: true)
 * - rotatable: Allow rotating cards (default: true)
 * - zoom: Zoom level for the dashboard (default: 1)
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

/**
 * Parse transform string to extract x and y coordinates
 */
function parseTransform(transform: string): { x: number; y: number } {
  const regex = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/;
  const match = transform.match(regex);

  let x = 0;
  let y = 0;

  if (match) {
    x = parseFloat(match[1]);
    y = parseFloat(match[2]);
  }

  return { x, y };
}

/**
 * Generate transform string from card position
 */
function getTransform(item: IMoveableDashboardContainer): string {
  const x = item.x ?? 0;
  const y = item.y ?? 0;
  return `translate(${x}px, ${y}px)`;
}

/**
 * Generate complete style object for a card
 */
function getItemStyle(item: IMoveableDashboardContainer) {
  const rotate = item.rotate ?? 0;
  let transform = getTransform(item);

  if (rotate !== 0) {
    transform += ` rotate(${rotate}deg)`;
  }

  return {
    width: `${item.width}px`,
    transform,
    position: 'absolute' as const
  };
}

/**
 * Handle drag event
 */
const onDrag = (e: any) => {
  const item = findItem(e.target);
  if (!item) return;

  e.target.style.transform = e.transform;
  const transformObject = parseTransform(e.transform);

  item.x = transformObject.x;
  item.y = transformObject.y;
};

/**
 * Handle drag end event
 */
const onDragEnd = (e: any) => {
  const item = findItem(e.target);
  if (!item) return;

  e.target.style.transform = e.lastEvent.transform;

  emit('card-moved', item.id, { x: item.x, y: item.y });
  emit('update:cards', props.cards);
};

/**
 * Handle resize event
 */
const onResize = (e: any) => {
  const item = findItem(e.target);
  if (!item) return;

  item.width = e.width;
  e.target.style.width = `${e.width}px`;
};

/**
 * Handle resize end event
 */
const onResizeEnd = (e: any) => {
  const item = findItem(e.target);
  if (!item || typeof item.width === 'undefined') return;

  emit('card-resized', item.id, { width: item.width });
  emit('update:cards', props.cards);
};

/**
 * Handle rotate event
 */
function onRotate(e: any) {
  const item = findItem(e.target);
  if (!item) return;

  item.rotate = e.rotation;
  e.target.style.transform = e.drag.transform;
}

/**
 * Handle rotate end event
 */
function onRotateEnd(e: any) {
  const item = findItem(e.target);
  if (!item) return;

  emit('card-rotated', item.id, item.rotate);
  emit('update:cards', props.cards);
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
  background-color: #f5f5f5;
  overflow: auto;
}

.dashboard-item {
  position: absolute;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.dashboard-item.selected {
  box-shadow: 0 0 0 2px #1976d2;
  z-index: 1000;
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
</style>
