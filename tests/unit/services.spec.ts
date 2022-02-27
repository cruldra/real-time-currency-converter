import fiatCurrencyExchangeRateApi from "@/services/OutisnemoApiService";

describe("services", () => {
  it("fiatCurrencyExchangeRateApi", async () => {
    const resp = await fiatCurrencyExchangeRateApi.listExchangeRatesBaseEUR();
    console.log(resp.rates["CNY"]);
  });
});
