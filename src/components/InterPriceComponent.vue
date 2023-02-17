<script>
import CurrencySwitcher from "./CurrencySwitcher.vue";
import YearsSwitcher from "./YearsSwitcher.vue";
import DisplaySwitcher from "./DisplaySwitcher.vue";
import data from "../data.json";

function extractCurrencies(data) {
  return [
    ...new Set(
      data.Items.flatMap((item) => item.Quote)
        .filter(Boolean)
        .map((quote) => quote.Currency)
    ),
  ]
    .sort()
    .reverse();
}

function extractYears(data, currency) {
  return [
    ...new Set(
      data.Items.flatMap((item) => item.Quote)
        .filter(Boolean)
        .filter((quote) => quote.Currency === currency)
        .map((quote) => quote.Years)
    ),
  ].sort((a, b) => a - b);
}

export default {
  data: function () {
    const currencies = extractCurrencies(data);
    const selectedCurrency = currencies?.[0];
    const displays = ["Spread", "Yield", "3MLSpread"];

    return {
      currencies: currencies,
      selectedCurrency: selectedCurrency,
      displays: displays,
      selectedDisplay: displays[0],
      selectedYears: extractYears(data, selectedCurrency),
    };
  },
  methods: {
    handleCurrencyChange: function (currency) {
      this.selectedCurrency = currency;
      this.selectedYears = this.years;
    },
    handleYearsChange: function (years) {
      this.selectedYears = years;
      console.log(years);
    },
    handleDisplayChange: function (display) {
      this.selectedDisplay = display;
    },
  },
  computed: {
    years: function () {
      return extractYears(data, this.selectedCurrency);
    },
  },
  components: {
    CurrencySwitcher,
    YearsSwitcher,
    DisplaySwitcher,
  },
};
</script>

<template>
  <div class="flex gap-8">
    <CurrencySwitcher
      v-on:switch="handleCurrencyChange"
      :currencies="currencies"
    />
    <YearsSwitcher v-on:switch="handleYearsChange" :years="years" />
    <DisplaySwitcher v-on:switch="handleDisplayChange" :displays="displays" />
  </div>
</template>
