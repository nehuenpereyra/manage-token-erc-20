<template>
  <v-container>
    <!--
    <div class="text-h6 font-weight-bold">
      Transfer
    </div>
    -->
    <v-form v-model="valid">
      <v-text-field
        v-model="amount"
        :rules="amountRules"
        type="number"
        :label="`Amount of ${tokenSymbol}`"
        required
        class="mb-2"
      />

      <v-text-field
        v-model="recipientAddress"
        :rules="recipientAddressRules"
        :label="'Recipient address'"
        required
      />
    </v-form>
    <v-btn
      @click="send"
      block
      class="mt-2"
      color="primary"
      :disabled="sendRules()"
      :loading="loading"
    >
      Send
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">

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
  },
  loading: {
    type: Boolean,
    required: true
  }
});

const amount = ref('')
const recipientAddress = ref('')
const valid = ref(false)

const amountRules = [
  (value: string) => {
    const valueInt: number = parseFloat(value)
    if(valueInt === 0 || value === '')
      return true
    if (valueInt > 0) {
      if(valueInt > props.totalAmount)
        return 'Amount exceeds balance'
      return true
    }
    return 'You have to send an amount'
  }
]
const recipientAddressRules = [
  (value: string) => {
    if(value === '')
      return true
    if (value?.length >= 10) return true
    return 'The address must have 10 characters as minimum'
  }
]

function sendRules (){
  const amountFloat = parseFloat(amount.value)
  if(amountFloat > props.totalAmount || amountFloat <= 0 ||
    amount.value === '' || recipientAddress.value.length < 10)
    return true
  return false
}

function send(){
  if(valid.value) {
    props.transferTokens(recipientAddress.value, amount.value)
    amount.value = ''
    recipientAddress.value = ''
  }
    
}

</script>