<template>
  <v-container>
    <div class="text-h6 font-weight-bold">
      {{ tokenData.name }} - {{ tokenData.symbol }}
    </div>
    <div>
      Welcome <b>{{ selectedAddress }}</b>, you have <b>{{ balance }} {{ tokenData.symbol }}</b>.
    </div>
    <v-divider class="my-4" />
    <WaitingForTransactionMessage 
      v-if="txBeingSent!==''"
      :tx-hash="txBeingSent"
    />
    <TransactionErrorMessage
      v-if="transactionError.data && transactionError.data.message!==''"
      :message="transactionError.data.message"
      :dismiss="dismissTransactionError"
    />
    <NoTokensMessage
      v-if="balance === 0"
      :selected-address="selectedAddress"
    />
    <TransferForm
      v-if="balance > 0"
      :token-symbol="tokenData.symbol"
      :transfer-tokens="transferTokens"
    />
  </v-container>
</template>

<script setup lang="ts">

defineProps({
  tokenData: {
    type: Object,
    required: true
  },
  selectedAddress: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  txBeingSent: {
    type: String,
    required: true
  },
  transactionError: {
    type: Object,
    required: true
  },
  dismissTransactionError: {
    type: Function,
    required: true
  },
  transferTokens: {
    type: Function,
    required: true
  }
});
</script>