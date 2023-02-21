<script>
import ToggleSingle from "./ToggleSingle.vue";
import ToggleMulti from "./ToggleMulti.vue";
import DataTable from "./DataTable.vue";
import numericSort from "../helpers/numeric-sort";
import DISPLAYS from "../constants/Display";

export function extractCurrencies(data) {
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

export function extractYears(data, currency) {
  return [
    ...new Set(
      data.Items.flatMap((item) => item.Quote)
        .filter(Boolean)
        .filter((quote) => quote.Currency === currency)
        .map((quote) => quote.Years)
    ),
  ].sort(numericSort);
}

export default {
  props: {
    items: Object,
  },
  data: function () {
    const currencies = extractCurrencies(this.items);
    const selectedCurrency = currencies?.[0];

    return {
      currencies: currencies,
      selectedCurrency: selectedCurrency,
      displays: DISPLAYS,
      selectedDisplay: DISPLAYS[0],
      selectedYears: extractYears(this.items, selectedCurrency),
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
      return extractYears(this.items, this.selectedCurrency);
    },
  },
  components: {
    ToggleSingle,
    ToggleMulti,
    DataTable,
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
    <DataTable
      :companyFilter="companyFilter"
      :selectedYears="selectedYears"
      :selectedDisplay="selectedDisplay"
      :displays="displays"
      :selectedCurrency="selectedCurrency"
      :items="items.Items"
    />
  </div>
</template>
