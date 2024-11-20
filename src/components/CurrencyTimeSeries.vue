<template>
  <div class="currency-container">
    <div v-if="isLoading" class="progress-spinner">
      <ProgressSpinner />
    </div>
    <div v-else class="currency-in-container">
      <h2 class="title">{{ $t('timeSeries.title') }}</h2>

      <div class="conversion-content">
        <div class="input-group">
          <DatePicker
              v-model="startDate"
              dateFormat="dd.mm.yy"
              :placeholder="$t('timeSeries.startDate')"
              :maxDate="today"
              class="datepicker"
          />
          <DatePicker
              v-model="endDate"
              dateFormat="dd.mm.yy"
              :placeholder="$t('timeSeries.endDate')"
              :minDate="startDate"
              :maxDate="maxEndDate"
              class="datepicker"
          />
        </div>
        <div class="input-group">
          <Select
              :options="currencyOptions"
              optionLabel="label"
              optionValue="value"
              v-model="fromCurrency"
              :placeholder="$t('timeSeries.fromCurrency')"
              class="select-currency"
          />
          <MultiSelect
              :options="currencyOptions"
              optionLabel="label"
              optionValue="value"
              v-model="toCurrencies"
              :placeholder="$t('timeSeries.toCurrencies')"
              class="multi-select"
          />
        </div>
        <Button :label="$t('timeSeries.listButton')" @click="handleFetch" class="fetch-button" />
      </div>

      <p v-if="store.error" class="error-message">{{ $t('timeSeries.error') }}: {{ store.error }}</p>

      <div class="table-container">
        <DataTable :value="store.timeSeriesData" responsiveLayout="scroll" class="currency-table">
          <Column field="date" :header="$t('timeSeries.table.date')" />
          <Column field="from" :header="$t('timeSeries.table.fromCurrency')" />
          <Column field="to" :header="$t('timeSeries.table.toCurrency')" />
          <Column field="rate" :header="$t('timeSeries.table.rate')" />
        </DataTable>
      </div>
      <Chart type="line" :data="chartData" class="chart" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useCurrencyStore } from '@/stores/useCurrencyStore';
import { DatePicker, Select, Button, DataTable, Column, MultiSelect, ProgressSpinner } from 'primevue';
import Chart from 'primevue/chart';

const store = useCurrencyStore();
const startDate = ref(new Date());
const endDate = ref(new Date());
const maxEndDate = ref(null);

const fromCurrency = ref('TRY');
const toCurrencies = ref([]);
const chartData = ref(null);
const currencyOptions = ref([]);
const isLoading = ref(false);

const today = ref(new Date());

const validateDates = () => {
  if (!startDate.value || !endDate.value) {
    store.error = $t('timeSeries.validation.datesRequired');
    return false;
  }

  const diffInDays = (endDate.value - startDate.value) / (1000 * 60 * 60 * 24);
  if (diffInDays > 30) {
    store.error = $t('timeSeries.validation.dateRangeExceeded');
    return false;
  }

  if (startDate.value > endDate.value) {
    store.error = $t('timeSeries.validation.invalidStartDate');
    return false;
  }

  return true;
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const handleFetch = async () => {
  if (!validateDates()) return;

  if (toCurrencies.value.length === 0) {
    store.error = $t('timeSeries.validation.toCurrenciesRequired');
    return;
  }

  try {
    isLoading.value = true;
    store.error = null;

    await store.fetchTimeSeries(
        startDate.value,
        endDate.value,
        fromCurrency.value,
        toCurrencies.value.join(',')
    );

    if (store.timeSeriesData.length > 0) {
      chartData.value = {
        labels: store.timeSeriesData.map(entry => entry.date),
        datasets: toCurrencies.value.map(currency => ({
          label: currency,
          data: store.timeSeriesData
              .filter(entry => entry.to === currency)
              .map(entry => entry.rate),
          borderColor: getRandomColor(),
          fill: false,
          tension: 0.1,
        })),
      };
    }
  } catch (error) {
    store.error = $t('timeSeries.errorFetch');
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await store.loadSymbols();
  currencyOptions.value = Object.keys(store.symbols).map(key => ({
    label: key,
    value: key
  }));
});

watch(startDate, (newStartDate) => {
  const newMaxEndDate = new Date(newStartDate);
  newMaxEndDate.setMonth(newMaxEndDate.getMonth() + 1);
  maxEndDate.value = newMaxEndDate;
  if (endDate.value > maxEndDate.value) {
    endDate.value = maxEndDate.value;
  }
});
</script>
