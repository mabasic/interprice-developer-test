<script>
export default {
  props: {
    years: Array,
  },
  data: function () {
    return {
      activeYears: this.years,
    };
  },
  methods: {
    toggleActiveYear: function (year) {
      const activeYearIndex = this.activeYears.indexOf(year);

      if (activeYearIndex > -1) {
        this.activeYears = this.activeYears.filter(
          (activeYear) => activeYear !== year
        );
      } else {
        this.activeYears = [...this.activeYears, year];
      }

      this.$emit("switch", this.activeYears);
    },
  },
  watch: {
    years: function (newYears) {
      this.activeYears = newYears;
    },
  },
};
</script>

<template>
  <div class="flex">
    <button
      type="button"
      class="border-t border-b border-r first:border-l first:rounded-tl first:rounded-bl last:rounded-tr last:rounded-br border-slate-500 px-2 py-1"
      v-bind:class="[
        activeYears.includes(year)
          ? 'bg-slate-500 text-white border-r-white last:border-r-slate-500'
          : '',
      ]"
      v-for="year in years"
      @click="toggleActiveYear(year)"
      :key="year"
    >
      {{ year }} YRS
    </button>
  </div>
</template>
