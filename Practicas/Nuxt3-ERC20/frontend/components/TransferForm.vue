<template>
  <v-container>
    <div class="text-h6 font-weight-bold">
      Transfer
    </div>
    <v-form v-model="valid">
      <v-text-field
        v-model="amount"
        :rules="amountRules"
        :label="`Amount of ${tokenSymbol}`"
        required
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
      color="success"
    >
      Submit
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
  }
});

const amount = ref(1)
const recipientAddress = ref('')
const valid = ref(false)

const amountRules = [
  (value: any) => {
    if (value > 0) return true
    return 'You have to send an amount.'
  }
]
const recipientAddressRules = [
  (value: any) => {
    if (value?.length >= 10) return true
    return 'The address must have 10 characters as minimum.'
  }
]

function send(){
  if(valid.value)
    props.transferTokens(recipientAddress, amount)
}

</script>