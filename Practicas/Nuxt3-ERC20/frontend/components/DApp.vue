<template>
  <div class="d-flex align-center flex-column">
    <v-icon>mdi-home</v-icon>
    <v-card width="400">
      <h1>Base</h1>
      <form>
        <v-select
          v-model="locale"
          :items="['en', 'es']"
        />
        <p>{{ t('welcome') }}</p>
      </form>
      <button @click="increment">
        {{ t('counter', count) }}
      </button>
      {{ filtersList }}
    </v-card>
  </div>
</template>
    
<script setup lang="ts">
import { useFiltersStore } from '~~/store/filters'
const filtersStore = useFiltersStore()
const filtersList = filtersStore.filtersList
const { locale, t } = useI18n()

const {count, increment} = useCounter()
  
</script>