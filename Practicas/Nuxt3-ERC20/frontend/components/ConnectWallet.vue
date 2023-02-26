<template>
  <v-container>
    <v-row v-if="networkError">
      <NetworkErrorMessage 
        :message="networkError" 
        :dismiss="dismiss" 
      />
    </v-row>
    <div class="text-center my-2">
      <div class="mb-2">
        Please connect to your wallet.
      </div>
      <v-btn
        variant="flat"
        color="green"
        @click="connectWallet"
      >
        Connect Wallet
      </v-btn>
    </div>
  </v-container>
</template>
      
<script setup lang="ts">
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