<template>
  <div class="currency-container">
    <div class="currency-in-container">
      <h2 class="title">{{ $t('currency.title') }}</h2>
      <div class="conversion-content">
        <DatePicker
            v-model="selectedDate"
            dateFormat="dd.mm.yy"
            class="datepicker"
        />
        <div class="input-group">
          <InputNumber
              v-model="amount"
              mode="decimal"
              min="1"
              class="input-amount"
              :placeholder="$t('currency.enter_amount')"
          />
          <Select
              :options="currencyOptions"
              optionLabel="label"
              optionValue="value"
              v-model="from"
              class="select-currency"
              :placeholder="$t('currency.from_currency')"
          />
        </div>
        <div class="input-group">
          <InputNumber
              v-model="conversionResult"
              :readonly="true"
              mode="decimal"
              class="input-amount"
              :placeholder="$t('currency.converted_amount')"
          />
          <Select
              :options="currencyOptions"
              optionLabel="label"
              optionValue="value"
              v-model="to"
              class="select-currency"
              :placeholder="$t('currency.to_currency')"
          />
        </div>
      </div>
      <p v-if="conversionResult" class="conversion-info">
        {{ amount }} {{ fromCurrencyName }} {{ $t('currency.equals') }} {{ conversionResult }} {{ toCurrencyName }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { DatePicker, InputNumber, Select } from "primevue";
import { useCurrencyStore } from "@/stores/useCurrencyStore";

const store = useCurrencyStore();
const selectedDate = ref(new Date());
const amount = ref(1);
const from = ref("TRY");
const to = ref("USD");
const conversionResult = ref(null);
const currencyOptions = ref([]);


const convertCurrency = async () => {
  if (!from.value || !to.value || !amount.value) return;
  try {
    await store.convert(from.value, to.value, amount.value, selectedDate.value);
    conversionResult.value = store.conversionResult;
  } catch (error) {
    console.error("Conversion failed:", error);
  }
};


onMounted(async () => {
  try {
    await store.loadSymbols();
    if (store.symbols) {
      currencyOptions.value = Object.keys(store.symbols).map((key) => ({
        label: `${key} - ${store.symbols[key]}`,
        value: key,
      }));
    }
  } catch (error) {
    console.error("Failed to load symbols:", error);
  }
});


watch([amount, from, to, selectedDate], async () => {
  if (!from.value || !to.value || !amount.value) return;
  try {
    await convertCurrency();
  } catch (error) {
    console.error("Conversion failed:", error);
  }
});

const fromCurrencyName = computed(() => {
  return (
      currencyOptions.value.find((option) => option.value === from.value)?.label.split(" - ")[1] || ""
  );
});
const toCurrencyName = computed(() => {
  return (
      currencyOptions.value.find((option) => option.value === to.value)?.label.split(" - ")[1] || ""
  );
});
</script>
