<template>
  <n-space v-for="(currency, i) in model.currencies" :key="i">
    <n-input-number
      :show-button="true"
      v-model:value="model.values[i]"
      min="0"
      size="large"
      class="amount"
      @update:value="!disableUpdate && calc(i, $event)"
    >
      <template #prefix>{{ getCurrencySymbol(currency) }}</template>
    </n-input-number>
    <n-select
      v-model:value="model.currencies[i]"
      filterable
      :options="options"
      size="large"
      @update:value="calc(latestUpdate)"
    />
    <n-button
      v-if="i === model.currencies.length - 1"
      type="success"
      @click="
        model.currencies.push('USD');
        model.values.push(1);
        calc(latestUpdate);
      "
    >
      {{ addNewConversionButtonText }}
    </n-button>
    <n-button
      v-if="model.currencies.length > 1"
      type="error"
      @click="
        model.currencies.splice(i, 1);
        model.values.splice(i, 1);
        latestUpdate = 0;
      "
    >
      {{ deleteConversionButtonText }}
    </n-button>
  </n-space>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, reactive, ref, withDefaults } from "vue";
import {
  NInputNumber,
  NSpace,
  NSelect,
  SelectGroupOption,
  SelectOption,
  NButton,
} from "naive-ui";
import currencyConversionService from "@/services/CurrencyConversionService";
import MathUtils from "@/utils/MathUtils";
import useI18n from "@/hooks/useI18n";
import { TCurrencyCodes } from "@/repositories/CurrencyRepository";
import exchangeRateRepository from "@/repositories/ExchangeRateRepository";
interface Model {
  currencies: TCurrencyCodes[];
  values: number[];
}
const props = withDefaults(
  defineProps<{
    /**
     * amount of source currency
     * */
    amount?: number;

    /**
     * source currency code
     */
    src?: TCurrencyCodes;

    /**
     * target currency codes
     */
    targets?: TCurrencyCodes[];
  }>(),
  {
    amount: 1,
    src: "CNY",
    targets: (): TCurrencyCodes[] => {
      return ["AED"];
    },
  }
);

//const { amount, src, targets } = toRefs(reactive(Object.assign({}, props)));
const {
  addNewConversionButtonText,
  deleteConversionButtonText,
  currencies,
  getCurrencySymbol,
} = useI18n();
const model = reactive({
  currencies: [props.src, ...props.targets],
  values: [props.amount, ...Array(props.targets.length).fill(0)],
} as Model);

const options: Array<SelectOption | SelectGroupOption> = currencies.value.map(
  (currency) => {
    return {
      label: `${currency.emoji} ${currency.code} —— ${currency.name}`,
      value: `${currency.code}`,
      ...currency,
    };
  }
);

const disableUpdate = ref(false);
const latestUpdate = ref(0);
const calc = (index: number) => {
  disableUpdate.value = true;
  let srcCurrency = model.currencies[index];
  let srcAmount = model.values[index];
  model.currencies.forEach(async (currency: TCurrencyCodes, i: number) => {
    if (i !== index) {
      const targetAmount = await currencyConversionService.convert(
        srcCurrency,
        currency,
        srcAmount
      );
      model.values[i] = MathUtils.round(targetAmount, 6);

      console.log({
        srcCurrency,
        srcAmount,
        targetCurrency: currency,
        targetValue: targetAmount,
        rate: await exchangeRateRepository.findBy(srcCurrency, currency),
      });
    }
  });
  latestUpdate.value = index;
  disableUpdate.value = false;
};
onMounted(async () => {
  console.log(model);
  calc(0);
});
</script>

<style scoped lang="scss">
.amount {
  width: 200px;
}
:deep(.n-input__prefix) {
  width: 25px;
  transition: color 0.3s var(--n-bezier);
  flex-wrap: nowrap;
  flex-shrink: 0;
  line-height: var(--n-height);
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
