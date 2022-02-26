import { DateTimeFormatter, LocalDateTime } from "@js-joda/core";

describe("js-joda", () => {
  it("local-datetime", () => {
    const now = LocalDateTime.now().format(
      DateTimeFormatter.ofPattern("yyyy-MM-dd")
    );
    console.log(now);
  });
});
