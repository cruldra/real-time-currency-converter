<template>
  <n-layout embedded content-style="padding: 5px;">
    <currency-converter />
  </n-layout>
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount } from "vue";
import reloadAllExchangeRateJob from "@/jobs/ReloadAllExchangeRateJob";
import CurrencyConverter from "@/components/CurrencyConverter.vue";
import { NLayout } from "naive-ui";

onBeforeMount(() => {
  reloadAllExchangeRateJob.start();
});
onBeforeUnmount(() => {
  reloadAllExchangeRateJob.stop();
});
</script>

<style lang="scss">
body {
  width: 700px;
}
</style>
