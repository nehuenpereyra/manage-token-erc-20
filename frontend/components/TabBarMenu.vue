<template>
  <div>
    <v-tabs
      v-model="tabs"
      color="primary"
      grow
    >
      <v-tab
        :value="1"
      >
        <Icon
          :width="30"
          icon="ic:baseline-currency-exchange"
        />
      </v-tab>

      <v-tab
        :value="2"
      >
        <Icon
          :width="30"
          icon="ph:arrows-left-right-bold"
        />
      </v-tab>

      <v-tab
        :value="3"
      >
        <Icon
          :width="30"
          icon="eos-icons:admin-outlined"
        />
      </v-tab>
    </v-tabs>
    <v-window v-model="tabs">
      <v-window-item :value="1">
        <v-card min-height="300">
          <v-card-text>
            <TokenStatus
              :currency="{
                ...currencyStore.currency,
                total: 30
              }"
              :token="{
                ...currencyStore.token,
                tokenAvailable: controller.state.balanceTokensSC || 0,
                totalSupply: 10000
              }"
            />
            <ConvertTokensForm
              :transfer-tokens="()=>{}"
              :currency="{
                ...currencyStore.currency,
                totalAmount: 2000
              }"
              :token="{
                ...currencyStore.token,
                totalAmount: controller.state.balance || 0
              }"
              :buy-tokens="controller.buyTokens"
              :repay-tokens="controller.repayTokens"
              :max-circulation="controller.state.balanceTokensSC || 0"
            />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item :value="2">
        <v-card
          min-height="300"
        >
          <v-card-text class="mt-8">
            <TransferForm
              :token-symbol="currencyStore.token.symbol"
              :transfer-tokens="()=>{}"
              :total-amount="controller.state.balence || 0"
            />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item :value="3">
        <v-card min-height="300">
          <v-card-text>
            <TokenStatus
              :admin="true"
              :currency="{
                ...currencyStore.currency,
                total: 30
              }"
              :token="{
                ...currencyStore.token,
                tokenAvailable: controller.state.balanceTokensSC || 0,
                totalSupply: 10000
              }"
            />
            <AdminForm
              :token-symbol="currencyStore.token.symbol"
              :total-circulation="controller.state.balanceTokensSC || 0"
              :mint-tokens="()=>{}"
              :burn-tokens="()=>{}"
            />
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </div>
</template>
        
<script setup lang="ts">
import { useCurrencyStore } from '../store/currency';
import { Icon } from '@iconify/vue';

defineProps({
  controller: {
    type: Object,
    required: true
  }
});


const tabs = ref(null) 

const currencyStore = useCurrencyStore();


</script>