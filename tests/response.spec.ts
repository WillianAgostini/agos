import httpMocks from "node-mocks-http";
import { responseToJson } from "../src/response";

describe("response", () => {
  it("Should return JSON", async () => {
    const response = httpMocks.createResponse();
    response.toJson = responseToJson;
    response.toJson({ name: "Bob Dog", age: 42, email: "bob@dog.com" });
    response.statusCode = 200;

    expect(response._getJSONData()).toEqual({
      name: "Bob Dog",
      age: 42,
      email: "bob@dog.com",
    });
    expect(response._isJSON()).toBe(true);
    expect(response._isUTF8()).toBe(false);
    expect(response._isEndCalled()).toBe(true);
  });
});
