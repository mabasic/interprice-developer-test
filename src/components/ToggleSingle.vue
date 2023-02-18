<script>
export default {
  props: {
    items: Array,
  },
  data: function () {
    return {
      active: this.items?.[0],
    };
  },
  methods: {
    setActive: function (item) {
      this.active = item;

      this.$emit("toggle", item);
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
        active === item ? 'bg-slate-500 text-white' : 'text-slate-500',
      ]"
      v-for="item in items"
      @click="setActive(item)"
      :key="item"
    >
      {{ item }}
    </button>
  </div>
</template>
