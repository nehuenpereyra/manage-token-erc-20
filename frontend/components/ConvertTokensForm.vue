<template>
  <v-container>
    <v-form
      v-model="valid"
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
            label="ET"
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
          1000 AT
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
            ET
          </div>
          <Icon
            :width="20"
            icon="cryptocurrency-color:matic"
          />
        </v-btn>
        <v-btn
          icon="mdi-cached"
          color="primary"
        />  
        <v-btn
          color="background"
          class="rounded-xl"
          :ripple="false"
          style="pointer-events: none"
        >
          <div class="pr-2">
            AT
          </div>
          <Icon
            :width="20"
            icon="cryptocurrency-color:matic"
          />
        </v-btn>
      </v-row>
    </v-form>
    <v-btn
      @click="() =>{}"
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
import { Icon } from '@iconify/vue';
const props = defineProps({
  tokenSymbol: {
    type: String,
    required: true
  },
  transferTokens: {
    type: Function,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  }
});
  
const amount = ref('0')
const valid = ref(false)
  
const amountRules = [
  (value: any) => {
    if (value > 0) {
      if(value > props.totalAmount)
        return 'Amount exceeds balance.'
      return true
    }
    return 'You have to send an amount.'
  }
]

function convertRules (){
  const amountInt = parseInt(amount.value)
  if(amountInt > props.totalAmount || amountInt <= 0 || amount.value === '')
    return true
  return false
}

function setMax (){
  amount.value =  (props.totalAmount).toString()
}

  
</script>

<style scope>

.centered-input input {
    text-align: center;
}
</style>