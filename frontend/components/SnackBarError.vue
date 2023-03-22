<template>
  <v-snackbar
    v-model="status"
    location="top right"
    color="background"
  >
    <div class="d-flex">
      <div class="text-red font-weight-bold">
        Error:
      </div>
    &nbsp;
      <div class="text-white font-weight-medium">
        {{ message }}
      </div>
    </div>
  </v-snackbar>
</template>
            
<script setup lang="ts">
 
const props = defineProps({
  message: {
    type: String,
    required: true
  }
});

const status = ref(false)

watch(() => props.message, (newValue, oldValue) => {
  if(newValue !== '' && oldValue === '')
    status.value = true
  else
    status.value = false
});

</script>