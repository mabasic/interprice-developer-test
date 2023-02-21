<script>
import SortButton from "./SortButton.vue";
import { DATE_SENT, COMPANY } from "../constants/SortColumn";
import { DESC, ASC } from "../constants/SortDirection";
import pipe from "../helpers/pipe";
import numericSort from "../helpers/numeric-sort";
import DropdownRow from "./DropdownRow.vue";
import { FIX, FRN } from "../constants/CouponType";
import { format as formatDisplay } from "../constants/Display";

export function extractItemsWithNoQuote(data) {
  return data.filter((item) => !item.Quote);
}

export function extractItemsWithQuote(data) {
  return data.filter((item) => !!item.Quote);
}

export function filterByCompanyFilter(data, companyFilter) {
  return data.filter(
    (item) =>
      item.Company.toLowerCase().indexOf(companyFilter.toLowerCase()) !== -1
  );
}

export function parseDateSentToDate(data) {
  return data.map((item) => ({
    ...item,
    DateSent: !item.DateSent ? null : new Date(item.DateSent),
  }));
}

export function formatDateSent(data) {
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

export function toLowerCaseIfString(value) {
  return typeof value === "string" ? value.toLowerCase() : value;
}

export function sortItemsBy(data, field, direction) {
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
  <div class="mt-5">
    <!-- Header -->
    <div class="text-gray-500 flex border-b-2 border-gray-500 min-h-[52px]">
      <div class="w-[200px] flex items-end justify-center">
        <SortButton
          label="Date Sent"
          :column="DATE_SENT"
          v-bind:sortColumn.sync="sortColumn"
          v-bind:sortDirection.sync="sortDirection"
        />
      </div>
      <div class="grow flex items-end">
        <SortButton
          :label="COMPANY"
          :column="COMPANY"
          v-bind:sortColumn.sync="sortColumn"
          v-bind:sortDirection.sync="sortDirection"
        />
      </div>
      <div
        v-for="selectedYear in selectedYears"
        v-bind:key="selectedYear"
        class="w-[200px]"
      >
        <div
          class="border-b-2 border-b-gray-500 font-bold text-gray-800 text-center mx-1"
        >
          {{ selectedYear }} YRS
        </div>
        <div class="flex">
          <div class="w-1/2 text-center">FIX</div>
          <div class="w-1/2 text-center">FRN</div>
        </div>
      </div>
    </div>

    <!-- Body quoteItems -->
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

    <!-- Body noQuoteItems -->
    <div>
      <div
        class="flex border-b last:border-none border-gray-500"
        v-for="item in noQuoteItems"
        v-bind:key="`${item.Company}-${item.Id}`"
      >
        <div class="w-[200px] py-2">{{ item.DateSent }}</div>
        <div class="grow py-2 text-gray-500 font-semibold">
          {{ item.Company }}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex border-2 border-gray-500">
      <div class="w-[200px]"></div>
      <div class="grow py-2">Average by {{ selectedDisplay }}</div>
      <div
        class="flex w-[200px]"
        v-for="selectedYear in selectedYears"
        v-bind:key="selectedYear"
      >
        <div class="w-1/2 text-center py-2">
          {{ getAverageQuoteValue(selectedYear, FIX) || "" }}
        </div>
        <div class="w-1/2 text-center py-2">
          {{ getAverageQuoteValue(selectedYear, FRN) || "" }}
        </div>
      </div>
    </div>
  </div>
</template>
