<script>
import SortButton from "./SortButton.vue";
import { DATE_SENT, COMPANY } from "../constants/SortColumn";
import { DESC, ASC } from "../constants/SortDirection";
import pipe from "../helpers/pipe";
import numericSort from "../helpers/numeric-sort";
import DropdownRow from "./DropdownRow.vue";
import { FIX, FRN } from "../constants/CouponType";
import { format as formatDisplay } from "../constants/Display";

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
    minimumValuesByYearAndCouponType: function () {
      const getMinimumValue = (year, couponType) =>
        Math.min(
          ...this.quoteItems
            .flatMap((item) => item.Quote)
            .filter(
              (quote) =>
                quote.Years === year &&
                quote.CouponType === couponType &&
                quote.Currency === this.selectedCurrency
            )
            .map((quote) => quote[this.selectedDisplay])
            .filter(Boolean)
        );

      const formatOrNull = (year, couponType) => {
        const minimumValue = getMinimumValue(year, couponType);

        if (minimumValue === Infinity) {
          return null;
        }

        return formatDisplay(this.selectedDisplay, minimumValue);
      };

      return this.selectedYears.reduce(
        (acc, selectedYear) => ({
          ...acc,
          [selectedYear]: {
            FIX: formatOrNull(selectedYear, FIX),
            FRN: formatOrNull(selectedYear, FRN),
          },
        }),
        {}
      );
    },
  },
  components: {
    SortButton,
    DropdownRow,
  },
  methods: {
    handleSortColumnChange: function (sortColumn) {
      this.sortColumn = sortColumn;
      // NOTE: When the user changes the sort column,
      // the sort direction should be descending.
      this.sortDirection = DESC;
    },
    getAverageQuoteValue: function (year, couponType) {
      const values = this.quoteItems
        .flatMap((item) => item.Quote)
        .filter(
          (quote) =>
            quote.CouponType === couponType &&
            quote.Years === year &&
            quote.Currency === this.selectedCurrency
        )
        .map((quote) => quote[this.selectedDisplay]);

      // NOTE: Prevents division by 0; NaN
      if (values.length === 0) {
        return 0;
      }

      return formatDisplay(
        this.selectedDisplay,
        values.reduce((acc, val) => acc + val, 0) / values.length
      );
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
          class="px-1 last:pr-0"
        >
          <div
            class="border-b-2 border-b-gray-500 font-bold text-gray-800 text-center"
          >
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
      <DropdownRow
        v-for="item in quoteItems"
        v-bind:key="`${item.Company}-${item.Id}`"
        :item="item"
        :selectedYears="selectedYears"
        :selectedDisplay="selectedDisplay"
        :selectedCurrency="selectedCurrency"
        :minimumValues="minimumValuesByYearAndCouponType"
      >
      </DropdownRow>
      <tr
        v-for="item in noQuoteItems"
        v-bind:key="`${item.Company}-${item.Id}`"
        class="border-b border-gray-500"
      >
        <td class="py-2">{{ item.DateSent }}</td>
        <td class="py-2 text-gray-500 font-semibold">{{ item.Company }}</td>
        <template v-for="selectedYear in selectedYears">
          <td class="py-2" v-bind:key="selectedYear + FIX"></td>
          <td class="py-2" v-bind:key="selectedYear + FRN"></td>
        </template>
      </tr>
      <tr class="border-2 border-gray-500">
        <td class="py-2"></td>
        <td class="py-2">Average by {{ selectedDisplay }}</td>
        <template v-for="selectedYear in selectedYears">
          <td class="py-2 text-center" v-bind:key="selectedYear + FIX">
            {{ getAverageQuoteValue(selectedYear, FIX) || "" }}
          </td>
          <td class="py-2 text-center" v-bind:key="selectedYear + FRN">
            {{ getAverageQuoteValue(selectedYear, FRN) || "" }}
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
