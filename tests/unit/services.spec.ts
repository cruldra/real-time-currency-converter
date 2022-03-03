import exchangeRateApi from "@/services/ExchangeRateApiService";

describe("services", () => {
  it("fiatCurrencyExchangeRateApi", async () => {
    const rates = await exchangeRateApi.latest();
    console.log(rates["CNY"]);
  });
});
