<script>
import numericSort from "../helpers/numeric-sort";

export default {
  props: {
    items: Array,
  },
  data: function () {
    return {
      active: this.items,
    };
  },
  methods: {
    toggleActive: function (item) {
      const activeItemIndex = this.active.indexOf(item);

      if (activeItemIndex > -1) {
        this.active = this.active.filter((activeItem) => activeItem !== item);
      } else {
        this.active = [...this.active, item].sort(numericSort);
      }

      this.$emit("toggle", this.active);
    },
  },
  watch: {
    items: function (newVal) {
      this.active = newVal;
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
        active.includes(item)
          ? 'bg-slate-500 text-white border-r-white last:border-r-slate-500'
          : 'text-slate-500',
      ]"
      v-for="item in items"
      @click="toggleActive(item)"
      :key="item"
    >
      {{ item }} YRS
    </button>
  </div>
</template>
