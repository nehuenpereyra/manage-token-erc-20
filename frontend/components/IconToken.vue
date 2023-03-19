<template>
  <div>
    <Icon
      v-if="!img"
      v-bind="$attrs"
    />
    <v-img
      v-else
      v-bind="$attrs"
    />
  </div>
</template>
    
<script setup lang="ts">
import { Icon } from '@iconify/vue';
defineProps({
  img : {
    type: Boolean,
    required: false,
    default: false
  }
});


</script>