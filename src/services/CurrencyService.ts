export interface CurrencyService {
  readonly code: string;

  /**
   * 获取和另一种货币{@link otherCurrencyCode}之间的汇率
   * @param otherCurrencyCode 其它货币代码
   */
  getExchangeRate(otherCurrencyCode: string): number;
}

/**
 * 法定货币转换服务
 */
export class FiatCurrencyService implements CurrencyService {
  readonly code: string;

  constructor(code: string) {
    this.code = code;
  }

  getExchangeRate(otherCurrencyCode: string): number {
    return 0;
  }
}
