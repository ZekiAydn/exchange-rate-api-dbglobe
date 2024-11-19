import { defineStore } from 'pinia';
import axios from 'axios';

const API_KEY = 'wkcKkuoGRPJQhJ7gqurIya32Qxr80yrP';
const BASE_URL = 'https://api.apilayer.com/exchangerates_data';

export const useCurrencyStore = defineStore('currency', {
    state: () => ({
        symbols: {},
        conversionResult: null,
        timeSeriesData: [],
        history: [],
        error: null,
    }),

    actions: {
        // Döviz sembollerini yükleme
        async loadSymbols() {
            try {
                const response = await axios.get(`${BASE_URL}/symbols`, {
                    headers: { apikey: API_KEY }
                });

                if (response.data.success) {
                    this.symbols = response.data.symbols;
                } else {
                    this.error = 'Failed to load currency symbols.';
                }
            } catch (error) {
                console.error('Failed to load symbols:', error);
                this.error = 'Error loading currency symbols. Please try again later.';
            }
        },

        async convert(from, to, amount, date) {
            try {
                this.conversionResult = null;
                this.error = null;

                const formattedDate = date ? date.toISOString().split('T')[0] : undefined;

                const response = await axios.get(`${BASE_URL}/convert`, {
                    headers: { apikey: API_KEY },
                    params: {
                        from,
                        to,
                        amount: amount.toString(),
                        ...(formattedDate && { date: formattedDate })
                    }
                });

                if (response.data.success) {
                    this.conversionResult = response.data.result;

                    this.history.push({
                        timestamp: new Date().toLocaleString(),
                        date: formattedDate,
                        from,
                        to,
                        amount,
                        result: response.data.result
                    });
                } else {
                    this.error = 'Failed to convert currency.';
                }
            } catch (error) {
                console.error('Failed to convert currency:', error);
                this.error = 'Currency conversion failed. Please try again later.';
            }
        },


        async fetchTimeSeries(startDate, endDate, base, symbols) {
            try {
                this.timeSeriesData = []; // Önceki veriyi temizle
                this.error = null;

                const formattedStartDate = startDate.toISOString().split('T')[0];
                const formattedEndDate = endDate.toISOString().split('T')[0];

                const response = await axios.get(`${BASE_URL}/timeseries`, {
                    headers: { apikey: API_KEY },
                    params: {
                        start_date: formattedStartDate,
                        end_date: formattedEndDate,
                        base,
                        symbols
                    }
                });

                if (response.data.success) {
                    this.timeSeriesData = Object.keys(response.data.rates).flatMap(date =>
                        Object.keys(response.data.rates[date]).map(currency => ({
                            date,
                            from: response.data.base,
                            to: currency,
                            rate: response.data.rates[date][currency]
                        }))
                    );
                } else {
                    this.error = 'Failed to fetch time series data.';
                }
            } catch (error) {
                console.error('Failed to fetch time series data:', error);
                this.error = 'Error fetching time series data. Please try again later.';
            }
        }
    }
});
