import { Currency } from "@/models/Currency";
import currenciesData from "./currencies.json";
export type TCurrencies = typeof currenciesData;
export type TLocaleCodes = keyof TCurrencies;
export const currencies: TCurrencies = currenciesData;
interface CurrencyRepository {
  findByLocale(localeCode: TLocaleCodes): Currency[];
}
class DefaultCurrencyRepository implements CurrencyRepository {
  findByLocale(localeCode: TLocaleCodes = "zh_CN"): Currency[] {
    return Object.values(currencies[localeCode]).map((it) => it as Currency);
  }
}
const currencyRepository = new DefaultCurrencyRepository();
export default currencyRepository;
