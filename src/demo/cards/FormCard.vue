<template>
  <div class="form-card pa-4">
    <v-form @submit.prevent="handleSubmit">
      <v-text-field
        v-model="formData.name"
        label="Name"
        variant="outlined"
        density="compact"
        prepend-inner-icon="mdi-account"
        class="mb-2"
      ></v-text-field>

      <v-text-field
        v-model="formData.email"
        label="Email"
        type="email"
        variant="outlined"
        density="compact"
        prepend-inner-icon="mdi-email"
        class="mb-2"
      ></v-text-field>

      <v-select
        v-model="formData.priority"
        :items="priorityOptions"
        label="Priority"
        variant="outlined"
        density="compact"
        prepend-inner-icon="mdi-flag"
        class="mb-2"
      ></v-select>

      <v-textarea
        v-model="formData.message"
        label="Message"
        variant="outlined"
        density="compact"
        rows="3"
        prepend-inner-icon="mdi-message-text"
        class="mb-3"
      ></v-textarea>

      <v-row>
        <v-col cols="6">
          <v-btn
            type="submit"
            color="primary"
            block
            prepend-icon="mdi-send"
          >
            Submit
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn
            color="secondary"
            variant="outlined"
            block
            prepend-icon="mdi-refresh"
            @click="handleReset"
          >
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <!-- Display submitted data -->
    <v-divider class="my-4" v-if="submitted"></v-divider>
    <v-alert
      v-if="submitted"
      type="success"
      variant="tonal"
      density="compact"
      class="mt-3"
    >
      <div class="text-caption">
        <strong>Form Submitted!</strong><br>
        Name: {{ submittedData.name }}<br>
        Email: {{ submittedData.email }}<br>
        Priority: {{ submittedData.priority }}
      </div>
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue';
import { IDashboardCard } from '../../types';

defineProps({
  card: {
    type: Object as PropType<IDashboardCard>,
    required: true
  }
});

const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];

const formData = ref({
  name: '',
  email: '',
  priority: 'Medium',
  message: ''
});

const submittedData = ref({
  name: '',
  email: '',
  priority: '',
  message: ''
});

const submitted = ref(false);

function handleSubmit() {
  submittedData.value = { ...formData.value };
  submitted.value = true;
  console.log('Form submitted:', submittedData.value);

  // Hide the success message after 3 seconds
  setTimeout(() => {
    submitted.value = false;
  }, 3000);
}

function handleReset() {
  formData.value = {
    name: '',
    email: '',
    priority: 'Medium',
    message: ''
  };
  submitted.value = false;
  console.log('Form reset');
}
</script>

<style scoped>
.form-card {
  height: 100%;
  overflow-y: auto;
}
</style>
