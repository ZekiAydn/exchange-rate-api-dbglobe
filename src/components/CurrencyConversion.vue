<template>
  <div class="currency-container">
    <div class="currency-in-container">
      <h2 class="title">{{ $t('currency.title') }}</h2>
      <div class="conversion-content" :class="{ 'blur-content': loading }">

        <div class="flex flex-column">
          <label>{{$t('currency.date')}}</label>
          <DatePicker
              v-model="state.selectedDate"
              showIcon fluid iconDisplay="input"
              dateFormat="dd.mm.yy"
              class="datepicker"
          >
            <template #inputicon="slotProps">
              <i class="pi pi-calendar" @click="slotProps.clickCallback" />
            </template>
          </DatePicker>
        </div>

        <div class="input-group">
          <div class="input-label-container">
            <label>{{$t('currency.enter_amount')}}</label>
            <InputNumber
                v-model="state.amount"
                mode="decimal"
                :min=1
                class="input-amount"
                :placeholder="$t('currency.enter_amount')"
            />
          </div>
          <div class="input-label-container">
            <label>{{$t('currency.from_currency')}}</label>
            <Select
                :options="state.currencyOptions"
                optionLabel="label"
                optionValue="value"
                v-model="state.from"
                class="select-currency"
                :placeholder="$t('currency.from_currency')"
            />
          </div>
        </div>

        <div class="input-group">
          <div class="input-label-container">
            <label>{{$t('currency.converted_amount')}}</label>
            <InputNumber
                v-model="state.conversionResult"
                :readonly="true"
                mode="decimal"
                class="input-amount"
                :placeholder="$t('currency.converted_amount')"
            />
          </div>
          <div class="input-label-container">
            <label>{{$t('currency.to_currency')}}</label>
            <Select
                :options="state.currencyOptions"
                optionLabel="label"
                optionValue="value"
                v-model="state.to"
                class="select-currency"
                :placeholder="$t('currency.to_currency')"
            />
          </div>
        </div>

      </div>
      <div class="submit-container">
        <button class="submit-button" @click="convertCurrency" :disabled="loading">
          {{ $t('currency.submit_button') }}
        </button>
      </div>
      <p v-if="state.conversionResult" class="conversion-info">
        {{ state.amount }} {{ fromCurrencyName }} {{ $t('currency.equals') }} {{ state.conversionResult }} {{ toCurrencyName }}
      </p>
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted, watchEffect, computed, reactive, ref } from "vue";
import { DatePicker, InputNumber, Select } from "primevue";
import { useCurrencyStore } from "@/stores/useCurrencyStore";

const store = useCurrencyStore();
const state = reactive({
  selectedDate: new Date(),
  amount: 1,
  from: "TRY",
  to: "USD",
  conversionResult: null,
  currencyOptions: []
});
const loading = ref(false);

const convertCurrency = async () => {
  if (!state.from || !state.to || !state.amount) return;
  loading.value = true;
  try {
    await store.convert(state.from, state.to, state.amount, state.selectedDate);
    state.conversionResult = store.conversionResult;
  } catch (error) {
    console.error("Conversion failed:", error);
    state.conversionResult = null;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    await store.loadSymbols();
    if (store.symbols) {
      state.currencyOptions = Object.keys(store.symbols).map((key) => ({
        label: `${key} - ${store.symbols[key]}`,
        value: key,
      }));
    }
  } catch (error) {
    console.error("Failed to load symbols:", error);
  } finally {
    loading.value = false;
  }
});

watchEffect(async () => {
  if (!state.from || !state.to || !state.amount) return;
  try {
    await convertCurrency();
  } catch (error) {
    console.error("Conversion failed:", error);
  }
});

const fromCurrencyName = computed(() => {
  return (
      state.currencyOptions.find((option) => option.value === state.from)?.label.split(" - ")[1] || ""
  );
});
const toCurrencyName = computed(() => {
  return (
      state.currencyOptions.find((option) => option.value === state.to)?.label.split(" - ")[1] || ""
  );
});
</script>

