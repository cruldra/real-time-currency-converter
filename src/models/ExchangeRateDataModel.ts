import { LocalDateTime } from "@js-joda/core";

export interface ExchangeRateDataModel {
  srcCode: string;
  targetCode: string;
  updateTime: LocalDateTime;
  value: number;
}
