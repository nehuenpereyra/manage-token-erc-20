<template>
  <InfoUser
    :account="etherController.state.selectedAddress || ''"
    :currency="{
      ...currencyStore.currency,
      total: etherController.state.balanceEthers || 0
    }"
    :token="{
      ...currencyStore.token,
      total: etherController.state.balance || 0
    }"
  />
  <TabBarMenu
    :controller="etherController"
    :is-owner="etherController.state.isOwner"
  />
</template>
  
<script setup lang="ts">
import { useCurrencyStore } from '../store/currency';
defineProps({
  etherController: {
    type: Object,
    required: true
  }
});


const currencyStore = useCurrencyStore();

</script>