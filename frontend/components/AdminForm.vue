<template>
  <v-container>
    <v-form v-model="mintValid">
      <v-text-field
        v-model="mintAmount"
        :rules="mintAmountRules"
        type="number"
        :label="`${tokenSymbol}`"
        required
      />
    </v-form>
    <v-btn
      @click="mint"
      block
      color="primary"
      :disabled="mintDisable()"
      :loading="mintLoading"
    >
      Mint
    </v-btn>
    <v-form
      v-model="burnValid"
      class="mt-2"
    >
      <v-text-field
        v-model="burnAmount"
        :rules="burnAmountRules"
        type="number"
        :label="`${tokenSymbol}`"
        required
      />
    </v-form>
    <v-btn
      @click="burn"
      block
      color="red"
      class="color-red-disabled"
      :disabled="burnDisable()"
      :loading="burnLoading"
    >
      Burn
    </v-btn>
  </v-container>
</template>
  
<script setup lang="ts">
  
const props = defineProps({
  tokenSymbol: {
    type: String,
    required: true
  },
  burnTokens: {
    type: Function,
    required: true
  },
  mintTokens: {
    type: Function,
    required: true
  },
  totalCirculation: {
    type: Number,
    required: true
  },
  mintLoading: {
    type: Boolean,
    required: true
  },
  burnLoading: {
    type: Boolean,
    required: true
  }
});
  
const mintAmount = ref('')
const burnAmount = ref('')
const mintValid = ref(false)
const burnValid = ref(false)
  

const mintAmountRules = [
  (value: string) => {
    const valueInt: number = parseFloat(value)
    if (valueInt >= 0) 
      return true
    return 'Mint a value greater than zero'
  }
]

const burnAmountRules = [
  (value: string) => {
    const valueInt: number = parseFloat(value)
    if (valueInt >= 0) {
      if(valueInt > props.totalCirculation)
        return 'The amount exceeds the value in circulation'
      return true
    }
    return 'Burn a value greater than zero'
  }
]

const mintDisable = () => {
  if(mintAmount.value === '' || parseInt(mintAmount.value) <= 0)
    return true
  return false
}


const burnDisable = () => {
  if(burnAmount.value === '' || parseInt(burnAmount.value) <= 0 || 
  parseInt(burnAmount.value) > props.totalCirculation)
    return true
  return false
}

const mint = () => {
  props.mintTokens(mintAmount.value)
  mintAmount.value = '0'
}

const burn = () => {
  props.burnTokens(burnAmount.value)
  burnAmount.value = '0'
}

</script>

<style scope>
.color-red-disabled.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn-outlined) {
  color: #D32F2F !important;
}
</style>