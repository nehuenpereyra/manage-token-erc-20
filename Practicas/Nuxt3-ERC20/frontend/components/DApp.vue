<template>
  <div>
    <AllComponents v-if="false" />
    <div
      v-else
      class="d-flex align-center flex-column"
    >
      <v-card
        class="mx-auto"
        max-width="800"
      >
        <v-card-item>
          <NoWalletDetected v-if="ethers.disabledEthereum()" />
          <template v-if="!ethers.disabledEthereum()">
            <ConnectWallet 
              v-if="ethers.state.selectedAddress===undefined"
              :network-error="ethers.state.networkError|| ''"
              :dismiss="ethers.dismissNetworkError"
              :connect-wallet="ethers.connectWallet"
            />
            <DDetail
              v-if="ethers.state.selectedAddress!==undefined"
              :token-data="ethers.state.tokenData || {
                name: '',
                symbol: ''
              }"
              :selected-address="ethers.state.selectedAddress || ''"
              :balance="ethers.state.balance || 0"
              :tx-being-sent="ethers.state.txBeingSent || ''"
              :transaction-error="ethers.state.transactionError || { }"
              :dismiss-transaction-error="ethers.dismissTransactionError"
              :transfer-tokens="ethers.transferTokens"
            />
            <!-- <DLoading v-if="ethers.isLoading()" /> -->
          </template>
        </v-card-item>
      </v-card>
    </div>
  </div>
</template>
    
<script setup lang="ts">
import { onUnmounted } from 'vue'
import {UseEthers} from '@/composables/useEthers'
let ethers = new UseEthers()


onUnmounted(() => ethers.stopPollingData())
</script>