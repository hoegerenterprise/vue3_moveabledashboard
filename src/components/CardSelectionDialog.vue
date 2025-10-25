<template>
  <v-dialog v-model="dialogVisible" max-width="800">
    <v-card>
      <v-card-title class="bg-primary">
        <v-icon class="mr-2">mdi-cards</v-icon>
        Select Card Type
      </v-card-title>

      <v-card-text class="pa-4">
        <!-- Category Filter -->
        <v-chip-group
          v-model="selectedCategory"
          mandatory
          class="mb-4"
        >
          <v-chip
            value="all"
            filter
            variant="outlined"
          >
            All Cards
          </v-chip>
          <v-chip
            v-for="category in categories"
            :key="category"
            :value="category"
            filter
            variant="outlined"
          >
            {{ category }}
          </v-chip>
        </v-chip-group>

        <!-- Card Templates Grid -->
        <v-row>
          <v-col
            v-for="template in filteredTemplates"
            :key="template.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              :class="{ 'selected-card': selectedTemplate?.id === template.id }"
              variant="outlined"
              hover
              @click="selectTemplate(template)"
              class="card-template"
            >
              <v-card-text class="text-center pa-4">
                <v-icon
                  :icon="template.icon"
                  size="48"
                  :color="selectedTemplate?.id === template.id ? 'primary' : 'default'"
                  class="mb-2"
                ></v-icon>
                <div class="text-subtitle-1 font-weight-bold">{{ template.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ template.description }}</div>
                <v-chip
                  size="x-small"
                  class="mt-2"
                  variant="tonal"
                  color="secondary"
                >
                  {{ template.category }}
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-alert
          v-if="filteredTemplates.length === 0"
          type="info"
          variant="tonal"
          class="mt-4"
        >
          No card templates available in this category.
        </v-alert>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="cancel"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :disabled="!selectedTemplate"
          @click="confirm"
        >
          <v-icon start>mdi-plus</v-icon>
          Add Card
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCardCatalogStore, type CardTemplate } from '../stores/cardCatalog';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'select', template: CardTemplate): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const catalogStore = useCardCatalogStore();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const selectedCategory = ref<string>('all');
const selectedTemplate = ref<CardTemplate | null>(null);

// Get all categories
const categories = computed(() => catalogStore.getCategories());

// Filter templates based on selected category
const filteredTemplates = computed(() => {
  if (selectedCategory.value === 'all') {
    return catalogStore.templates;
  }
  return catalogStore.getTemplatesByCategory(selectedCategory.value);
});

function selectTemplate(template: CardTemplate) {
  selectedTemplate.value = template;
}

function confirm() {
  if (selectedTemplate.value) {
    emit('select', selectedTemplate.value);
    dialogVisible.value = false;
    selectedTemplate.value = null;
    selectedCategory.value = 'all';
  }
}

function cancel() {
  dialogVisible.value = false;
  selectedTemplate.value = null;
  selectedCategory.value = 'all';
}

// Reset selection when dialog opens
watch(dialogVisible, (newVal) => {
  if (newVal) {
    selectedTemplate.value = null;
    selectedCategory.value = 'all';
  }
});
</script>

<style scoped>
.card-template {
  cursor: pointer;
  transition: all 0.2s ease;
}

.card-template:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.selected-card {
  border: 2px solid rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>
