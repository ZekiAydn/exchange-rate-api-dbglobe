<template>
  <div class="currency-container">
    <div v-if="isLoading" class="progress-spinner">
      <ProgressSpinner />
    </div>
    <div v-else class="currency-in-container">
      <h2 class="title">Currency Time Series</h2>

      <div class="conversion-content">
        <div class="input-group">
          <DatePicker
              v-model="startDate"
              dateFormat="dd.mm.yy"
              placeholder="Start Date"
              :maxDate="today"
              class="datepicker"
          />
          <DatePicker
              v-model="endDate"
              dateFormat="dd.mm.yy"
              placeholder="End Date"
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
              placeholder="From Currency"
              class="select-currency"
          />
          <MultiSelect
              :options="currencyOptions"
              optionLabel="label"
              optionValue="value"
              v-model="toCurrencies"
              placeholder="To Currencies"
              class="multi-select"
          />
        </div>
        <Button label="Fetch Data" @click="handleFetch" class="fetch-button" />
      </div>

      <p v-if="store.error" class="error-message">{{ store.error }}</p>

      <div class="table-container">
        <DataTable :value="store.timeSeriesData" responsiveLayout="scroll" class="currency-table">
          <Column field="date" header="Date" />
          <Column field="from" header="From Currency" />
          <Column field="to" header="To Currency" />
          <Column field="rate" header="Rate" />
        </DataTable>
      </div>
      <Chart type="line" :data="chartData" class="chart" />
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
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
    store.error = 'Start Date and End Date are required.';
    return false;
  }

  const diffInDays = (endDate.value - startDate.value) / (1000 * 60 * 60 * 24);
  if (diffInDays > 30) {
    store.error = 'The date range cannot exceed 1 month.';
    return false;
  }

  if (startDate.value > endDate.value) {
    store.error = 'Start Date cannot be later than End Date.';
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
    store.error = 'Please select at least one "To Currency".';
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
    store.error = 'Failed to fetch data. Please try again.';
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
