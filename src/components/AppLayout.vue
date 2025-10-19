<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      :rail="rail"
      @click="rail = false"
    >
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Vue3 Moveable"
        subtitle="Dashboard Demo"
        @click="rail = !rail"
      >
        <template v-slot:append>
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard 1"
          subtitle="Main Workspace"
          value="dashboard1"
          :active="currentRoute === 'Dashboard1'"
          @click="navigateTo('/dashboard1')"
          color="primary"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-chart-line"
          title="Dashboard 2"
          subtitle="Analytics"
          value="dashboard2"
          :active="currentRoute === 'Dashboard2'"
          @click="navigateTo('/dashboard2')"
          color="secondary"
        ></v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list-item
          prepend-icon="mdi-code-json"
          title="JSON Viewer"
          subtitle="View Data"
          value="json"
          :active="currentRoute === 'JSONViewer'"
          @click="navigateTo('/json')"
          color="purple"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-divider class="mb-2"></v-divider>
          <v-list-item
            v-if="!rail"
            density="compact"
            class="text-caption"
          >
            <v-list-item-title class="text-caption">
              Dashboard Stats
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              D1: {{ dashboard1Cards }} | D2: {{ dashboard2Cards }}
            </v-list-item-subtitle>
          </v-list-item>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar elevation="2" color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>
        <v-icon class="mr-2">{{ currentIcon }}</v-icon>
        {{ currentTitle }}
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Quick Nav Tabs -->
      <v-tabs
        v-model="currentTab"
        class="d-none d-md-flex"
        color="white"
      >
        <v-tab value="dashboard1" @click="navigateTo('/dashboard1')">
          <v-icon class="mr-2">mdi-view-dashboard</v-icon>
          Dashboard 1
        </v-tab>
        <v-tab value="dashboard2" @click="navigateTo('/dashboard2')">
          <v-icon class="mr-2">mdi-chart-line</v-icon>
          Dashboard 2
        </v-tab>
        <v-tab value="json" @click="navigateTo('/json')">
          <v-icon class="mr-2">mdi-code-json</v-icon>
          JSON
        </v-tab>
      </v-tabs>

      <v-spacer></v-spacer>

      <!-- Info Badge -->
      <v-chip
        v-if="totalCards > 0"
        color="white"
        variant="outlined"
        size="small"
        class="mr-2"
      >
        <v-icon start>mdi-cards</v-icon>
        {{ totalCards }} Cards Total
      </v-chip>

      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="main-content">
      <router-view></router-view>
    </v-main>

    <!-- Footer -->
    <v-footer app class="bg-grey-lighten-3">
      <v-row align="center" no-gutters>
        <v-col cols="12" md="4" class="text-center text-md-left">
          <span class="text-caption">
            Vue3 Moveable Dashboard Demo
          </span>
        </v-col>
        <v-col cols="12" md="4" class="text-center">
          <v-chip size="x-small" color="success" variant="outlined" class="mx-1">
            Dashboard 1: {{ dashboard1Cards }}
          </v-chip>
          <v-chip size="x-small" color="warning" variant="outlined" class="mx-1">
            Dashboard 2: {{ dashboard2Cards }}
          </v-chip>
        </v-col>
        <v-col cols="12" md="4" class="text-center text-md-right">
          <span class="text-caption">
            Powered by Pinia + localStorage
          </span>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTheme } from 'vuetify';
import { useDashboardAPI } from '../composables/useDashboardAPI';

const router = useRouter();
const route = useRoute();
const theme = useTheme();

const drawer = ref(true);
const rail = ref(false);

// Get dashboard instances for stats
const dashboard1 = useDashboardAPI('dashboard-1');
const dashboard2 = useDashboardAPI('dashboard-2');

const dashboard1Cards = computed(() => dashboard1.totalCards.value);
const dashboard2Cards = computed(() => dashboard2.totalCards.value);
const totalCards = computed(() => dashboard1Cards.value + dashboard2Cards.value);

// Current route info
const currentRoute = computed(() => route.name as string);
const currentTab = ref('dashboard1');

// Update tab when route changes
watch(() => route.name, (newRoute) => {
  if (newRoute === 'Dashboard1') currentTab.value = 'dashboard1';
  else if (newRoute === 'Dashboard2') currentTab.value = 'dashboard2';
  else if (newRoute === 'JSONViewer') currentTab.value = 'json';
});

const currentTitle = computed(() => {
  switch (currentRoute.value) {
    case 'Dashboard1':
      return 'Dashboard 1 - Main Workspace';
    case 'Dashboard2':
      return 'Dashboard 2 - Analytics';
    case 'JSONViewer':
      return 'JSON Data Viewer';
    default:
      return 'Vue3 Moveable Dashboard';
  }
});

const currentIcon = computed(() => {
  switch (currentRoute.value) {
    case 'Dashboard1':
      return 'mdi-view-dashboard';
    case 'Dashboard2':
      return 'mdi-chart-line';
    case 'JSONViewer':
      return 'mdi-code-json';
    default:
      return 'mdi-view-dashboard';
  }
});

const isDark = computed(() => theme.global.current.value.dark);

function navigateTo(path: string) {
  router.push(path);
}

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}
</script>

<style scoped>
:deep(.v-navigation-drawer) {
  z-index: 1002;
}

.main-content {
  display: flex;
  flex-direction: column;
}

.main-content :deep(.v-main__wrap) {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}
</style>
