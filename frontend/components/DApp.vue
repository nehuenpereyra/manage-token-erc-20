<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="800"
    >
      <v-card-item>
        <NoWalletDetected v-if="etherController.disabledEthereum()" />
        <template v-if="!etherController.disabledEthereum()">
          <ConnectWallet 
            v-if="etherController.state.selectedAddress===undefined"
            :connect-wallet="etherController.connectWallet"
          />
          <HomeComponent
            v-if="etherController.state.selectedAddress!==undefined"
            :ether-controller="etherController"
          />
        </template>
      </v-card-item>
    </v-card>
    <SnackBarError
      :message="etherController.state.transactionError || ''"
    />
    <v-row
      justify="center"
      align="center"
      class="mt-4"
    >
      <dev>
        2023 - 
        Developed by <a
          style="text-decoration: none;"
          href="https://pereyranehuen.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nehuen Pereyra
        </a>
        <v-btn
          icon
          size="20"
          class="rounded-0 mb-1"
          href="https://www.linkedin.com/in/nehuen-pereyra-014b24160/"
          target="_blank"
          color="white"
        >
          <v-icon
            
            size="30"
            color="blue-darken-1"
            icon="mdi-linkedin"
            class="pb-2"
          />
        </v-btn>
      </dev>
    </v-row>
  </div>
</template>
    
<script setup lang="ts">
import { EtherController } from '~~/composables/EtherController'
import { reactive } from 'vue';

const etherController = new EtherController(reactive)

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