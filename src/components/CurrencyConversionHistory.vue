<template>
  <div class="currency-container">
    <div class="currency-in-container">
    <h2 class="title">Currency Conversion History</h2>
    <div class="table-container">
      <DataTable :value="store.history" responsiveLayout="scroll" class="currency-table">
        <Column field="timestamp" header="Timestamp" />
        <Column field="date" header="Date" />
        <Column field="from" header="From Currency" />
        <Column field="to" header="To Currency" />
        <Column field="amount" header="Amount" />
        <Column field="result" header="Rate" />
      </DataTable>
    </div>
    </div>
  </div>
</template>

<script setup>
import { useCurrencyStore } from '@/stores/useCurrencyStore';
import { DataTable, Column } from 'primevue';

const store = useCurrencyStore();
</script>
