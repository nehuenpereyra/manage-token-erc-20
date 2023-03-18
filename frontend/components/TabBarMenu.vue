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
            <ConvertTokensForm
              v-if="true"
              :token-symbol="'AT'"
              :transfer-tokens="()=>{}"
              :total-amount="1000"
            />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item :value="2">
        <v-card min-height="300">
          <v-card-text>
            <TransferForm
              v-if="true"
              :token-symbol="'AT'"
              :transfer-tokens="()=>{}"
              :total-amount="1000"
            />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item :value="3">
        <v-card min-height="300">
          <v-card-text>
            3
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </div>
</template>
        
<script setup lang="ts">
import { Icon } from '@iconify/vue';
const tabs = ref(null) 
const test = ref('0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f') 
</script>