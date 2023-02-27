<template>
  <div class="d-flex align-center flex-column">
    <v-card
      class="mx-auto"
      max-width="800"
    >
      <v-card-item>
        <NoWalletDetected />
        <NetworkErrorMessage
          :message="'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!'"
          :dismiss="()=>{}"
        />
        <ConnectWallet
          :network-error="''"
          :dismiss="()=>{}"
          :connect-wallet="()=>{}"
        />
        <DLoading />
        <WaitingForTransactionMessage
          :tx-hash="'0x6666666666666666666'"
        />
        <NoTokensMessage
          :selected-address="'0x6666666666666666666'"
        />
        <TransactionErrorMessage
          :message="'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!'"
          :dismiss="()=>{}"
        />
        <TransferForm
          :token-symbol="'AS'"
          :transfer-tokens="transferTokens"
          :total-amount="200"
        />
        <DDetail 
          :token-data="{
            name:'Asian Token',
            symbol:'AT'
          }"
          :selected-address="'0x7777777777'"
          :balance="0"
          :tx-being-sent="'0x6666'"
          :transaction-error="'Error loco'"
          :dismiss-transaction-error="()=>{}"
          :transfer-tokens="()=>{}"
        />
      </v-card-item>
    </v-card>
  </div>
</template>
      
<script setup lang="ts">
import type { Ref } from 'vue'
  
function transferTokens(address: Ref<string>, amount: Ref<number>) {
  console.log('Send:', address.value, amount.value)
}
</script>