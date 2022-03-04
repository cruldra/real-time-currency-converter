import apiFactory, {
  ExchangeRates,
  TApi,
} from "@/services/ExchangeRateApiService";
import { db } from "@/db";
import { IExchangeRate } from "@/models/IExchangeRate";
import { LocalDate } from "@js-joda/core";
import MathUtils from "@/utils/MathUtils";
import DateUtils from "@/utils/DateUtils";
import { TCurrencyCodes } from "@/repositories/CurrencyRepository";
import userSettingRepository from "@/repositories/UserSettingRepository";

/**
 * Data service of currency exchange rate
 */
interface ExchangeRateRepository {
  /**
   * Load exchange rate table for a day
   * @param date Date the exchange rate was published
   */
  table(date: LocalDate): void;
  /**
   * get exchange rate between {@link srcCode} and {@link targetCode}
   * @param srcCode source currency code
   * @param targetCode target currency code
   * @param baseCode if no direct exchange rate between srcCode and targetCode is found,it will be calculated from this base value
   * @param decimal decimal of returned exchange rate value
   * @param date date the exchange rate was published
   */
  findBy(
    srcCode: TCurrencyCodes,
    targetCode: TCurrencyCodes,
    baseCode: TCurrencyCodes,
    decimal: number,
    date: LocalDate
  ): Promise<number>;
}

class DefaultExchangeRateDataService implements ExchangeRateRepository {
  private readonly baseCode: TCurrencyCodes;

  constructor(baseCode: TCurrencyCodes = "USD") {
    this.baseCode = baseCode;
  }

  async table(date: LocalDate = LocalDate.now()): Promise<void> {
    let rates: ExchangeRates | undefined = undefined;
    const userSetting = await userSettingRepository.get();
    const exchangeRateApi = apiFactory(<TApi>userSetting.preferredApi);
    const dateStr = DateUtils.toString(date);
    if (date.isEqual(LocalDate.now())) {
      rates = await exchangeRateApi.latest(this.baseCode);
    } else if (
      date.isBefore(LocalDate.now()) &&
      (
        await db.exchangeRates
          .where({
            date: dateStr,
          })
          .toArray()
      ).length == 0
    ) {
      rates = await exchangeRateApi.histories(dateStr, this.baseCode);
    } else
      throw new Error(
        `Wrong date of ${dateStr}.Must specify today or a previous date`
      );

    if (rates) {
      const data = Object.keys(rates).map((k) => {
        return {
          srcCode: this.baseCode,
          targetCode: k,
          value: rates ? rates[k] : 0,
          date: dateStr,
        } as IExchangeRate;
      });
      db.exchangeRates
        .bulkPut(data)
        .then(() => {
          console.log(`Done adding ${data.length} ExchangeRateDataModels`);
        })
        .catch((e) => {
          console.error(e);
          console.error(
            `Some ExchangeRateDataModels did not succeed. However,${
              data.length - e.failures.length
            }ExchangeRateDataModels was added successfully`
          );
        });
    }
  }

  async findBy(
    srcCode: TCurrencyCodes,
    targetCode: TCurrencyCodes,
    baseCode: TCurrencyCodes | undefined = this.baseCode,
    decimal = 6,
    date: LocalDate = LocalDate.now()
  ): Promise<number> {
    const dateStr = DateUtils.toString(date);
    const directExchangeRate = await db.exchangeRates
      .where({
        date: dateStr,
        srcCode,
        targetCode,
      })
      .first();
    if (directExchangeRate == undefined) {
      const rateOfBaseToSrc = await db.exchangeRates
        .where({
          srcCode: baseCode,
          targetCode: srcCode,
          date: dateStr,
        })
        .first();
      const rateOfBaseToTarget = await db.exchangeRates
        .where({
          srcCode: baseCode,
          targetCode,
          date: dateStr,
        })
        .first();
      if (rateOfBaseToTarget?.value && rateOfBaseToSrc?.value) {
        return MathUtils.round(
          rateOfBaseToTarget?.value / rateOfBaseToSrc?.value,
          decimal
        );
      } else return 0;
    } else return MathUtils.round(directExchangeRate.value, decimal);
  }
}

/**
 * global currency exchange rate data service
 */
const exchangeRateRepository = new DefaultExchangeRateDataService();
export default exchangeRateRepository;
