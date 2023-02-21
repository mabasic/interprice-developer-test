<script>
import ChevronDown from "./ChevronDown.vue";
import ChevronRight from "./ChevronRight.vue";
import DISPLAYS, { format as formatDisplay } from "../constants/Display";
import { FIX, FRN } from "../constants/CouponType";

export default {
  props: {
    item: Object,
    selectedYears: Array,
    selectedDisplay: String,
    selectedCurrency: String,
    minimumValues: Object,
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
    ChevronDown,
    ChevronRight,
  },
  methods: {
    getQuoteValues: function (display0 = null) {
      const display = display0 || this.selectedDisplay;

      return this.selectedYears.reduce(
        (acc, selectedYear) => ({
          ...acc,
          [selectedYear]: {
            FIX: this.getQuoteValue(selectedYear, FIX, display),
            FRN: this.getQuoteValue(selectedYear, FRN, display),
          },
        }),
        {}
      );
    },
    isMinimum: function (value, year, couponType) {
      return value === this.minimumValues[year][couponType];
    },
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

      return formatDisplay(display, value);
    },
  },
};
</script>
<template>
  <div>
    <!-- Primary Row -->
    <div class="flex border-b border-gray-500">
      <div class="w-[200px] py-2 flex items-center">
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
      </div>
      <div class="grow py-2 font-bold">
        {{ item.Company }}
      </div>
      <div
        class="flex w-[200px]"
        v-for="(values, selectedYear) in getQuoteValues()"
        v-bind:key="`${item.Company}-${item.Id}-${selectedYear}`"
      >
        <div
          class="w-1/2 text-center py-2"
          v-bind:class="[
            isMinimum(values[FIX], selectedYear, FIX) ? 'bg-yellow-100' : '',
          ]"
        >
          {{ values[FIX] }}
        </div>
        <div
          class="w-1/2 text-center py-2"
          v-bind:class="[
            isMinimum(values[FRN], selectedYear, FRN) ? 'bg-yellow-100' : '',
          ]"
        >
          {{ values[FRN] }}
        </div>
      </div>
    </div>

    <!-- Expanded Rows -->
    <div v-if="expanded === true && otherDisplays.length > 0">
      <div
        class="flex border-b border-gray-500"
        v-for="otherDisplay in otherDisplays"
        v-bind:key="`${item.Company}-${item.Id}-${otherDisplay}`"
      >
        <div class="w-[200px] py-2"></div>
        <div class="grow py-2">
          {{ otherDisplay }}
        </div>
        <div
          class="flex w-[200px]"
          v-for="selectedYear in selectedYears"
          v-bind:key="`${otherDisplay}-${selectedYear}`"
        >
          <div class="w-1/2 text-center py-2">
            {{ getQuoteValue(selectedYear, FIX, otherDisplay) }}
          </div>
          <div class="w-1/2 text-center py-2">
            {{ getQuoteValue(selectedYear, FRN, otherDisplay) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
