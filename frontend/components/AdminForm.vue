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
      @click="mintTokens"
      block
      color="primary"
      :disabled="mintDisable()"
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
      @click="burnTokens"
      block
      color="red"
      class="color-red-disabled"
      :disabled="burnDisable()"
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
  }
});
  
const mintAmount = ref('')
const burnAmount = ref('')
const mintValid = ref(false)
const burnValid = ref(false)
  

const mintAmountRules = [
  (value: any) => {
    if (value > 0) 
      return true
    return 'Mint a value greater than zero'
  }
]

const burnAmountRules = [
  (value: any) => {
    if (value > 0) {
      if(value > props.totalCirculation)
        return 'The amount exceeds the value in circulation'
      return true
    }
    return 'Burn a value greater than zero'
  }
]

function mintDisable(){
  if(mintAmount.value === '' || parseInt(mintAmount.value) <= 0)
    return true
  return false
}


function burnDisable(){
  if(burnAmount.value === '' || parseInt(burnAmount.value) <= 0 || 
  parseInt(burnAmount.value) > props.totalCirculation)
    return true
  return false
}

</script>

<style scope>
.color-red-disabled.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn-outlined) {
  color: #D32F2F !important;
}
</style>