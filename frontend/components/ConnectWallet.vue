<template>
  <v-container>
    <v-row v-if="networkError">
      <NetworkErrorMessage 
        :message="networkError" 
        :dismiss="dismiss" 
      />
    </v-row>
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
  networkError: {
    type: String,
    required: true
  },
  dismiss: {
    type: Function,
    required: true
  },
  connectWallet:
  {
    type: Function,
    required: true
  }
}); 
</script>