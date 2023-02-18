<script>
import ToggleSingle from "./ToggleSingle.vue";
import ToggleMulti from "./ToggleMulti.vue";
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
      companyFilter: "",
    };
  },
  methods: {
    handleCurrencyChange: function (currency) {
      this.selectedCurrency = currency;
      this.selectedYears = this.years;
    },
    handleYearsChange: function (years) {
      this.selectedYears = years;
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
    ToggleSingle,
    ToggleMulti,
  },
};
</script>

<template>
  <div>
    <div class="flex gap-8">
      <ToggleSingle v-on:toggle="handleCurrencyChange" :items="currencies" />
      <ToggleMulti v-on:toggle="handleYearsChange" :items="years" />
      <ToggleSingle v-on:toggle="handleDisplayChange" :items="displays" />
    </div>
    <div>
      <input
        class="border border-slate-500 rounded mt-5 py-1 px-2 w-80"
        type="text"
        v-model="companyFilter"
        placeholder="Filter by company name ..."
        autocomplete="off"
      />
    </div>
  </div>
</template>
