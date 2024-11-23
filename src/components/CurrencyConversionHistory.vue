<template>
  <div class="currency-container">
    <div class="currency-in-container">
      <h2 class="title">{{ $t('history.title') }}</h2>
      <div class="table-container">
        <DataTable :value="store.history" responsiveLayout="scroll" class="currency-table">
          <Column field="timestamp" :header="$t('history.table.timestamp')" />
          <Column field="date" :header="$t('history.table.date')" />
          <Column field="from" :header="$t('history.table.fromCurrency')" />
          <Column field="to" :header="$t('history.table.toCurrency')" />
          <Column field="amount" :header="$t('history.table.amount')" />
          <Column field="result" :header="$t('history.table.rate')" />
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCurrencyStore } from '@/stores/useCurrencyStore';

const store = useCurrencyStore();
</script>
