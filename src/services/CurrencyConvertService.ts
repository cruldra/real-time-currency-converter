export interface CurrencyConvertService {
  convert(srcCode: string, targetCode: string, amount: number): number;
}

/*export class FiatCurrencyConvertService implements CurrencyConvertService {


}*/
