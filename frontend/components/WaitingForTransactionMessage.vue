<template>
  <v-row>
    <v-alert
      variant="outlined"
      type="info"
      prominent
      class="my-4"
    >
      Waiting for transaction {{ txHash }} to be mined
    </v-alert>
  </v-row>
</template>

<script setup lang="ts">
defineProps({
  txHash: {
    type: String,
    required: true
  }
});
</script>