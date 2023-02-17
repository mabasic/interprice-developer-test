<script>
export default {
  props: {
    currencies: Array,
  },
  data: function () {
    return {
      activeCurrency: this.currencies?.[0],
    };
  },
  methods: {
    setActiveCurrency: function (currency) {
      this.activeCurrency = currency;

      this.$emit("switch", currency);
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
        activeCurrency === currency ? 'bg-slate-500 text-white' : '',
      ]"
      v-for="currency in currencies"
      @click="setActiveCurrency(currency)"
      :key="currency"
    >
      {{ currency }}
    </button>
  </div>
</template>
