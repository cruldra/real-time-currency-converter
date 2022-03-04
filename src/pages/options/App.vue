<template>
  <n-config-provider
    :theme="currentTheme.value"
    :locale="naiveUiLocale"
    :date-locale="naiveUiDateLocale"
  >
    <n-page-header>
      <template #title> {{ chrome_extension_name }}</template>
      <template #avatar>
        <n-avatar round :src="require('../../assets/copper_coins.png')" />
      </template>
      <template #extra>
        <n-space>
          <n-button size="small" @click="toggleTheme"
            >{{ nextThemeName }}
          </n-button>
        </n-space>
      </template>
      <n-layout embedded content-style="padding: 5px;">
        <n-form
          ref="formRef"
          :model="model"
          :rules="rules"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
          size="large"
          :style="{
            maxWidth: '640px',
          }"
        >
          <n-form-item
            :label="userSettingFormI18n.preferredApi.label"
            :path="userSettingFormI18n.items.preferredApi.path"
          >
            <n-radio-group
              v-model:value="model.preferredApi"
              name="preferredApiRadio"
            >
              <n-radio-button
                :key="api"
                v-for="api in supportedApis"
                :value="api"
                >{{ api }}</n-radio-button
              >
            </n-radio-group>
          </n-form-item>

          <n-form-item
            :label="userSettingFormI18n.items.updateFrequency.label"
            :path="userSettingFormI18n.items.updateFrequency.path"
          >
            <n-input-number v-model:value="model.updateFrequency" />
          </n-form-item>
          <n-form-item
            :label="userSettingFormI18n.apiKeys.label"
            :path="userSettingFormI18n.apiKeys.path"
          >
            <n-input
              v-model:value="model.apiKeys"
              placeholder="Textarea"
              type="textarea"
              :autosize="{
                minRows: 3,
                maxRows: 5,
              }"
            />
          </n-form-item>
          <n-form-item
            :label="userSettingFormI18n.enableHistoricalReporting.label"
            :path="userSettingFormI18n.enableHistoricalReporting.path"
          >
            <n-switch v-model:value="model.enableHistoricalReporting" />
          </n-form-item>
          <n-form-item
            :label="userSettingFormI18n.wordMarkingRules.label"
            :path="userSettingFormI18n.wordMarkingRules.path"
          >
            <n-input
              v-model:value="model.wordMarkingRules"
              placeholder="Textarea"
              type="textarea"
              :autosize="{
                minRows: 3,
                maxRows: 5,
              }"
            />
          </n-form-item>
        </n-form>
      </n-layout>
    </n-page-header>
    <n-global-style />
  </n-config-provider>
</template>

<script lang="ts" setup>
import {
  NLayout,
  NPageHeader,
  NButton,
  NSpace,
  NAvatar,
  NConfigProvider,
  NGlobalStyle,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NRadioButton,
  NSwitch,
} from "naive-ui";
import UseTheme from "@/hooks/useTheme";
import useI18n from "@/hooks/useI18n";
import { onMounted, reactive, Ref, ref } from "vue";
import { IUserSetting } from "@/models/IUserSetting";
import userSettingRepository from "@/repositories/UserSettingRepository";
import ObjectMapper, { Transformers } from "@/utils/ObjectMapper";
import { supportedApis } from "@/services/ExchangeRateApiService";

const { currentTheme, nextThemeName, toggleTheme } = UseTheme();
const { chrome_extension_name, naiveUiLocale, naiveUiDateLocale } = useI18n();

const { userSettingFormI18n } = await useI18n();
type TFormItemNames = keyof IUserSetting;
let model: {
  [key in TFormItemNames]?: string | number | boolean;
} = reactive({});
const rules = {
  preferredApi: {
    required: true,
    trigger: ["blur"],
    message: userSettingFormI18n.preferredApi?.label,
  },
};
onMounted(async () => {
  try {
    model = ObjectMapper.map(await userSettingRepository.get(), {
      apiKeys: Transformers.ArrayToString(),
      wordMarkingRules: Transformers.ArrayToString(),
    });
  } catch (e) {
    console.error(e);
  }
});
</script>

<style lang="scss">
body {
  padding: 5px;
}
</style>
