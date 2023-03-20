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
            class="centered-input font-weight-bold"
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
  }
});
  
const amount = ref('0')
const purchaseMode = ref(true)
const validForm = ref(false)
const PRICE = 0.2

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

const sellToken = ref({
  ...props.currency,
  attrs: tokenAttrs(props.currency)
})

const buyToken = ref({
  ...props.token,
  attrs: tokenAttrs(props.token)
})
  
const amountRules = [
  (value: any) => {
    if (value > 0) {
      if(value > sellToken.value.totalAmount)
        return 'Amount exceeds balance'
      if(purchaseMode.value && value > props.maxCirculation*PRICE)
        return 'Amount exceeds circulation tokens'
      return true
    }
    return 'You have to send an amount'
  }
]

function convertRules (){
  const amountInt = parseInt(amount.value)
  if(amountInt > sellToken.value.totalAmount || !validForm.value || 
  amount.value === '' )
    return true
  return false
}

function setMax (){
  if(purchaseMode.value){
    if(sellToken.value.totalAmount >= props.maxCirculation*PRICE)
      amount.value = (props.maxCirculation*PRICE).toString()
  }
  else
    amount.value =  (sellToken.value.totalAmount).toString()
}

function convertTokens (){
  if(purchaseMode.value)
    props.buyTokens(parseFloat(amount.value))
  else 
    props.repayTokens(parseFloat(amount.value))
  
    
}

const convertion = computed(() => {
  const amountInt = amount.value === '' ? 0 : parseFloat(amount.value)
  if(purchaseMode.value)
    return (amountInt / PRICE).toFixed(2)
  else 
    return (amountInt * PRICE).toFixed(2)
})

function changeMode () {
  purchaseMode.value = !purchaseMode.value
  amount.value = '0'
  if(purchaseMode.value){
    sellToken.value = {
      ...props.currency,
      attrs: tokenAttrs(props.currency)
    }

    buyToken.value = {
      ...props.token,
      attrs: tokenAttrs(props.token)
    }
  } else {
    sellToken.value =   {
      ...props.token,
      attrs: tokenAttrs(props.token)
    }

    buyToken.value ={
      ...props.currency,
      attrs: tokenAttrs(props.currency)
    }

  }
}


  
</script>

<style scope>

.centered-input input {
    text-align: center;
}
</style>