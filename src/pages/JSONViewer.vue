<template>
  <v-container fluid class="pa-0">
    <!-- Header -->
    <v-app-bar color="purple" elevation="2">
      <v-app-bar-title>JSON Data Viewer</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="refreshData">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn icon @click="copyAllToClipboard">
        <v-icon>mdi-content-copy</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container class="py-6">
      <!-- Dashboard Comparison Stats -->
      <v-row class="mb-4">
        <v-col cols="12" md="4">
          <v-card color="primary" variant="tonal">
            <v-card-text>
              <div class="text-h6">Dashboard 1</div>
              <div class="text-h4">{{ dashboard1.totalCards.value }}</div>
              <div class="text-caption">Total Cards</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="secondary" variant="tonal">
            <v-card-text>
              <div class="text-h6">Dashboard 2</div>
              <div class="text-h4">{{ dashboard2.totalCards.value }}</div>
              <div class="text-caption">Total Cards</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="success" variant="tonal">
            <v-card-text>
              <div class="text-h6">Total</div>
              <div class="text-h4">{{ dashboard1.totalCards.value + dashboard2.totalCards.value }}</div>
              <div class="text-caption">All Cards Combined</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Dashboard 1 JSON -->
      <v-row>
        <v-col cols="12" lg="6">
          <v-card elevation="2">
            <v-card-title class="bg-primary">
              <v-icon class="mr-2">mdi-view-dashboard</v-icon>
              Dashboard 1 - Main Workspace
              <v-spacer></v-spacer>
              <v-btn
                icon
                size="small"
                variant="text"
                @click="copyToClipboard(dashboard1Data, 'Dashboard 1')"
              >
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
              <v-btn
                icon
                size="small"
                variant="text"
                @click="downloadJSON(dashboard1Data, 'dashboard1.json')"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div class="mb-3">
                <strong>localStorage Key:</strong>
                <code class="ml-2">vue3-moveable-dashboard-dashboard-1</code>
              </div>
              <div class="mb-3">
                <strong>Card IDs:</strong>
                <v-chip
                  v-for="card in dashboard1.cards.value"
                  :key="card.id"
                  size="small"
                  class="ma-1"
                  color="primary"
                >
                  {{ card.id }}
                </v-chip>
              </div>
              <v-divider class="mb-3"></v-divider>
              <pre class="json-viewer">{{ dashboard1Data }}</pre>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Dashboard 2 JSON -->
        <v-col cols="12" lg="6">
          <v-card elevation="2">
            <v-card-title class="bg-secondary">
              <v-icon class="mr-2">mdi-chart-line</v-icon>
              Dashboard 2 - Analytics Workspace
              <v-spacer></v-spacer>
              <v-btn
                icon
                size="small"
                variant="text"
                @click="copyToClipboard(dashboard2Data, 'Dashboard 2')"
              >
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
              <v-btn
                icon
                size="small"
                variant="text"
                @click="downloadJSON(dashboard2Data, 'dashboard2.json')"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div class="mb-3">
                <strong>localStorage Key:</strong>
                <code class="ml-2">vue3-moveable-dashboard-dashboard-2</code>
              </div>
              <div class="mb-3">
                <strong>Card IDs:</strong>
                <v-chip
                  v-for="card in dashboard2.cards.value"
                  :key="card.id"
                  size="small"
                  class="ma-1"
                  color="secondary"
                >
                  {{ card.id }}
                </v-chip>
              </div>
              <v-divider class="mb-3"></v-divider>
              <pre class="json-viewer">{{ dashboard2Data }}</pre>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- localStorage Raw Data -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon class="mr-2">mdi-database</v-icon>
                Raw localStorage Data
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <h4 class="mb-2">Dashboard 1 (localStorage)</h4>
                    <pre class="json-viewer small">{{ localStorageData.dashboard1 }}</pre>
                  </v-col>
                  <v-col cols="12" md="6">
                    <h4 class="mb-2">Dashboard 2 (localStorage)</h4>
                    <pre class="json-viewer small">{{ localStorageData.dashboard2 }}</pre>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <!-- Import/Export Section -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-title>
              <v-icon class="mr-2">mdi-swap-horizontal</v-icon>
              Import / Export Dashboards
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <h4 class="mb-2">Import to Dashboard 1</h4>
                  <v-textarea
                    v-model="importData1"
                    label="Paste JSON here"
                    rows="5"
                    variant="outlined"
                  ></v-textarea>
                  <v-btn
                    color="primary"
                    @click="importToDashboard1"
                    block
                  >
                    Import to Dashboard 1
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <h4 class="mb-2">Import to Dashboard 2</h4>
                  <v-textarea
                    v-model="importData2"
                    label="Paste JSON here"
                    rows="5"
                    variant="outlined"
                  ></v-textarea>
                  <v-btn
                    color="secondary"
                    @click="importToDashboard2"
                    block
                  >
                    Import to Dashboard 2
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- API Testing Section -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-title>
              <v-icon class="mr-2">mdi-code-braces</v-icon>
              Dashboard API Testing
            </v-card-title>
            <v-card-text>
              <v-alert type="info" variant="tonal" class="mb-4">
                Open browser console to access the dashboard APIs:
                <ul class="mt-2">
                  <li><code>dashboard1.debug()</code> - View Dashboard 1 state</li>
                  <li><code>dashboard2.debug()</code> - View Dashboard 2 state</li>
                  <li><code>dashboard1.addCard({...})</code> - Add card to Dashboard 1</li>
                  <li><code>dashboard2.cards.value</code> - Get all Dashboard 2 cards</li>
                </ul>
              </v-alert>

              <v-row>
                <v-col cols="12" md="6">
                  <v-btn
                    color="primary"
                    variant="outlined"
                    block
                    @click="testAddCardDashboard1"
                  >
                    Test: Add Card to Dashboard 1
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn
                    color="secondary"
                    variant="outlined"
                    block
                    @click="testAddCardDashboard2"
                  >
                    Test: Add Card to Dashboard 2
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDashboardAPI } from '../composables/useDashboardAPI';

// Get both dashboard instances
const dashboard1 = useDashboardAPI('dashboard-1');
const dashboard2 = useDashboardAPI('dashboard-2');

// Import data
const importData1 = ref('');
const importData2 = ref('');

// Snackbar
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

// Computed JSON data
const dashboard1Data = computed(() => {
  return JSON.stringify({
    cards: dashboard1.cards.value,
    editMode: dashboard1.editMode.value,
    totalCards: dashboard1.totalCards.value,
    selectedCardId: dashboard1.selectedCardId.value
  }, null, 2);
});

const dashboard2Data = computed(() => {
  return JSON.stringify({
    cards: dashboard2.cards.value,
    editMode: dashboard2.editMode.value,
    totalCards: dashboard2.totalCards.value,
    selectedCardId: dashboard2.selectedCardId.value
  }, null, 2);
});

// localStorage data
const localStorageData = ref({
  dashboard1: '',
  dashboard2: ''
});

function refreshData() {
  loadLocalStorageData();
  showSnackbar('Data refreshed!', 'success');
}

function loadLocalStorageData() {
  const dash1Key = 'vue3-moveable-dashboard-dashboard-1';
  const dash2Key = 'vue3-moveable-dashboard-dashboard-2';

  const dash1Data = localStorage.getItem(dash1Key);
  const dash2Data = localStorage.getItem(dash2Key);

  localStorageData.value.dashboard1 = dash1Data ? JSON.stringify(JSON.parse(dash1Data), null, 2) : 'No data';
  localStorageData.value.dashboard2 = dash2Data ? JSON.stringify(JSON.parse(dash2Data), null, 2) : 'No data';
}

async function copyToClipboard(data: string, name: string) {
  try {
    await navigator.clipboard.writeText(data);
    showSnackbar(`${name} data copied to clipboard!`, 'success');
  } catch (err) {
    showSnackbar('Failed to copy to clipboard', 'error');
  }
}

async function copyAllToClipboard() {
  const combinedData = JSON.stringify({
    dashboard1: JSON.parse(dashboard1Data.value),
    dashboard2: JSON.parse(dashboard2Data.value)
  }, null, 2);

  try {
    await navigator.clipboard.writeText(combinedData);
    showSnackbar('All dashboard data copied to clipboard!', 'success');
  } catch (err) {
    showSnackbar('Failed to copy to clipboard', 'error');
  }
}

function downloadJSON(data: string, filename: string) {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showSnackbar(`Downloaded ${filename}`, 'success');
}

function importToDashboard1() {
  try {
    const success = dashboard1.import(importData1.value);
    if (success) {
      showSnackbar('Successfully imported to Dashboard 1!', 'success');
      importData1.value = '';
    } else {
      showSnackbar('Invalid JSON format', 'error');
    }
  } catch (err) {
    showSnackbar('Failed to import data', 'error');
  }
}

function importToDashboard2() {
  try {
    const success = dashboard2.import(importData2.value);
    if (success) {
      showSnackbar('Successfully imported to Dashboard 2!', 'success');
      importData2.value = '';
    } else {
      showSnackbar('Invalid JSON format', 'error');
    }
  } catch (err) {
    showSnackbar('Failed to import data', 'error');
  }
}

function testAddCardDashboard1() {
  dashboard1.addCard({
    type: 'text',
    header: 'Test Card from Viewer',
    x: 50,
    y: 50,
    width: 300
  });
  showSnackbar('Added test card to Dashboard 1!', 'primary');
}

function testAddCardDashboard2() {
  dashboard2.addCard({
    type: 'chart',
    header: 'Test Chart from Viewer',
    x: 50,
    y: 50,
    width: 350
  });
  showSnackbar('Added test card to Dashboard 2!', 'secondary');
}

function showSnackbar(text: string, color: string) {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
}

onMounted(() => {
  loadLocalStorageData();

  // Make APIs available in console
  if (typeof window !== 'undefined') {
    (window as any).dashboard1 = dashboard1;
    (window as any).dashboard2 = dashboard2;
    console.log('Dashboard APIs available:');
    console.log('- window.dashboard1');
    console.log('- window.dashboard2');
  }
});
</script>

<style scoped>
.json-viewer {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #ddd;
}

.json-viewer.small {
  max-height: 300px;
  font-size: 11px;
}

code {
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}
</style>
