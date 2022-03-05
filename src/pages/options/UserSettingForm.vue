<template>
  <n-form
    ref="userSettingForm"
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
      :label="items.preferredApi.label"
      :path="items.preferredApi.path"
    >
      <n-radio-group
        v-model:value="model.preferredApi"
        name="preferredApiRadio"
      >
        <n-radio-button
          :key="api.name"
          v-for="api in supportedApis"
          :value="api.name"
          >{{ api.name }}
        </n-radio-button>
      </n-radio-group>
    </n-form-item>

    <n-form-item
      :label="items.updateFrequency.label"
      :path="items.updateFrequency.path"
    >
      <n-input-number v-model:value="model.updateFrequency" />
    </n-form-item>
    <n-form-item
      :label="items.apiKeys.label"
      v-if="model.preferredApi === 'OpenExchange'"
      :path="items.apiKeys.path"
    >
      <n-space vertical>
        <n-input
          v-model:value="model.apiKeys"
          :placeholder="items.apiKeys.placeholder"
          type="textarea"
          :autosize="{
            minRows: 5,
            maxRows: 50,
          }"
        />
        <n-button
          text
          @click="
            window.location.href = supportedApis.find(
              (api) => api.name === 'OpenExchange'
            ).referLink
          "
        >
          {{ items.apiKeys.referLink }}
        </n-button>
      </n-space>
    </n-form-item>
    <n-form-item
      :label="items.enableHistoricalReporting.label"
      :path="items.enableHistoricalReporting.path"
    >
      <n-switch v-model:value="model.enableHistoricalReporting" />
    </n-form-item>
    <n-form-item
      :label="items.wordMarkingRules.label"
      :path="items.wordMarkingRules.path"
    >
      <n-input
        v-model:value="model.wordMarkingRules"
        :placeholder="items.wordMarkingRules.placeholder"
        type="textarea"
        :autosize="{
          minRows: 5,
          maxRows: 50,
        }"
      />
    </n-form-item>

    <div style="display: flex; justify-content: flex-end">
      <n-button round type="primary" @click="saveUserSetting"> 保存 </n-button>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
import {
  FormInst,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NRadioButton,
  NRadioGroup,
  NSwitch,
  NButton,
  NSpace,
  useMessage,
} from "naive-ui";
import { onMounted, ref, Ref } from "vue";
import useI18n, {
  TUserSettingFormItemNames,
  TUserSettingFormItems,
} from "@/hooks/useI18n";
import ObjectMapper, { Transformers } from "@/utils/ObjectMapper";
import userSettingRepository from "@/repositories/UserSettingRepository";
import { supportedApis } from "@/services/ExchangeRateApiService";
import { IUserSetting } from "@/models/IUserSetting";
const { userSettingFormI18n } = useI18n();

let model: Ref<{
  [key in TUserSettingFormItemNames]?: string | number | boolean;
}> = ref({});
const items: TUserSettingFormItems = userSettingFormI18n.items;
const rules = {
  preferredApi: {
    required: true,
    trigger: ["blur"],
    message: items.preferredApi?.required_message,
  },
};
const message = useMessage();
const userSettingForm = ref<FormInst | null>(null);
const saveUserSetting = (e: MouseEvent) => {
  e.preventDefault();
  userSettingForm.value?.validate((errors) => {
    if (!errors) {
      const latest: IUserSetting = ObjectMapper.map(model.value, {
        apiKeys: Transformers.StringToArray(),
        wordMarkingRules: Transformers.StringToArray(),
      }) as IUserSetting;
      userSettingRepository
        .save(latest)
        .then(() => {
          message.success(userSettingFormI18n.save.success);
        })
        .catch((reason) => {
          if (typeof userSettingFormI18n.save.fail == "function")
            message.error(
              userSettingFormI18n.save.fail(JSON.stringify(reason))
            );
        });
    }
  });
};
onMounted(async () => {
  const userSetting = await userSettingRepository.get();
  console.log(userSetting);
  model.value = ObjectMapper.map(userSetting, {
    apiKeys: Transformers.ArrayToString(),
    wordMarkingRules: Transformers.ArrayToString(),
  });
});
</script>

<style scoped></style>
