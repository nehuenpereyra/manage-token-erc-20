<template>
  <div>
    <v-row
      class="mb-2 mb-sm-0 mt-2"
      :justify="(admin)?'center':'end'"
    >
      <div
      
        :class="`d-flex align-center pl-2 ${!admin?'pr-2':''}`"
      >
        <div class="font-weight-bold pr-2">
          Tokens available: {{ token.tokenAvailable }}
        </div>
        <IconToken v-bind="itemsAttrs[0]" />
      </div>
      <div
        v-if="admin"
        class="d-flex align-center pl-2"
      >
        <div class="font-weight-bold pr-2">
          Total supply: {{ token.totalSupply }}
        </div>
        <IconToken v-bind="itemsAttrs[0]" />
      </div>
      <div
        v-if="admin"
        class="d-flex align-center pl-2"
      >
        <div class="font-weight-bold pr-2">
          {{ currency.name }} avalibre in SC: {{ currency.total }}
        </div>
        <IconToken v-bind="itemsAttrs[1]" />
      </div>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

type Token = {
  img?: string;
  icon?: string;
  tokenAvailable: number;
  totalSupply: number;
};

type Currency = {
  img?: string;
  icon?: string;
  name: string;
  total: number;
};


const props = defineProps({
  token: {
    type: Object as PropType<Token>,
    required: true
  },
  currency: {
    type: Object as PropType<Currency>,
    required: false,
    default: () => {
      total: 0
    }
  },
  admin: {
    type: Boolean,
    required: false,
    default: false
  }
});

const itemsAttrs = computed(() => {
  return [props.token, props.currency].map((token) => {
    if (token.img)
      return {
        width: 30,
        src: token.img,
        img: true,
        class: 'pb-2'
      };
    return {
      width: 30,
      icon: token.icon
    };
  });
});
</script>
