<template>
  <Toast v-if="message" severity="error" :life="5000">
    {{ message }}
  </Toast>
</template>

<script setup>
import { computed } from 'vue';
import { useCurrencyStore } from '@/stores/useCurrencyStore';

const store = useCurrencyStore();
const message = computed(() => store.error);
</script>
