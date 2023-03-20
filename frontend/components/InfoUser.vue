<template>
  <div>
    <v-row class="mb-2 mb-sm-0">
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          :value="account"
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
          v-for="(item, index) in items"
          :key="index"
          class="d-flex align-center pl-2"
        >
          <div class="font-weight-bold pr-2">
            {{ item.total.toFixed(2) }}
          </div>
          <IconToken
            v-bind="item.attrs"
          />
        </div>
      </v-col>
    </v-row>
  </div>
</template>
          
<script setup lang="ts">
import type { PropType } from 'vue'
import { Icon } from '@iconify/vue';

type Money = {
  total: number
  img?: string
  icon?: string
}

const props = defineProps({
  account: {
    type: String,
    required: true
  },
  currency: {
    type: Object as PropType<Money>,
    required: true
  },
  token: {
    type: Object as PropType<Money>,
    required: true
  }
});

const items = computed(() => {
  return [props.token, props.currency].map(token => {
    if(token.img)
      return {
        total: token.total,
        attrs: {
          width: 30,
          src: token.img,
          img: true,
          class: 'pb-2'
        }
      }
    return {
      total: token.total,
      attrs: {
        width: 30,
        icon: token.icon
      }
      
    }
  })
})

</script>