import { getGlobalIp } from "./getGlobalIp";
import { describe, test } from "vitest";

describe("global ip", () => {
  test("ifconf", async () => {
    console.log(await getGlobalIp());
  });
});
