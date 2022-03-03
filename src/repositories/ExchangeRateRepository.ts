import fiatCurrencyExchangeRateApi from "@/services/ExchangeRateApiService";
import { db } from "@/db";
import { ExchangeRateDataModel } from "@/models/ExchangeRateDataModel";
import { LocalDateTime } from "@js-joda/core";
import MathUtils from "@/utils/MathUtils";

/**
 * Data service of currency exchange rate
 */
interface ExchangeRateRepository {
  /**
   * load latest currency exchange rates table
   */
  reloadAll(): void;

  /**
   * list of supported currency codes
   */
  supportedCurrencyCodes(): string[];
  /**
   * get exchange rate between {@link srcCode} and {@link targetCode}
   * @param srcCode source currency code
   * @param targetCode target currency code
   * @param baseCode if no direct exchange rate between srcCode and targetCode is found,it will be calculated from this base value
   * @param decimal decimal of returned exchange rate value
   */
  findBy(
    srcCode: string,
    targetCode: string,
    baseCode: string,
    decimal: number
  ): Promise<number>;
}

class DefaultExchangeRateDataService implements ExchangeRateRepository {
  private _supportedCurrencyCodes: string[] = [];

  private readonly baseCode: string | undefined;

  constructor(baseCode = "USD") {
    this.baseCode = baseCode;
  }

  async reloadAll(): Promise<void> {
    const rates = await fiatCurrencyExchangeRateApi.latest(this.baseCode);
    await db.exchangeRates.clear();
    this._supportedCurrencyCodes = Object.keys(rates);
    const data = this._supportedCurrencyCodes.map((k) => {
      return {
        srcCode: this.baseCode,
        targetCode: k,
        value: rates[k],
        updateTime: LocalDateTime.now(),
      } as ExchangeRateDataModel;
    });
    db.exchangeRates
      .bulkAdd(data)
      .then(() => {
        console.log(`Done adding ${data.length} ExchangeRateDataModels`);
      })
      .catch((e) => {
        console.error(
          `Some ExchangeRateDataModels did not succeed. However,${
            data.length - e.failures.length
          }ExchangeRateDataModels was added successfully`
        );
      });
  }
  supportedCurrencyCodes(): string[] {
    return this._supportedCurrencyCodes;
  }
  async findBy(
    srcCode: string,
    targetCode: string,
    baseCode = this.baseCode,
    decimal = 6
  ): Promise<number> {
    const exchangeRateEntry = await db.exchangeRates
      .where({
        srcCode,
        targetCode,
      })
      .first();
    if (exchangeRateEntry == undefined) {
      const rateOfBaseToSrc = await db.exchangeRates
        .where({
          srcCode: baseCode,
          targetCode: srcCode,
        })
        .first();
      const rateOfBaseToTarget = await db.exchangeRates
        .where({
          srcCode: baseCode,
          targetCode,
        })
        .first();
      if (rateOfBaseToTarget?.value && rateOfBaseToSrc?.value) {
        return MathUtils.round(
          rateOfBaseToTarget?.value / rateOfBaseToSrc?.value,
          decimal
        );
      } else return 0;
    } else return exchangeRateEntry.value;
  }
}

/**
 * global currency exchange rate data service
 */
const exchangeRateRepository = new DefaultExchangeRateDataService();
export default exchangeRateRepository;
