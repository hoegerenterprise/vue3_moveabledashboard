<template>
  <v-card
    class="mx-auto"
    prepend-icon="$vuetify"
    subtitle="Your default component"
    width="400"
  >
    <template v-slot:title>
      <span class="font-weight-black">Hello RMC</span>
    </template>

    <v-card-text class="pt-4">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// No additional setup needed unless you're passing props or logic
</script>

<style scoped>
/* You can include styles here if needed, but Vuetify styling should be sufficient */
</style>

vue-