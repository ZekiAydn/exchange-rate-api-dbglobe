<template>
  <div class="currency-container">
    <div class="currency-in-container">
      <h2 class="title">{{ $t('currency.title') }}</h2>
      <div class="conversion-content">
        <DatePicker
            v-model="state.selectedDate"
            dateFormat="dd.mm.yy"
            class="datepicker"
        />
        <div class="input-group">
          <InputNumber
              v-model="state.amount"
              mode="decimal"
              min="1"
              class="input-amount"
              :placeholder="$t('currency.enter_amount')"
          />
          <Select
              :options="state.currencyOptions"
              optionLabel="label"
              optionValue="value"
              v-model="state.from"
              class="select-currency"
              :placeholder="$t('currency.from_currency')"
          />
        </div>
        <div class="input-group">
          <InputNumber
              v-model="state.conversionResult"
              :readonly="true"
              mode="decimal"
              class="input-amount"
              :placeholder="$t('currency.converted_amount')"
          />
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
      <p v-if="conversionResult" class="conversion-info">
        {{ state.amount }} {{ fromCurrencyName }} {{ $t('currency.equals') }} {{ state.conversionResult }} {{ toCurrencyName }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, computed, reactive } from "vue";
import {DatePicker, InputNumber, Select} from "primevue";
import {useCurrencyStore} from "@/stores/useCurrencyStore";

const store = useCurrencyStore();
const state = reactive({
  selectedDate: new Date(),
  amount: 1,
  from: "TRY",
  to: "USD",
  conversionResult: null,
  currencyOptions: []
});

const convertCurrency = async () => {
  if (!state.from || !state.to || !state.amount) return;
  try {
    await store.convert(state.from, state.to, state.amount, state.selectedDate);
    state.conversionResult = store.conversionResult;
  } catch (error) {
    console.error("Conversion failed:", error);
  }
};

onMounted(async () => {
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
