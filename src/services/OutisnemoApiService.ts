import {
  BaseService,
  GET,
  ServiceBuilder,
  RequestInterceptorFunction,
  ResponseInterceptorFunction,
} from "ts-retrofit";

/**
 * response model when call https://outisnemo.com/minimal-currency-converter/
 */
interface OutisnemoApiResponse {
  readonly success: boolean;
  readonly timestamp: number;
  readonly base: string;
  readonly date: string;
  readonly rates: ExchangeRates;
}

interface ExchangeRates {
  [key: string]: number;
}

class OutisnemoApiService extends BaseService {
  @GET("/minimal-currency-converter")
  async listExchangeRatesBaseEUR(): Promise<OutisnemoApiResponse> {
    return <OutisnemoApiResponse>{};
  }
}

const RequestInterceptor: RequestInterceptorFunction = (config) => {
  console.log("Before sending request to server.");
  config.params["timestamp"] = new Date().getTime();
  return config;
};

const ResponseInterceptor: ResponseInterceptorFunction = (response) => {
  console.log("After receiving response from server.");
  return response.data;
};

/**
 * fiat currency exchange rate api
 */
const fiatCurrencyExchangeRateApi = new ServiceBuilder()
  .setEndpoint("https://outisnemo.com")
  .setStandalone(true)
  .setTimeout(30000)
  .setRequestInterceptors(RequestInterceptor)
  .setResponseInterceptors(ResponseInterceptor)
  .build(OutisnemoApiService);

export default fiatCurrencyExchangeRateApi;
