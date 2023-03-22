<template>
  <v-container>
    <v-form
      v-model="validForm"
      class="pb-4"
    >
      <v-row justify="center">
        <div style="max-width: 300px;">
          <v-text-field
            v-model="amount"
            :rules="amountRules"
            type="number"
            variant="underlined"
            required
            :label="sellToken.symbol"
            class="centered-input font-weight-bold centered-input-label"
          >
            <template #append>
              <div
                class="d-flex text-red font-weight-bold"
                style="cursor: pointer;"
                @click="setMax"
              >
                Max
              </div>
            </template>
          </v-text-field>
        </div>
      </v-row>
      <v-row
        justify="center"
      >
        <div class="text-h4 font-weight-bold">
          {{ convertion }} {{ buyToken.symbol }}
        </div>
      </v-row>
      <v-row
        justify="space-between"
        class="mx-sm-8 pt-4 pb-2"
      >
        <v-btn
          color="background"
          class="rounded-xl"
          :ripple="false"
          style="pointer-events: none"
        >
          <div class="pr-2">
            {{ sellToken.symbol }}
          </div>
          <IconToken
            v-bind="sellToken.attrs"
          />
        </v-btn>
        <v-btn
          icon="mdi-cached"
          color="primary"
          @click="changeMode"
        />  
        <v-btn
          color="background"
          class="rounded-xl"
          :ripple="false"
          style="pointer-events: none"
        >
          <div class="pr-2">
            {{ buyToken.symbol }}
          </div>
          <IconToken
            v-bind="buyToken.attrs"
          />
        </v-btn>
      </v-row>
    </v-form>
    <v-btn
      @click="convertTokens"
      block
      class="mt-2"
      color="primary"
      :disabled="convertRules()"
      :loading="loading"
    >
      Convert
    </v-btn>
  </v-container>
</template>
  
<script setup lang="ts">
import type { PropType } from 'vue'

type Money = {
  img?: string
  icon?: string
  symbol: string
  totalAmount: number
}

const props = defineProps({
  buyTokens: {
    type: Function,
    required: true
  },
  repayTokens: {
    type: Function,
    required: true
  },
  currency: {
    type: Object as PropType<Money>,
    required: true
  },
  token: {
    type: Object as PropType<Money>,
    required: true
  },
  maxCirculation: {
    type: Number,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  }
});
  
const amount = ref('0')
const purchaseMode = ref(true)
const validForm = ref(false)
const PRICE = 0.01

const tokenAttrs = (token: Money) => {
  if(token.img)
    return {
      width: 20,
      src: token.img,
      img: true
    }
  return {
    width: 20,
    icon: token.icon
  }
}

const amountRules = [
  (value: string) => {
    const valueInt: number = parseFloat(value)
    if(valueInt === 0 || value === '')
      return true
    if (valueInt > 0) {
      if(valueInt > sellToken.value.totalAmount)
        return 'Amount exceeds balance'
      if(purchaseMode.value && valueInt > props.maxCirculation*PRICE)
        return 'Amount exceeds circulation tokens'
      return true
    }
    return 'You have to send an amount'
  }
]

const convertRules = () => {
  const amountInt = parseInt(amount.value)
  if(amountInt > sellToken.value.totalAmount || !validForm.value || 
  amount.value === '' || amount.value === '0' )
    return true
  return false
}

const setMax = () => {
  if(purchaseMode.value){
    if(sellToken.value.totalAmount >= props.maxCirculation*PRICE)
      amount.value = (props.maxCirculation*PRICE).toString()
  }
  else
    amount.value =  (props.token.totalAmount).toString()
}

const convertTokens = () => {
  if(purchaseMode.value)
    props.buyTokens(parseFloat(amount.value))
  else 
    props.repayTokens(parseFloat(amount.value))
  
  amount.value = '0'   
}

const convertion = computed(() => {
  const amountInt = amount.value === '' ? 0 : parseFloat(amount.value)
  if(purchaseMode.value)
    return (amountInt / PRICE).toFixed(2)
  else 
    return (amountInt * PRICE).toFixed(2)
})

const changeMode = () => {
  purchaseMode.value = !purchaseMode.value
  amount.value = '0'
}

const sellToken = computed(() => {
  if(purchaseMode.value)
    return {
      ...props.currency,
      attrs: tokenAttrs(props.currency)
    }
  else 
    return {
      ...props.token,
      attrs: tokenAttrs(props.token)
    }
})

const buyToken = computed(() => {
  if(purchaseMode.value)
    return {
      ...props.token,
      attrs: tokenAttrs(props.token)
    }
  else 
    return {
      ...props.currency,
      attrs: tokenAttrs(props.currency)
    }
})

  
</script>

<style scope>

.centered-input input {
    text-align: center;
}

.centered-input-label.v-text-field--flush-details .v-input__details {
  text-align: center;
}
</style>