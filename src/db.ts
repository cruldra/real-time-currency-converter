import Dexie, { Table } from "dexie";
import { ExchangeRateDataModel } from "@/models/ExchangeRateDataModel";

export class CurrencyConverterDatabase extends Dexie {
  exchangeRates!: Table<ExchangeRateDataModel>;

  constructor() {
    super("CurrencyConverterDatabase");
    this.version(1).stores({
      exchangeRates: "[srcCode+targetCode]", // Primary key and indexed props
    });
  }
}

export const db = new CurrencyConverterDatabase();
