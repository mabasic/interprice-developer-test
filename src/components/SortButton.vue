<script>
import CaretDown from "./CaretDown.vue";
import CaretUp from "./CaretUp.vue";
import { ASC, DESC } from "../constants/SortDirection";

export default {
  props: {
    sortColumn: String,
    sortDirection: String,
    label: String,
    column: String,
  },
  created() {
    this.ASC = ASC;
    this.DESC = DESC;
  },
  methods: {
    changeSortDirection: function (column) {
      if (column !== this.sortColumn) {
        this.$emit("update:sortColumn", column);
        return;
      }

      if (this.sortDirection === DESC) {
        this.$emit("update:sortDirection", ASC);
      } else {
        this.$emit("update:sortDirection", DESC);
      }
    },
  },
  components: {
    CaretDown,
    CaretUp,
  },
};
</script>

<template>
  <button type="button" @click="changeSortDirection(column)">
    <span class="uppercase">{{ label }}</span>
    <CaretDown
      v-if="sortDirection === DESC && sortColumn === column"
      class="ml-1"
      v-bind:class="[sortColumn === column ? 'text-gray-800' : '']"
    />
    <CaretUp
      v-else
      class="ml-1"
      v-bind:class="[sortColumn === column ? 'text-gray-800' : '']"
    />
  </button>
</template>
