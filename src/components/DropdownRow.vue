<script>
import ChevronDown from "./ChevronDown.vue";
import ChevronRight from "./ChevronRight.vue";
import { Fragment } from "vue-frag";
import DISPLAYS, { SPREAD, YIELD, THREE_ML_SPREAD } from "../constants/Display";
import { FIX, FRN } from "../constants/CouponType";

export default {
  props: {
    item: Object,
    selectedYears: Array,
    selectedDisplay: String,
    selectedCurrency: String,
  },
  created() {
    this.FIX = FIX;
    this.FRN = FRN;
  },
  data: function () {
    return {
      expanded: false,
    };
  },
  computed: {
    otherDisplays: function () {
      return DISPLAYS.filter((display) => display !== this.selectedDisplay);
    },
  },
  components: {
    Fragment,
    ChevronDown,
    ChevronRight,
  },
  methods: {
    getQuoteValue: function (year, couponType, display0 = null) {
      const display = display0 || this.selectedDisplay;

      const value = this.item.Quote.filter(
        (item) =>
          item.Years === year &&
          item.CouponType === couponType &&
          item.Currency === this.selectedCurrency
      )[0]?.[display];

      if (typeof value === "undefined" || value === null) {
        return "";
      }

      switch (display) {
        case SPREAD:
        case THREE_ML_SPREAD:
          return `${value > 0 ? "+" : ""}${parseInt(value)}bp`;
        case YIELD:
          return `${parseFloat(value).toFixed(3)}%`;
        default:
          return value;
      }
    },
  },
};
</script>
<template>
  <Fragment>
    <tr class="border-b border-gray-500">
      <td class="py-2 flex items-center">
        <button
          @click="expanded = !expanded"
          class="p-1 text-gray-800"
          type="button"
          aria-label="Toggle secondary rows"
        >
          <ChevronDown v-if="expanded === true" />
          <ChevronRight v-else />
        </button>
        {{ item.DateSent }}
      </td>
      <td class="py-2 font-bold">{{ item.Company }}</td>
      <template v-for="selectedYear in selectedYears">
        <td class="text-center py-2" v-bind:key="selectedYear + FIX">
          {{ getQuoteValue(selectedYear, FIX) }}
        </td>
        <td class="text-center py-2" v-bind:key="selectedYear + FRN">
          {{ getQuoteValue(selectedYear, FRN) }}
        </td>
      </template>
    </tr>
    <Fragment v-if="expanded === true && otherDisplays.length > 0">
      <tr
        v-for="otherDisplay in otherDisplays"
        v-bind:key="otherDisplay"
        class="border-b border-gray-500"
      >
        <td class="py-2"></td>
        <td class="py-2">{{ otherDisplay }}</td>
        <template v-for="selectedYear in selectedYears">
          <td
            class="text-center py-2"
            v-bind:key="otherDisplay + selectedYear + FIX"
          >
            {{ getQuoteValue(selectedYear, FIX, otherDisplay) }}
          </td>
          <td
            class="text-center py-2"
            v-bind:key="otherDisplay + selectedYear + FRN"
          >
            {{ getQuoteValue(selectedYear, FRN, otherDisplay) }}
          </td>
        </template>
      </tr>
    </Fragment>
  </Fragment>
</template>
