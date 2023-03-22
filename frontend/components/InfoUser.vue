<template>
  <div>
    <v-row class="mb-2 mb-sm-0">
      <v-col
        cols="12"
        sm="6"
        class="d-flex align-center"
      >
        <v-tooltip
          :text="account"
          location="bottom"
          color="#E5E5E5"
        >
          <template #activator="{ props }">
            <v-chip
              v-bind="props"
              :href="appStore.urlScan+account"
              target="_blank"
              class="mb-2"
            >
              <Icon
                :width="30"
                icon="mdi:user"
                color="orange"
              />
              {{ account.slice(0,5) + '...' + account.slice(-3) }}
            </v-chip>
          </template>
        </v-tooltip>
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
import { useAppStore } from '../store/app';

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



const appStore = useAppStore();

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