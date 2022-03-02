import { ref } from "vue";
import { __SUPPORTED_LANGUAGES__ } from "@/global";
import { NLocale } from "naive-ui/lib/locales/common/enUS";
import { NDateLocale } from "naive-ui/lib/locales/date/enUS";
import StringUtils from "@/utils/StringUtils";
export default function () {
  const chrome_extension_name = ref(
    chrome.i18n.getMessage("chrome_extension_name")
  );
  const chrome_extension_description = ref(
    chrome.i18n.getMessage("chrome_extension_description")
  );
  const app_language = ref(chrome.i18n.getMessage("app_language"));
  const supportedLanguages = ref(__SUPPORTED_LANGUAGES__);
  const addNewConversionButtonText = ref(
    chrome.i18n.getMessage("add_conversion_button_text")
  );
  const deleteConversionButtonText = ref(
    chrome.i18n.getMessage("delete_conversion_button_text")
  );
  const naiveUiLocale = ref<NLocale | null>(null);
  const naiveUiDateLocale = ref<NDateLocale | null>(null);
  const localeString = chrome.i18n.getUILanguage().replace("-", "");
  const localeString2 = ref(chrome.i18n.getUILanguage().replace("-", "_"));
  import(`naive-ui`).then((navui: { [key: string]: any }) => {
    naiveUiLocale.value = <NLocale>navui[localeString];
    naiveUiDateLocale.value = <NDateLocale>(
      navui[`date${StringUtils.capitalizeFirst(localeString)}`]
    );
    console.log(naiveUiLocale);
    console.log(naiveUiDateLocale);
  });
  return {
    chrome_extension_name,
    chrome_extension_description,
    app_language,
    supportedLanguages,
    naiveUiLocale,
    naiveUiDateLocale,
    addNewConversionButtonText,
    deleteConversionButtonText,
    localeString2,
  };
}