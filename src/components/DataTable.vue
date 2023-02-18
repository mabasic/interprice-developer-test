<script>
import SortButton from "./SortButton.vue";
import { DATE_SENT, COMPANY } from "../constants/SortColumn";
import { DESC } from "../constants/SortDirection";

function extractItemsWithNoQuote(data) {
  return data.Items.filter((item) => !item.Quote);
}

export default {
  props: {
    items: Object,
    companyFilter: String,
    selectedYears: Array,
    selectedDisplay: String,
    displays: Array,
    selectedCurrency: String,
  },
  created() {
    this.DATE_SENT = DATE_SENT;
    this.COMPANY = COMPANY;
  },
  data: function () {
    return {
      sortDirection: DESC,
      sortColumn: DATE_SENT,
    };
  },
  computed: {
    noQuoteItems: function () {
      return extractItemsWithNoQuote(this.items);
    },
  },
  components: {
    SortButton,
  },
  methods: {
    handleSortColumnChange: function (sortColumn) {
      // NOTE: When the user changes the sort column,
      // the sort direction should be descending.
      this.sortColumn = sortColumn;
      this.sortDirection = DESC;
    },
  },
};
</script>

<template>
  <table class="w-full">
    <thead class="text-gray-500">
      <tr class="border-b-2 border-gray-500">
        <td class="text-center align-bottom">
          <SortButton
            :label="DATE_SENT"
            :sortColumn="sortColumn"
            v-on:update:sortColumn="handleSortColumnChange"
            v-bind:sortDirection.sync="sortDirection"
          />
        </td>
        <td class="align-bottom">
          <SortButton
            :label="COMPANY"
            :sortColumn="sortColumn"
            v-on:update:sortColumn="handleSortColumnChange"
            v-bind:sortDirection.sync="sortDirection"
          />
        </td>
        <td v-for="selectedYear in selectedYears" v-bind:key="selectedYear">
          <div class="px-2">
            <div
              class="text-center border-b-2 border-b-gray-500 font-semibold text-gray-800"
            >
              {{ selectedYear }} YRS
            </div>
            <div class="flex justify-around">
              <span>FIX</span>
              <span>FRN</span>
            </div>
          </div>
        </td>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in noQuoteItems"
        v-bind:key="item.Id"
        class="border-b border-gray-500"
      >
        <td class="py-2">{{ item.DateSent }}</td>
        <td class="py-2">{{ item.Company }}</td>
        <td
          class="py-2"
          v-for="selectedYear in selectedYears"
          v-bind:key="selectedYear"
        ></td>
      </tr>
    </tbody>
  </table>
</template>
