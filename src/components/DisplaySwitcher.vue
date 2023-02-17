<script>
export default {
  props: {
    displays: Array,
  },
  data: function () {
    return {
      activeDisplay: this.displays?.[0],
    };
  },
  methods: {
    setActiveDisplay: function (display) {
      this.activeDisplay = display;

      this.$emit("switch", display);
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
        activeDisplay === display ? 'bg-slate-500 text-white' : '',
      ]"
      v-for="display in displays"
      @click="setActiveDisplay(display)"
      :key="display"
    >
      {{ display }}
    </button>
  </div>
</template>
