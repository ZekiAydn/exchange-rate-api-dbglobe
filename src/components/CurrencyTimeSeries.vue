<template>
  <div class="currency-container">
    <div v-if="isLoading" class="progress-spinner">
      <ProgressSpinner />
    </div>
    <div v-else class="currency-in-container">
      <h2 class="title">{{ $t('timeSeries.title') }}</h2>

      <div class="conversion-content">
        <div class="input-group">
          <div class="input-label-container">
            <label>{{$t('timeSeries.startDate')}}</label>
            <DatePicker
                showIcon fluid iconDisplay="input"
                v-model="startDate"
                dateFormat="dd.mm.yy"
                :placeholder="$t('timeSeries.startDate')"
                :maxDate="today"
                class="datepicker"
            >
              <template #inputicon="slotProps">
                <i class="pi pi-calendar" @click="slotProps.clickCallback" />
              </template>
            </DatePicker>
          </div>
          <div class="input-label-container">
            <label>{{$t('timeSeries.endDate')}}</label>
            <DatePicker
                showIcon fluid iconDisplay="input"
                v-model="endDate"
                dateFormat="dd.mm.yy"
                :placeholder="$t('timeSeries.endDate')"
                :minDate="startDate"
                :maxDate="maxEndDate"
                class="datepicker"
            >
              <template #inputicon="slotProps">
                <i class="pi pi-calendar" @click="slotProps.clickCallback" />
              </template>
            </DatePicker>
          </div>
        </div>
        <div class="input-group">
          <div class="input-label-container">
            <label>{{$t('timeSeries.fromCurrency')}}</label>
            <Select
                :options="currencyOptions"
                optionLabel="label"
                optionValue="value"
                v-model="fromCurrency"
                :placeholder="$t('timeSeries.fromCurrency')"
                class="select-currency"
            />
          </div>
          <div class="input-label-container">
            <label>{{$t('timeSeries.toCurrencies')}}</label>
            <MultiSelect
                :options="currencyOptions"
                optionLabel="label"
                optionValue="value"
                v-model="toCurrencies"
                :placeholder="$t('timeSeries.toCurrencies')"
                class="multi-select"
            />
          </div>
        </div>
        <div class="submit-container">
        <button class="submit-button" @click="handleFetch">
          {{ $t('timeSeries.listButton') }}
        </button>
        </div>
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
      <div class="chart-container">
        <Chart type="line" :data="chartData" :options="chartOptions" class="chart" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useCurrencyStore } from '@/stores/useCurrencyStore';
import {chartOptions} from "@/utils/chartOptions.js";

const store = useCurrencyStore();
const startDate = ref(new Date());
const endDate = ref(new Date());
const maxEndDate = ref(null);

const fromCurrency = ref('TRY');
const toCurrencies = ref([]);
const chartData = ref(null);
const currencyOptions = ref([]);
const uniqueDates = [...new Set(store.timeSeriesData.map(entry => entry.date))];
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
      const uniqueDates = [...new Set(store.timeSeriesData.map(entry => entry.date))];

      chartData.value = {
        labels: uniqueDates,
        datasets: toCurrencies.value.map(currency => ({
          label: currency,
          data: uniqueDates.map(date => {
            const entry = store.timeSeriesData.find(
                data => data.to === currency && data.date === date
            );
            return entry ? entry.rate : 0;
          }),
          borderColor: getRandomColor(),
          fill: true,
          tension: 0.6,
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
