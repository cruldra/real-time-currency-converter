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
      <template #prefix>{{ getSymbolFromCurrency(currency) }}</template>
    </n-input-number>
    <n-select
      v-model:value="model.currencies[i]"
      filterable
      :options="options"
      size="large"
      @update:value="calc(latestUpdate, model.values[latestUpdate])"
    />
    <n-button
      v-if="i === model.currencies.length - 1"
      type="success"
      @click="
        model.currencies.push('USD');
        model.values.push(1);
        calc(latestUpdate, model.values[latestUpdate]);
      "
    >
      添加
    </n-button>
    <n-button
      v-if="model.currencies.length > 1"
      type="error"
      @click="
        model.currencies.splice(i, 1);
        model.values.splice(i, 1);
        latestUpdate.value = 0;
      "
    >
      删除
    </n-button>
  </n-space>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, reactive, ref, withDefaults } from "vue";
import getSymbolFromCurrency from "currency-symbol-map";
import {
  NInputNumber,
  NSpace,
  NSelect,
  SelectGroupOption,
  SelectOption,
  NButton,
} from "naive-ui";
import CurrencyListUtils from "@/utils/CurrencyListUtils";
import currencyConversionService from "@/services/CurrencyConversionService";
import MathUtils from "@/utils/MathUtils";
interface Model {
  currencies: string[];
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
    src?: string;

    /**
     * target currency codes
     */
    targets?: string[];
  }>(),
  {
    amount: 1,
    src: "CNY",
    targets: () => {
      return ["AED"];
    },
  }
);

//const { amount, src, targets } = toRefs(reactive(Object.assign({}, props)));

const model = reactive({
  currencies: [props.src, ...props.targets],
  values: [props.amount, ...Array(props.targets.length).fill(0)],
} as Model);

const currencies = CurrencyListUtils.get("zh_CN");
const options: Array<SelectOption | SelectGroupOption> = currencies.map(
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
const calc = (index: number, newValue: number) => {
  disableUpdate.value = true;
  let srcCurrency = model.currencies[index];
  let srcAmount = model.values[index];
  console.log({ srcCurrency, srcAmount });
  model.currencies.forEach(async (currency: string, i: number) => {
    if (i !== index) {
      model.values[i] = MathUtils.round(
        await currencyConversionService.convert(
          srcCurrency,
          currency,
          srcAmount
        ),
        6
      );

      console.log({ target: model.currencies[i], value: model.values[i] });
    }
  });
  latestUpdate.value = index;
  disableUpdate.value = false;
};
onMounted(async () => {
  calc(0, model.values[0]);
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
