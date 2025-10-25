import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Card Template Interface
 * Defines the structure of available card templates
 */
export interface CardTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  defaultWidth?: number;
  defaultHeight?: number;
  preview?: string;
}

/**
 * Card Catalog Store
 *
 * This store manages available card templates that can be added to dashboards.
 * In production, applications will register their own card templates here.
 * The demo templates shown here are just examples.
 */
export const useCardCatalogStore = defineStore('cardCatalog', () => {
  // Available card templates
  const templates = ref<CardTemplate[]>([]);

  /**
   * Register a card template
   * Applications should call this to add their custom card types
   */
  function registerTemplate(template: CardTemplate) {
    // Check if template already exists
    const existingIndex = templates.value.findIndex(t => t.id === template.id);
    if (existingIndex !== -1) {
      // Update existing template
      templates.value[existingIndex] = template;
    } else {
      // Add new template
      templates.value.push(template);
    }
  }

  /**
   * Register multiple templates at once
   */
  function registerTemplates(newTemplates: CardTemplate[]) {
    newTemplates.forEach(template => registerTemplate(template));
  }

  /**
   * Remove a template by ID
   */
  function unregisterTemplate(templateId: string) {
    const index = templates.value.findIndex(t => t.id === templateId);
    if (index !== -1) {
      templates.value.splice(index, 1);
    }
  }

  /**
   * Get template by ID
   */
  function getTemplate(templateId: string): CardTemplate | undefined {
    return templates.value.find(t => t.id === templateId);
  }

  /**
   * Get templates by category
   */
  function getTemplatesByCategory(category: string): CardTemplate[] {
    return templates.value.filter(t => t.category === category);
  }

  /**
   * Clear all templates
   */
  function clearTemplates() {
    templates.value = [];
  }

  /**
   * Get all unique categories
   */
  function getCategories(): string[] {
    const categories = new Set(templates.value.map(t => t.category));
    return Array.from(categories);
  }

  return {
    templates,
    registerTemplate,
    registerTemplates,
    unregisterTemplate,
    getTemplate,
    getTemplatesByCategory,
    clearTemplates,
    getCategories
  };
});

/**
 * Demo Card Templates
 * These are example templates for demonstration purposes.
 * Real applications will provide their own templates.
 */
export const DEMO_CARD_TEMPLATES: CardTemplate[] = [
  {
    id: 'chart-card',
    type: 'chart',
    name: 'Chart Card',
    description: 'Display data visualizations and charts',
    icon: 'mdi-chart-line',
    category: 'Data Visualization',
    defaultWidth: 400
  },
  {
    id: 'stats-card',
    type: 'stats',
    name: 'Statistics Card',
    description: 'Show key metrics and statistics',
    icon: 'mdi-chart-box',
    category: 'Data Visualization',
    defaultWidth: 350
  },
  {
    id: 'list-card',
    type: 'list',
    name: 'List Card',
    description: 'Display items in a list format',
    icon: 'mdi-format-list-bulleted',
    category: 'Content',
    defaultWidth: 300
  },
  {
    id: 'text-card',
    type: 'text',
    name: 'Text Card',
    description: 'Rich text content and notes',
    icon: 'mdi-text-box',
    category: 'Content',
    defaultWidth: 350
  },
  {
    id: 'form-card',
    type: 'form',
    name: 'Form Card',
    description: 'Interactive forms and inputs',
    icon: 'mdi-form-select',
    category: 'Interactive',
    defaultWidth: 380
  },
  {
    id: 'default-card',
    type: 'default',
    name: 'Default Card',
    description: 'Basic empty card template',
    icon: 'mdi-card-outline',
    category: 'Basic',
    defaultWidth: 300
  }
];
