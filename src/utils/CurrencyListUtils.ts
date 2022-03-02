import { Currency } from "@/models/Currency";
import CurrencyList from "currency-list";
import { countries } from "countries-list";
import getSymbolFromCurrency from "currency-symbol-map";

export default class CurrencyListUtils {
  private static currencies: Currency[] = [];

  static get(locale = "en_US"): Currency[] {
    if (CurrencyListUtils.currencies.length == 0) {
      const currencies = CurrencyList.getAll(locale);
      CurrencyListUtils.currencies = Object.keys(currencies)
        .filter((currencyCode) => !["LVL", "LTL", "EEK"].includes(currencyCode))
        .map((currencyCode) => {
          const currencyJson = currencies[currencyCode];
          const countryCode = currencyCode.substring(0, 2);
          const currency = {
            name: currencyJson["name"],
            code: currencyJson["code"],
          } as Currency;
          if (countryCode == "VE") {
            currency.code = "VES";
          }
          if (countryCode == "ZW") {
            currency.code = "ZWD";
            currency.emoji = "🇿🇼";
          }
          if (countryCode == "ZM") {
            currency.code = "ZMW";
          }
          const country = Object.values(countries).find((country) =>
            country.currency.includes(currency.code)
          );
          if (country) {
            currency.emoji = country.emoji;
          }

          if (currency.code == "TWD") {
            currency.emoji = "🇨🇳";
          }
          if (currency.code == "EUR") {
            currency.emoji = "🇪🇺";
          }
          currency.symbol = getSymbolFromCurrency(currency.code) ?? "";
          console.log(`${country?.name} ${country?.emoji} ${currencyCode}`);
          return currency;
        });
      /*.filter((currency) => {
          return exchangeRateRepository
            .supportedCurrencyCodes()
            .includes(currency.code);
        })*/
    }

    return CurrencyListUtils.currencies;
  }
}
