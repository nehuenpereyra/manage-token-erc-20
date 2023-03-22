<template>
  <v-container>
    <div class="text-center my-2">
      <v-btn
        variant="flat"
        color="primary"
        @click="connectWallet"
      >
        Connect Wallet
      </v-btn>
    </div>
  </v-container>
</template>
      
<script setup lang="ts">
// import { Icon } from '@iconify/vue';
defineProps({
  connectWallet:
  {
    type: Function,
    required: true
  }
}); 
</script>