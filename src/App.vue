<script>
import InterPriceComponent from "./components/InterPriceComponent.vue";
import JSONDATA from "./data.json";

export default {
  created() {
    this.JSONDATA = JSONDATA;
  },
  components: {
    InterPriceComponent,
  },
};
</script>

<template>
  <div id="app" class="flex justify-center">
    <InterPriceComponent :items="JSONDATA" class="m-4 w-full max-w-7xl" />
  </div>
</template>
