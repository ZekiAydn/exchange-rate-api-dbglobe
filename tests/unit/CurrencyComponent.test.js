import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import CurrencyConversion from '../../src/components/CurrencyConversion.vue';
import { useCurrencyStore } from '@/stores/useCurrencyStore';
import PrimeVue from 'primevue/config';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import { createI18n } from 'vue-i18n';

vi.mock('@/stores/useCurrencyStore');

const mockStore = {
  convert: vi.fn(),
  loadSymbols: vi.fn(),
  symbols: {
    TRY: 'Turkish Lira',
    USD: 'US Dollar',
    EUR: 'Euro',
  },
  conversionResult: 10,
};

useCurrencyStore.mockReturnValue(mockStore);

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      currency: {
        title: 'Currency Conversion',
        enter_amount: 'Enter Amount',
        from_currency: 'From Currency',
        to_currency: 'To Currency',
        converted_amount: 'Converted Amount',
        equals: 'equals',
      },
    },
  },
});

beforeAll(() => {
  window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addEventListener: function() {},
      removeEventListener: function() {},
      addListener: function() {},
      removeListener: function() {},
    };
  };
});

describe('CurrencyConversion.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(CurrencyConversion, {
      global: {
        plugins: [PrimeVue, i18n],
        components: {
          DatePicker,
          InputNumber,
          Select,
        },
      },
    });
  });

  it('renders properly', () => {
    expect(wrapper.find('.currency-container').exists()).toBe(true);
    expect(wrapper.find('.title').text()).toBe('Currency Conversion');
  });

  it('loads currency symbols on mount', async () => {
    expect(mockStore.loadSymbols).toHaveBeenCalled();
    expect(wrapper.vm.state.currencyOptions.length).toBeGreaterThan(0);
  });

  it('converts currency when inputs change', async () => {
    wrapper.vm.state.amount = 100;
    wrapper.vm.state.from = 'TRY';
    wrapper.vm.state.to = 'USD';
    await wrapper.vm.$nextTick();

    await wrapper.vm.convertCurrency(); 
    expect(mockStore.convert).toHaveBeenCalledWith('TRY', 'USD', 100, wrapper.vm.state.selectedDate);
    expect(wrapper.vm.state.conversionResult).toBe(mockStore.conversionResult);
  });

  it('displays conversion result correctly', async () => {
    wrapper.vm.state.amount = 50;
    wrapper.vm.state.from = 'EUR';
    wrapper.vm.state.to = 'USD';
    wrapper.vm.state.conversionResult = 60;
    await wrapper.vm.$nextTick();

    const conversionInfo = wrapper.find('.conversion-info');
    expect(conversionInfo.exists()).toBe(true);
    if (conversionInfo.exists()) {
      expect(conversionInfo.text()).toContain('50');
      expect(conversionInfo.text()).toContain('Euro');
      expect(conversionInfo.text()).toContain('60');
      expect(conversionInfo.text()).toContain('US Dollar');
    }
  });

  it('handles conversion failure gracefully', async () => {
    mockStore.convert.mockRejectedValueOnce(new Error('Conversion failed'));

    wrapper.vm.state.amount = 100;
    wrapper.vm.state.from = 'TRY';
    wrapper.vm.state.to = 'USD';

    await wrapper.vm.convertCurrency();

    await wrapper.vm.$nextTick();

    wrapper.vm.state.conversionResult = null;

    expect(mockStore.convert).toHaveBeenCalledWith('TRY', 'USD', 100, wrapper.vm.state.selectedDate);

    expect(wrapper.vm.state.conversionResult).toBeNull();
  });
});
