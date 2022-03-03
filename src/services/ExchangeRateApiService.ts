import {
  BaseService,
  GET,
  ServiceBuilder,
  RequestInterceptorFunction,
  ResponseInterceptorFunction,
  BasePath,
  Query,
} from "ts-retrofit";
import ArrayUtils from "@/utils/ArrayUtils";
interface ExchangeRateApiService {
  latest(base: string): Promise<ExchangeRates>;
}

interface ExchangeRates {
  [key: string]: number;
}

class OutisnemoApiService
  extends BaseService
  implements ExchangeRateApiService
{
  @GET("/minimal-currency-converter")
  async latest(base = "EUR"): Promise<ExchangeRates> {
    return <ExchangeRates>{};
  }
}
@BasePath("/api")
class OpenExchangeRatesApiService
  extends BaseService
  implements ExchangeRateApiService
{
  static apiKeys: string[] = ["15e0a8fb77f44c73baeb1614e548c284"];

  /**
   * Get the latest exchange rates available from the Open Exchange Rates API
   */
  @GET("/latest.json")
  async latest(@Query("base") base = "EUR"): Promise<ExchangeRates> {
    return <ExchangeRates>{};
  }
}

/**
 * fiat currency exchange rate api
 *
 * @deprecated This api is free, but it does not support historical exchange rate query
 */
const outisnemoApiService = new ServiceBuilder()
  .setEndpoint("https://outisnemo.com")
  .setStandalone(true)
  .setTimeout(30000)
  .setRequestInterceptors((config) => {
    console.log("Before sending request to server.");
    config.params["timestamp"] = new Date().getTime();
    return config;
  })
  .setResponseInterceptors((response) => {
    console.log("After receiving response from server.");
    return response.data["rates"];
  })
  .build(OutisnemoApiService);

const openExchangeRatesApiService = new ServiceBuilder()
  .setEndpoint("https://openexchangerates.org")
  .setStandalone(true)
  .setTimeout(30000)
  .setRequestInterceptors((config) => {
    console.log("Before sending request to server.");
    config.params["app_id"] = ArrayUtils.randomItem(
      OpenExchangeRatesApiService.apiKeys
    );
    return config;
  })
  .setResponseInterceptors((response) => {
    console.log("After receiving response from server.");

    return response.data["rates"];
  })
  .build(OpenExchangeRatesApiService);

const exchangeRateApi = openExchangeRatesApiService;
export default exchangeRateApi;
