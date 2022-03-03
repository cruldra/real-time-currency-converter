import {
  BaseService,
  GET,
  ServiceBuilder,
  BasePath,
  Query,
  Path,
} from "ts-retrofit";
import ArrayUtils from "@/utils/ArrayUtils";

/**
 * Exchange rate api service
 */
interface IExchangeRateApiService {
  /**
   * Get the latest exchange rates available from the remote api
   * @param base Change base currency (3-letter code, default: USD)
   */
  latest(base: string): Promise<ExchangeRates>;

  /**
   * Get historical exchange rates for any date available from the remote api
   * @param date The requested date in YYYY-MM-DD format (required).
   * @param base Change base currency (3-letter code, default: USD)
   */
  histories(date: string, base: string): Promise<ExchangeRates>;
}

export interface ExchangeRates {
  [key: string]: number;
}

class OutisnemoApiService
  extends BaseService
  implements IExchangeRateApiService
{
  @GET("/minimal-currency-converter")
  async latest(base = "EUR"): Promise<ExchangeRates> {
    return <ExchangeRates>{};
  }

  histories(date: string, base: string): Promise<ExchangeRates> {
    throw new Error("unsupported");
  }
}

@BasePath("/api")
class OpenExchangeRatesApiService
  extends BaseService
  implements IExchangeRateApiService
{
  static apiKeys: string[] = ["15e0a8fb77f44c73baeb1614e548c284"];

  @GET("/latest.json")
  async latest(@Query("base") base = "USD"): Promise<ExchangeRates> {
    return <ExchangeRates>{};
  }
  @GET("/historical/{date}.json")
  async histories(
    @Path("date") date: string,
    base = "USD"
  ): Promise<ExchangeRates> {
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