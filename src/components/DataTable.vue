<script>
import SortButton from "./SortButton.vue";
import { DATE_SENT, COMPANY } from "../constants/SortColumn";
import { DESC, ASC } from "../constants/SortDirection";
import pipe from "../helpers/pipe";
import numericSort from "../helpers/numeric-sort";
import { SPREAD, YIELD, THREE_ML_SPREAD } from "../constants/Display";

const FIX = "FIX";
const FRN = "FRN";

function extractItemsWithNoQuote(data) {
  return data.filter((item) => !item.Quote);
}

function extractItemsWithQuote(data) {
  return data.filter((item) => !!item.Quote);
}

function filterByCompanyFilter(data, companyFilter) {
  return data.filter(
    (item) =>
      item.Company.toLowerCase().indexOf(companyFilter.toLowerCase()) !== -1
  );
}

function parseDateSentToDate(data) {
  return data.map((item) => ({
    ...item,
    DateSent: !item.DateSent ? null : new Date(item.DateSent),
  }));
}

function formatDateSent(data) {
  return data.map((item) => {
    const date = item.DateSent;
    if (!date) {
      return {
        ...item,
        DateSent: "",
      };
    }

    const day = new Intl.DateTimeFormat("en-US", {
      day: "numeric",
    }).format(date);
    const month = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(date);
    const year = new Intl.DateTimeFormat("en-US", {
      year: "2-digit",
    }).format(date);

    return {
      ...item,
      DateSent: `${day}-${month}-${year}`,
    };
  });
}

function toLowerCaseIfString(value) {
  return typeof value === "string" ? value.toLowerCase() : value;
}

function sortItemsBy(data, field, direction) {
  const sortFunc = (a, b) => {
    const x = toLowerCaseIfString(direction === DESC ? b[field] : a[field]);
    const y = toLowerCaseIfString(direction === DESC ? a[field] : b[field]);

    if (x < y) {
      return -1;
    }

    if (x > y) {
      return 1;
    }

    // NOTE: If x and y are equal, then sort by Preferred field in descending order.
    return numericSort(b.Preferred, a.Preferred);
  };

  switch (direction) {
    case DESC:
    case ASC:
      return [...data].sort(sortFunc);
    default:
      // NOTE: If no direction is supplied don't sort.
      return data;
  }
}

export default {
  props: {
    items: Array,
    companyFilter: String,
    selectedYears: Array,
    selectedDisplay: String,
    displays: Array,
    selectedCurrency: String,
  },
  created() {
    this.DATE_SENT = DATE_SENT;
    this.COMPANY = COMPANY;
    this.FIX = FIX;
    this.FRN = FRN;
  },
  data: function () {
    return {
      sortDirection: DESC,
      sortColumn: DATE_SENT,
    };
  },
  computed: {
    quoteItems: function () {
      return pipe(
        this.items,
        extractItemsWithQuote,
        [filterByCompanyFilter, this.companyFilter],
        parseDateSentToDate,
        [sortItemsBy, this.sortColumn, this.sortDirection],
        formatDateSent
      );
    },
    noQuoteItems: function () {
      return pipe(
        this.items,
        extractItemsWithNoQuote,
        [filterByCompanyFilter, this.companyFilter],
        parseDateSentToDate,
        [sortItemsBy, this.sortColumn, this.sortDirection],
        formatDateSent
      );
    },
  },
  components: {
    SortButton,
  },
  methods: {
    handleSortColumnChange: function (sortColumn) {
      this.sortColumn = sortColumn;
      // NOTE: When the user changes the sort column,
      // the sort direction should be descending.
      this.sortDirection = DESC;
    },
    getQuoteValue: function (item, year, couponType, display0 = null) {
      const display = display0 || this.selectedDisplay;

      const value = item.Quote.filter(
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
  <table class="w-full">
    <thead class="text-gray-500">
      <tr>
        <td rowspan="2" width="200" class="text-center align-bottom">
          <SortButton
            label="Date Sent"
            :column="DATE_SENT"
            :sortColumn="sortColumn"
            v-on:update:sortColumn="handleSortColumnChange"
            v-bind:sortDirection.sync="sortDirection"
          />
        </td>
        <td rowspan="2" class="align-bottom">
          <SortButton
            :label="COMPANY"
            :column="COMPANY"
            :sortColumn="sortColumn"
            v-on:update:sortColumn="handleSortColumnChange"
            v-bind:sortDirection.sync="sortDirection"
          />
        </td>
        <td
          colspan="2"
          width="200"
          v-for="selectedYear in selectedYears"
          v-bind:key="selectedYear"
          class="px-1 last:pr-0 "
        >
          <div class="border-b-2 border-b-gray-500 font-bold text-gray-800 text-center">
            {{ selectedYear }} YRS
          </div>
        </td>
      </tr>
      <tr class="border-b-2 border-gray-500">
        <template v-for="selectedYear in selectedYears">
          <td v-bind:key="selectedYear + FIX" width="100" class="text-center">
            FIX
          </td>
          <td v-bind:key="selectedYear + FRN" width="100" class="text-center">
            FRN
          </td>
        </template>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in quoteItems"
        v-bind:key="item.Id"
        class="border-b border-gray-500"
      >
        <td class="py-2">{{ item.DateSent }}</td>
        <td class="py-2 font-bold">{{ item.Company }}</td>
        <template v-for="selectedYear in selectedYears">
          <td class="text-center py-2" v-bind:key="selectedYear + FIX">
            {{ getQuoteValue(item, selectedYear, FIX) }}
          </td>
          <td class="text-center py-2" v-bind:key="selectedYear + FRN">
            {{ getQuoteValue(item, selectedYear, FRN) }}
          </td>
        </template>
      </tr>
      <tr
        v-for="item in noQuoteItems"
        v-bind:key="item.Id"
        class="border-b border-gray-500"
      >
        <td class="py-2">{{ item.DateSent }}</td>
        <td class="py-2 text-gray-500 font-semibold">{{ item.Company }}</td>
        <template v-for="selectedYear in selectedYears">
          <td class="py-2" v-bind:key="selectedYear + FIX"></td>
          <td class="py-2" v-bind:key="selectedYear + FRN"></td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
