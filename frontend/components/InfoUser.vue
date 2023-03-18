<template>
  <div>
    <v-row class="mb-2 mb-sm-0">
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          v-model="account"
          @keypress.prevent
          hide-details
          class="pr-3"
        >
          <template #prepend>
            <div class="pl-2 pl-sm-4">
              <Icon
                :width="30"
                icon="mdi:user"
                color="orange"
              />
            </div>
          </template>
        </v-text-field>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        class="d-flex justify-center justify-sm-end align-center pb-4 pr-6"
      >
        <div
          v-for="(token, index) in tokens"
          :key="index"
          class="d-flex align-center pl-2"
        >
          <div class="font-weight-bold pr-2">
            {{ token.total }}
          </div>
          <Icon
            :width="30"
            icon="cryptocurrency-color:matic"
          />
        </div>
      </v-col>
    </v-row>
  </div>
</template>
          
<script setup lang="ts">
import { Icon } from '@iconify/vue';
const account = ref('0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f')

const tokens = [
  {
    icon: 'cryptocurrency-color:matic',
    total: 500000
  },
  {
    icon: 'cryptocurrency-color:matic',
    total: 500000
  }
]
</script>