import CurrencyList from "currency-list";
import { continents, countries } from "countries-list";
import getSymbolFromCurrency from "currency-symbol-map";
describe("currency-list", () => {
  it("with zh_CN", () => {
    const currencies = CurrencyList.getAll("zh_CN");
    Object.keys(currencies).forEach((currencyCode) => {
      //const countryCode = currencyCode.substring(0, 2);
      const country = Object.values(countries).find((country) =>
        country.currency.includes(currencyCode)
      );

      console.log(
        `${country?.name} ${getSymbolFromCurrency(currencyCode)} ${
          country?.emoji
        } ${currencyCode}`
      );
    });

    /*const options: Array<SelectOption | SelectGroupOption> = Object.keys(
      continents
    ).map((continentCode) => {
      return {
        type: "group",
        label: continentCode,
        key: continentCode,
        children: Object.values(countries)
          .filter((country) => {
            return country.continent == continentCode;
          })
          .map((country) => {
            return {
              label: `${country.emoji} —— ${country.name} ${country.currency}`,
              value: `${country.name}.${country.currency}`,
              ...country,
            };
          }),
      };
    });*/
  });
});
