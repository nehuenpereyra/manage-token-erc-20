<template>
  <v-container>
    <v-row>
      <v-alert
        variant="outlined"
        type="error"
        prominent
        class="my-4"
      >
        Error sending transaction: {{ message.substring(0, 400) }}{{ message.length >= 400 ? '...': '.' }}
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