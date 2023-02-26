<template>
  <v-container>
    <v-row>
      <v-alert
        variant="outlined"
        type="error"
        prominent
        class="my-4"
      >
        {{ message }}
      </v-alert>
    </v-row>

    <v-row
      align="center"
      justify="center"
    >
      <v-btn
        variant="flat"
        color="error"
        @click="dismiss"
      >
        Close
      </v-btn>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
defineProps({
  message: {
    type: String,
    required: true
  },
  dismiss: {
    type: Function,
    required: true
  }
});
</script>
