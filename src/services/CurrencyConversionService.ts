import exchangeRateRepository from "@/repositories/ExchangeRateRepository";

export interface CurrencyConversionService {
  convert(srcCode: string, targetCode: string, amount: number): Promise<number>;
}

export class DefaultCurrencyConversionService
  implements CurrencyConversionService
{
  async convert(
    srcCode: string,
    targetCode: string,
    amount: number
  ): Promise<number> {
    const rate = await exchangeRateRepository.findBy(srcCode, targetCode);
    return rate * amount;
  }
}

const currencyConversionService = new DefaultCurrencyConversionService();

export default currencyConversionService;
