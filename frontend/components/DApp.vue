<template>
  <div>
    <AllComponents v-if="false" />
    <div
      v-else
      class="d-flex align-center flex-column"
    >
      <v-card
        class="mx-auto"
        width="800"
      >
        <v-card-item>
          <NoWalletDetected v-if="etherController.disabledEthereum()" />
          <template v-if="!etherController.disabledEthereum()">
            <ConnectWallet 
              v-if="etherController.state.selectedAddress===undefined"
              :network-error="etherController.state.networkError|| ''"
              :dismiss="etherController.dismissNetworkError"
              :connect-wallet="etherController.connectWallet"
            />
            <!--
            <DDetail
              v-if="etherController.state.selectedAddress!==undefined"
              :token-data="etherController.state.tokenData || {
                name: '',
                symbol: ''
              }"
              :selected-address="etherController.state.selectedAddress || ''"
              :balance="etherController.state.balance || 0"
              :tx-being-sent="etherController.state.txBeingSent || ''"
              :transaction-error="etherController.getRpcErrorMessage(etherController.state.transactionError) || ''"
              :dismiss-transaction-error="etherController.dismissTransactionError"
              :transfer-tokens="etherController.transferTokens"
            />
             <DLoading v-if="ethers.isLoading()" /> -->
            <HomeComponent
              v-if="etherController.state.selectedAddress!==undefined"
              :ether-controller="etherController"
            />
          </template>
        </v-card-item>
      </v-card>
    </div>
  </div>
</template>
    
<script setup lang="ts">
import { onUnmounted } from 'vue'
import { EtherController } from '~~/composables/EtherController'

let etherController = new EtherController()
onUnmounted(() => etherController.stopPollingData())

</script>

<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>