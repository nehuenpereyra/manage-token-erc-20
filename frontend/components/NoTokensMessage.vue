<template>
  <v-row>
    <v-alert
      variant="outlined"
      type="warning"
      prominent
      class="my-4"
    >
      You don't have tokens to transfer in account {{ selectedAddress }}
    </v-alert>
  </v-row>
</template>
  
<script setup lang="ts">
defineProps({
  selectedAddress : {
    type: String,
    required: true
  }
});
</script>