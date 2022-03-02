<template>
  <n-config-provider :theme="currentTheme.value">
    <n-page-header>
      <template #title> 实时货币转换器 </template>
      <template #avatar>
        <n-avatar round :src="require('../../assets/copper_coins.png')" />
      </template>
      <template #extra>
        <n-space>
          <n-button size="small" @click="toggleTheme">{{
            nextThemeName
          }}</n-button>
          <n-button size="small">催更</n-button>
        </n-space>
      </template>
      <n-layout embedded content-style="padding: 5px;">
        <currency-converter />
      </n-layout>
    </n-page-header>
    <n-global-style />
  </n-config-provider>
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount } from "vue";
import reloadAllExchangeRateJob from "@/jobs/ReloadAllExchangeRateJob";
import CurrencyConverter from "@/components/CurrencyConverter.vue";
import {
  NLayout,
  NPageHeader,
  NButton,
  NSpace,
  NAvatar,
  NConfigProvider,
  NGlobalStyle,
} from "naive-ui";
import UseTheme from "@/hooks/useTheme";
const { currentTheme, nextThemeName, toggleTheme } = UseTheme();

onBeforeMount(() => {
  reloadAllExchangeRateJob.start();
});
onBeforeUnmount(() => {
  reloadAllExchangeRateJob.stop();
});
</script>

<style lang="scss">
body {
  width: 600px;
  padding: 5px;
}
</style>
